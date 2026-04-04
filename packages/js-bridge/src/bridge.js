/**
 * Chart engine bridge: loads WASM, creates ChartEngine, manages render loop.
 *
 * Method groups are split into separate modules for maintainability:
 *  - bridgeIndicators.js  — all indicator enable/disable/settings
 *  - bridgeDrawing.js     — drawing tools, markers, coordinate conversion
 *  - bridgeData.js        — kline, heatmap, footprint, chart type
 */

import { dispatchCommands } from './canvasRenderer'
import { setupEvents } from './eventHandler'
import { createIndicatorMethods } from './bridgeIndicators'
import { createDrawingMethods } from './bridgeDrawing'
import { createDataMethods } from './bridgeData'
import { createCustomIndicatorManager } from './customIndicators'
import { validateLicense, drawWatermark } from './license'
import { createFeatureGate } from './planFeatures'

let wasmModule = null
let wasmMemory = null
let wasmLoadPromise = null

async function loadWasm() {
  if (wasmModule) return wasmModule
  if (wasmLoadPromise) return wasmLoadPromise
  wasmLoadPromise = (async () => {
    const mod = await import('../wasm/chart_engine.js')
    await mod.default()
    wasmMemory = mod.wasm_memory()
    wasmModule = mod
    return mod
  })()
  return wasmLoadPromise
}

export function prefetchWasm() {
  if (!wasmModule && !wasmLoadPromise) {
    loadWasm().catch(() => {})
  }
}

export async function createChartBridge(canvas, options = {}) {
  // Mobile appId: set before validation so license.js can check it
  if (options.appId && typeof window !== 'undefined') {
    window.__mrd_app_id = options.appId
  }

  const licenseKey = options.licenseKey || options.key || null
  let licenseInfo = validateLicense(licenseKey)

  if (!licenseInfo.valid) {
    if (licenseInfo.expired) {
      console.warn(`[MRD Chart Engine] ${licenseInfo.error}. Get a license at https://mrd-chart.dev/pricing`)
    } else {
      throw new Error(`[MRD Chart Engine] ${licenseInfo.error}`)
    }
  }

  if (licenseInfo.plan === 'trial') {
    console.info(
      `[MRD Chart Engine] Trial mode — ${licenseInfo.daysLeft} days remaining. ` +
      `Purchase: https://mrd-chart.dev/pricing`
    )
  }

  const wasm = await loadWasm()
  let dpr = window.devicePixelRatio || 1
  let rect = canvas.getBoundingClientRect()

  // On mobile/tablet the layout may not have settled yet; wait for non-zero size
  if (rect.width < 1 || rect.height < 1) {
    await new Promise(resolve => {
      const ro = new ResizeObserver((entries) => {
        for (const e of entries) {
          if (e.contentRect.width > 0 && e.contentRect.height > 0) {
            ro.disconnect()
            resolve()
            return
          }
        }
      })
      ro.observe(canvas.parentElement || canvas)
      setTimeout(() => { ro.disconnect(); resolve() }, 2000)
    })
    rect = canvas.getBoundingClientRect()
  }

  const initW = Math.max(rect.width, 100)
  const initH = Math.max(rect.height, 100)

  canvas.width = initW * dpr
  canvas.height = initH * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const engine = new wasm.ChartEngine(initW, initH)

  // Sync license state into WASM engine (renders watermark in binary buffer)
  try {
    const _s = licenseInfo.expired ? 2 : (licenseInfo.watermark ? 1 : 0)
    const _d = licenseInfo.daysLeft || 0
    let _h = 0x4d524443 >>> 0
    _h = (Math.imul(_h, 31) + _s) >>> 0
    _h = (Math.imul(_h, 31) + _d) >>> 0
    _h = (_h ^ (_h >>> 16)) >>> 0
    _h = Math.imul(_h, 0x45d9f3b) >>> 0
    _h = (_h ^ (_h >>> 16)) >>> 0
    engine.set_license_state(_s, _d, _h)
  } catch (e) {
    console.warn('[MRD] set_license_state failed:', e.message)
  }

  let dirty = true
  let rafId = null
  let running = false
  let paused = false
  let destroyed = false
  let tooltipCallback = null
  let throttleTimer = null
  let lastRenderTime = 0
  let _rendering = false
  let _engineDead = false

  const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 1399
  const MIN_FRAME_MS = isTouchDevice ? 33 : 0

  function scheduleRender() {
    if (!running || paused || rafId) return
    if (MIN_FRAME_MS > 0) {
      const elapsed = performance.now() - lastRenderTime
      if (elapsed < MIN_FRAME_MS) {
        if (!throttleTimer) {
          throttleTimer = setTimeout(() => {
            throttleTimer = null
            scheduleRender()
          }, MIN_FRAME_MS - elapsed)
        }
        return
      }
    }
    rafId = requestAnimationFrame(renderFrame)
  }

  const markDirty = () => {
    dirty = true
    scheduleRender()
  }
  const isDestroyed = () => destroyed

  let drawingApi = null
  let onDrawingComplete = null
  let onDrawingCancel = null
  let onDrawingSelected = null
  let onMarkerSelected = null
  let onDrawingDblClick = null
  let vrvpHoverCallback = null
  let ltHoverCallback = null
  let ltHoverLastCall = 0
  let postRenderCallback = null
  let liqAnnotationPinCallback = null

  // Deferred tooltip/lt state: updated by events, consumed in renderFrame.
  // Avoids WASM JSON serialization (get_tooltip_data) on every mouse event.
  let _tooltipSx = 0, _tooltipSy = 0, _tooltipZone = -1
  let _tooltipDirty = false
  let _crosshairVisible = false

  const cleanupEvents = setupEvents(canvas, engine, {
    onDirty: markDirty,
    onCrosshairMove: (sx, sy, zone) => {
      _tooltipSx = sx
      _tooltipSy = sy
      _tooltipZone = zone
      _tooltipDirty = true
      _crosshairVisible = true
    },
    onCrosshairHide: () => {
      if (_crosshairVisible) {
        _crosshairVisible = false
        _tooltipDirty = true
        _tooltipZone = -1
      }
    },
    drawingApi: (api) => { drawingApi = api },
    onDrawingComplete: () => { onDrawingComplete?.() },
    onDrawingCancel: () => { onDrawingCancel?.() },
    onDrawingSelected: (id, cx, cy) => { onDrawingSelected?.(id, cx, cy) },
    onMarkerSelected: (id) => { onMarkerSelected?.(id) },
    onDrawingDblClick: (id, sx, sy, cx, cy) => { onDrawingDblClick?.(id, sx, sy, cx, cy) },
    onVrvpHover: (sx, sy) => { vrvpHoverCallback?.(sx, sy) },
    onLiqAnnotationPin: (sx, sy) => { liqAnnotationPinCallback?.(sx, sy) },
  })

  function _flushTooltip() {
    if (!_tooltipDirty || _engineDead) return
    _tooltipDirty = false

    if (!_crosshairVisible) {
      if (tooltipCallback) tooltipCallback(null, 0, 0)
      if (ltHoverCallback) ltHoverCallback('')
      return
    }

    if (tooltipCallback) {
      if (_tooltipZone === 0 || _tooltipZone === 1) {
        try {
          const json = engine.get_tooltip_data()
          tooltipCallback(json, _tooltipSx, _tooltipSy)
        } catch {}
      } else {
        tooltipCallback(null, 0, 0)
      }
    }
    if (ltHoverCallback) {
      const now = performance.now()
      if (_tooltipZone === 0 || _tooltipZone === 1) {
        if (now - ltHoverLastCall >= 80) {
          ltHoverLastCall = now
          try { ltHoverCallback(engine.lt_hit_test(_tooltipSx, _tooltipSy)) } catch {}
        }
      } else {
        ltHoverCallback('')
      }
    }
  }

  function renderFrame() {
    rafId = null
    if (!running || paused || _engineDead) return
    _rendering = true
    try {
      let needRender = false
      try { needRender = dirty || engine.is_dirty() } catch { _engineDead = true; return }

      if (needRender) {
        dirty = false
        lastRenderTime = performance.now()
        let rendered = false
        try {
          const cmdCount = engine.render()
          if (cmdCount > 0) {
            const ptr = engine.get_command_buffer_ptr()
            const len = engine.get_command_buffer_len()
            ctx.save()
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.restore()
            dispatchCommands(ctx, wasmMemory, ptr, len)
            rendered = true
          }
          try { customIndicators.renderAll(ctx) } catch {}
        } catch (e) {
          if (!rendered) dirty = true
          if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; console.error('[MRD] Engine crashed:', e.message); return }
        }
        _flushTooltip()
        try { postRenderCallback?.() } catch {}

        if (licenseInfo.watermark) {
          try {
            const isLight = engine.get_theme() === 1
            drawWatermark(ctx, canvas, licenseInfo, isLight)
          } catch {}
        }

        try { if (dirty || engine.is_dirty()) scheduleRender() } catch {}
      }
    } finally {
      _rendering = false
    }
  }

  // Build method groups from modules
  let featureGate = createFeatureGate(licenseInfo.plan)
  const indicatorMethods = createIndicatorMethods(engine, markDirty, isDestroyed, () => featureGate)
  const drawingMethods = createDrawingMethods(engine, markDirty, isDestroyed, () => featureGate)
  const dataMethods = createDataMethods(engine, markDirty, isDestroyed, () => featureGate)
  const customIndicators = createCustomIndicatorManager(engine, wasmMemory, dispatchCommands)

  return {
    engine,

    // ── Lifecycle ──

    start() {
      running = true
      paused = false
      dirty = true
      scheduleRender()
    },

    stop() {
      running = false
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
      if (throttleTimer) { clearTimeout(throttleTimer); throttleTimer = null }
    },

    resize(retries) {
      if (_engineDead || _rendering) return
      rect = canvas.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) {
        if ((retries || 0) < 8) {
          setTimeout(() => this.resize((retries || 0) + 1), 250)
        }
        return
      }
      dpr = window.devicePixelRatio || 1
      const w = rect.width * dpr
      const h = rect.height * dpr
      canvas.width = w
      canvas.height = h
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      try {
        engine.resize(rect.width, rect.height)
      } catch (e) {
        if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }
        throw e
      }
      markDirty()
    },

    renderSync() {
      if (_engineDead) return 0
      try {
        const cmdCount = engine.render()
        if (cmdCount > 0) {
          const ptr = engine.get_command_buffer_ptr()
          const len = engine.get_command_buffer_len()
          ctx.save()
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.restore()
          dispatchCommands(ctx, wasmMemory, ptr, len)
        }
        return cmdCount
      } catch (e) {
        if (e instanceof WebAssembly.RuntimeError) { _engineDead = true }
        return 0
      }
    },

    // ── Price interaction ──

    setHoverPrice(price) {
      engine.set_hover_price(price)
      markDirty()
    },

    clearHoverPrice() {
      engine.clear_hover_price()
      markDirty()
    },

    hitZone(x, y) {
      return engine.hit_zone(x, y)
    },

    // ── Drawing mode (depends on drawingApi closure) ──

    startDrawing(tool, style) {
      drawingApi?.setMode(tool, style)
    },

    cancelDrawing() {
      drawingApi?.setMode(null)
    },

    // ── Drawing event callbacks ──

    onDrawingComplete(cb) { onDrawingComplete = cb },
    onDrawingCancel(cb) { onDrawingCancel = cb },
    onDrawingSelected(cb) { onDrawingSelected = cb },
    onMarkerSelected(cb) { onMarkerSelected = cb },
    onDrawingDblClick(cb) { onDrawingDblClick = cb },

    // ── Replay ──

    setReplayState(active, current, total) {
      engine.set_replay_state(active, current, total)
      markDirty()
    },

    setReplayHovered(hovered) {
      engine.set_replay_hovered(hovered)
    },

    setReplayPreview(screenX) {
      engine.set_replay_preview(screenX)
      markDirty()
    },

    // ── Misc settings ──

    setPrecision(decimals) {
      engine.set_price_precision(decimals)
      markDirty()
    },

    setCandleInterval(seconds) {
      engine.set_candle_interval(seconds)
    },

    setTheme(name) {
      const id = name === 'light' ? 1 : 0
      if (typeof engine.set_theme === 'function') {
        engine.set_theme(id)
        markDirty()
      } else {
        console.warn('[ChartEngine] set_theme not available — reload page to load updated WASM')
      }
    },

    getTheme() {
      return engine.get_theme() === 1 ? 'light' : 'dark'
    },

    // ── Event callbacks ──

    onTooltip(cb) {
      tooltipCallback = cb
    },

    onVrvpHover(cb) {
      vrvpHoverCallback = cb
    },

    onLtHover(cb) {
      ltHoverCallback = cb
    },

    onPostRender(cb) {
      postRenderCallback = cb
    },

    onLiqAnnotationPin(cb) {
      liqAnnotationPinCallback = cb
    },

    // ── Visibility / Power ──

    pause() {
      if (paused) return
      paused = true
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
      if (throttleTimer) { clearTimeout(throttleTimer); throttleTimer = null }
    },

    resume() {
      if (!paused) return
      paused = false
      if (running) {
        dirty = true
        scheduleRender()
      }
    },

    get isPaused() { return paused },

    // ── Destroy ──

    destroy() {
      destroyed = true
      running = false
      paused = false
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
      if (throttleTimer) { clearTimeout(throttleTimer); throttleTimer = null }
      cleanupEvents()
      try { engine.free() } catch {}
    },

    // ── Custom Indicator API ──

    addIndicator(config) {
      if (!featureGate('customIndicators')) return null
      const id = customIndicators.add(config)
      markDirty()
      return id
    },

    removeIndicator(id) {
      customIndicators.remove(id)
      markDirty()
    },

    updateIndicatorParams(id, params) {
      customIndicators.updateParams(id, params)
      markDirty()
    },

    setIndicatorEnabled(id, enabled) {
      customIndicators.setEnabled(id, enabled)
      markDirty()
    },

    listIndicators() {
      return customIndicators.list()
    },

    invalidateCustomIndicators() {
      customIndicators.invalidateCompute()
      markDirty()
    },

    // ── License ──

    get license() {
      return {
        plan: licenseInfo.plan,
        valid: licenseInfo.valid,
        expired: !!licenseInfo.expired,
        watermark: !!licenseInfo.watermark,
        daysLeft: licenseInfo.daysLeft,
        features: licenseInfo.features || {},
      }
    },

    setLicenseKey(newKey) {
      licenseInfo = validateLicense(newKey)
      if (!licenseInfo.valid && !licenseInfo.expired) {
        console.error(`[MRD Chart Engine] ${licenseInfo.error}`)
      }
      featureGate = createFeatureGate(licenseInfo.plan)
      try {
        const _s = licenseInfo.expired ? 2 : (licenseInfo.watermark ? 1 : 0)
        const _d = licenseInfo.daysLeft || 0
        let _h = 0x4d524443 >>> 0
        _h = (Math.imul(_h, 31) + _s) >>> 0
        _h = (Math.imul(_h, 31) + _d) >>> 0
        _h = (_h ^ (_h >>> 16)) >>> 0
        _h = Math.imul(_h, 0x45d9f3b) >>> 0
        _h = (_h ^ (_h >>> 16)) >>> 0
        engine.set_license_state(_s, _d, _h)
      } catch {}
      markDirty()
      return licenseInfo.valid
    },

    // ── Spread module methods ──
    ...dataMethods,
    ...indicatorMethods,
    ...drawingMethods,
  }
}
