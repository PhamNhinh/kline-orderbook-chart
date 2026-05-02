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

import { loadWasm as _loadWasm } from './wasmLoader'

function _hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16) || 0,
    parseInt(h.substring(2, 4), 16) || 0,
    parseInt(h.substring(4, 6), 16) || 0,
  ]
}

let wasmModule = null
let wasmMemory = null

async function loadWasm() {
  if (wasmModule) return wasmModule
  const { module, memory } = await _loadWasm()
  wasmModule = module
  wasmMemory = memory
  return module
}

export function prefetchWasm() {
  if (!wasmModule) {
    loadWasm().catch(() => {})
  }
}

export async function createChartBridge(canvas, options = {}) {
  // Mobile appId: set before validation so license.js can check it
  if (options.appId && typeof window !== 'undefined') {
    window.__mrd_app_id = options.appId
  }

  const licenseKey = options.licenseKey || options.key || null
  let licenseInfo = await validateLicense(licenseKey)

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
  let scaleX = dpr
  let scaleY = dpr
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

  canvas.width = Math.max(1, Math.round(initW * dpr))
  canvas.height = Math.max(1, Math.round(initH * dpr))
  const ctx = canvas.getContext('2d')
  scaleX = canvas.width / initW
  scaleY = canvas.height / initH
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0)

  const rawEngine = new wasm.ChartEngine(initW, initH)

  // Declared up-front so `_markEngineDead` (defined below) never hits a
  // Temporal Dead Zone on early WASM faults (e.g. during `set_touch_mode`
  // or `set_license_state`).
  let _engineDead = false

  // ── WASM fault containment ─────────────────────────────────────────────
  // A single WASM trap (memory access OOB, panic, recursive-borrow guard)
  // permanently poisons the module — every subsequent call will throw.  If
  // left unchecked, mouse events, realtime feeds, and the RAF loop each
  // re-enter the dead engine thousands of times per second and flood the
  // console.  We wrap the engine in a Proxy that:
  //   1. Detects the first wasm-bindgen fault and flips `lifecycle.dead`.
  //   2. Tears down event listeners once (so mouse/touch/keyboard stop
  //      calling in) and logs a single fatal message.
  //   3. No-ops every subsequent method invocation (returns undefined) —
  //      callers that expect a return value already have try/catch or
  //      `isDestroyed()` guards that map undefined to safe defaults.
  // Non-wasm errors continue to propagate so real bugs aren't hidden.
  const lifecycle = { dead: false, destroyed: false, cleanupEvents: null }

  function _markEngineDead(err) {
    if (lifecycle.dead) return
    lifecycle.dead = true
    _engineDead = true
    try {
      const msg = err?.message ? String(err.message) : String(err || 'unknown')
      console.error('[MRD Chart Engine] fatal WASM error — engine disabled:', msg)
    } catch {}
    try { lifecycle.cleanupEvents?.() } catch {}
  }

  function _isWasmFault(e) {
    if (!e) return false
    if (typeof WebAssembly !== 'undefined' && e instanceof WebAssembly.RuntimeError) return true
    const m = e.message ? String(e.message) : ''
    return (
      m.includes('memory access out of bounds') ||
      m.includes('recursive use of an object') ||
      m.includes('null pointer passed to rust') ||
      m.includes('unreachable')
    )
  }

  const engine = new Proxy(rawEngine, {
    get(target, prop) {
      const val = Reflect.get(target, prop)
      if (typeof val !== 'function') return val
      return function _safeWasmCall(...args) {
        if (lifecycle.dead) return undefined
        try {
          return val.apply(target, args)
        } catch (e) {
          if (_isWasmFault(e)) {
            _markEngineDead(e)
            return undefined
          }
          throw e
        }
      }
    },
  })

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouch) {
    try { engine.set_touch_mode(true) } catch {}
  }

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
  // Returned to sub-modules so they short-circuit when the engine is torn
  // down OR has hit a fatal WASM fault.  Without the `dead` check, data
  // providers (heatmap, kline, footprint, custom indicators) would keep
  // pushing bytes into a poisoned WASM instance on every realtime tick.
  const isDestroyed = () => destroyed || lifecycle.dead

  let drawingApi = null
  let onDrawingComplete = null
  let onDrawingCancel = null
  let onDrawingSelected = null
  let onMarkerSelected = null
  let onDrawingDblClick = null
  let onChartDblClick = null
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

  // Hand the proxy-wrapped engine to the event layer so mouse/touch
  // handlers auto-no-op after a fatal WASM fault.
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
    onChartDblClick: (sx, sy, cx, cy) => { onChartDblClick?.(sx, sy, cx, cy) },
    onVrvpHover: (sx, sy) => { vrvpHoverCallback?.(sx, sy) },
    onLiqAnnotationPin: (sx, sy) => { liqAnnotationPinCallback?.(sx, sy) },
  })
  // Register the cleanup so `_markEngineDead` can detach listeners on the
  // first wasm fault — stops the mousemove/wheel/touch spam.
  lifecycle.cleanupEvents = cleanupEvents

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

  // Custom indicator names used by the manual + autotrade position
  // overlays. Matched in `setPositionMarkersVisible` and on `addIndicator`
  // so the left-toolbar Hide menu state survives indicator re-registration.
  const POSITION_MARKER_NAMES = ['__trade_overlay', '__position_overlay']
  let _positionMarkersVisible = true

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
      const w = Math.max(1, Math.round(rect.width * dpr))
      const h = Math.max(1, Math.round(rect.height * dpr))
      canvas.width = w
      canvas.height = h
      scaleX = canvas.width / rect.width
      scaleY = canvas.height / rect.height
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0)
      try {
        engine.resize(rect.width, rect.height)
      } catch (e) {
        if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }
        throw e
      }
      // Canvas backing-store resize clears pixels immediately; if we wait until
      // the next RAF to redraw, rapid panel dragging causes visible flashing.
      // Paint one synchronous frame right after resize to keep the chart stable.
      this.renderSync()
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

    // Force an immediate full paint using the same path as the internal rAF
    // loop (command dispatch + custom indicators + tooltip + post-render +
    // watermark). Bypasses the mobile MIN_FRAME_MS throttle — use this for
    // input-driven interactions (e.g. mobile crosshair drag) where 60 fps
    // responsiveness matters. Any pending rAF is cancelled so the next frame
    // doesn't double-paint.
    renderFrameNow() {
      if (!running || paused || _engineDead) return
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
      if (throttleTimer) { clearTimeout(throttleTimer); throttleTimer = null }
      dirty = true
      renderFrame()
    },

    // Externally drive the crosshair (e.g. mobile touch-and-hold flow). Keeps
    // the engine, tooltip overlay, and lt-hover state in sync — equivalent to
    // what the internal touch/mouse handlers do on a normal hover/drag.
    // Pass zone = 0 (ZONE_MAIN) or 1 (ZONE_VOLUME). Returns true on success.
    setCrosshairExternal(sx, sy, zone) {
      if (_engineDead) return false
      try {
        engine.set_crosshair(sx, sy)
        _tooltipSx = sx
        _tooltipSy = sy
        _tooltipZone = typeof zone === 'number' ? zone : 0
        _tooltipDirty = true
        _crosshairVisible = true
        return true
      } catch { return false }
    },

    hideCrosshairExternal() {
      if (_engineDead) return
      try {
        engine.hide_crosshair()
        if (_crosshairVisible) {
          _crosshairVisible = false
          _tooltipDirty = true
          _tooltipZone = -1
        }
      } catch {}
    },

    // ── Price interaction ──

    setHoverPrice(price) {
      if (isDestroyed()) return
      engine.set_hover_price(price)
      markDirty()
    },

    clearHoverPrice() {
      if (isDestroyed()) return
      engine.clear_hover_price()
      markDirty()
    },

    hitZone(x, y) {
      if (isDestroyed()) return -1
      const z = engine.hit_zone(x, y)
      return z === undefined ? -1 : z
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
    onChartDblClick(cb) { onChartDblClick = cb },

    // ── Replay ──

    setReplayState(active, current, total) {
      if (isDestroyed()) return
      engine.set_replay_state(active, current, total)
      markDirty()
    },

    setReplayHovered(hovered) {
      if (isDestroyed()) return
      engine.set_replay_hovered(hovered)
    },

    setReplayPreview(screenX) {
      if (isDestroyed()) return
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

    // ── Custom chart appearance ──

    setCandleBullColor(hex) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_candle_bull_color === 'function') {
        engine.set_candle_bull_color(r, g, b)
        markDirty()
      }
    },

    setCandleBearColor(hex) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_candle_bear_color === 'function') {
        engine.set_candle_bear_color(r, g, b)
        markDirty()
      }
    },

    setBackgroundColor(hex) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_background_color === 'function') {
        engine.set_background_color(r, g, b)
        markDirty()
      }
    },

    setGridColor(hex, alpha = 255) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_grid_color === 'function') {
        engine.set_grid_color(r, g, b, alpha)
        markDirty()
      }
    },

    setCrosshairColor(hex, alpha = 160) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_crosshair_color === 'function') {
        engine.set_crosshair_color(r, g, b, alpha)
        markDirty()
      }
    },

    setCrosshairStyle(style) {
      if (typeof engine.set_crosshair_style === 'function') {
        engine.set_crosshair_style(style)
        markDirty()
      }
    },

    setCrosshairWidth(width) {
      if (typeof engine.set_crosshair_width === 'function') {
        engine.set_crosshair_width(width)
        markDirty()
      }
    },

    setFontSize(size) {
      if (typeof engine.set_font_size === 'function') {
        engine.set_font_size(size)
        markDirty()
      }
    },

    getFontSize() {
      if (typeof engine.get_font_size === 'function') {
        return engine.get_font_size()
      }
      return 11
    },

    setGridHVisible(v) {
      if (typeof engine.set_grid_h_visible === 'function') {
        engine.set_grid_h_visible(!!v)
        markDirty()
      }
    },

    setGridVVisible(v) {
      if (typeof engine.set_grid_v_visible === 'function') {
        engine.set_grid_v_visible(!!v)
        markDirty()
      }
    },

    // ── Layer visibility (left-toolbar Hide menu) ──
    // Toggles rendering of user drawings (lines, fib, shapes, etc.).
    // State is preserved; only the render pass is skipped.
    setDrawingsVisible(v) {
      if (typeof engine.set_drawings_visible === 'function') {
        engine.set_drawings_visible(!!v)
        markDirty()
      }
    },

    // Toggles rendering of all indicator layers (overlays + sub-panes
    // like RSI, OI, CVD, VPIN, OB-flow, Agg-Liq). The base chart
    // (candles/renko/footprint, volume, axes, grid, price line, crosshair,
    // orderbook heatmap) keeps rendering.
    setIndicatorsVisible(v) {
      if (typeof engine.set_indicators_visible === 'function') {
        engine.set_indicators_visible(!!v)
        markDirty()
      }
    },

    // Toggles the kline base chart (candles / footprint cells / renko
    // bricks). Volume pane, indicators, drawings, axes, grid, crosshair
    // and the orderbook heatmap all keep rendering. Useful when users
    // want to focus on overlay layers (heatmap, OB-flow, footprint
    // signals…) without the OHLC noise. Streaming continues, so toggling
    // back on restores the chart instantly.
    setKlineVisible(v) {
      if (typeof engine.set_kline_visible === 'function') {
        engine.set_kline_visible(!!v)
        markDirty()
      }
    },
    getKlineVisible() {
      if (typeof engine.get_kline_visible === 'function') {
        return !!engine.get_kline_visible()
      }
      return true
    },

    // Toggles the on-canvas position/order markers drawn by the trade
    // overlays (B/S entry dots, TP-hit, SL-hit) registered as custom
    // indicators under the internal names `__trade_overlay` (manual) and
    // `__position_overlay` (autotrade). DOM-based entry/SL/TP lines are
    // hidden separately by the parent via `v-show` on ChartPositionLines.
    // The wanted state is cached on the bridge so re-registrations done by
    // the composables (when positions transition empty → non-empty) pick
    // up the hidden state automatically.
    setPositionMarkersVisible(v) {
      const wanted = !!v
      _positionMarkersVisible = wanted
      for (const ind of customIndicators.list()) {
        if (POSITION_MARKER_NAMES.includes(ind.name)) {
          customIndicators.setEnabled(ind.id, wanted)
        }
      }
      markDirty()
    },

    setBgGradient(enabled, endHex) {
      if (typeof engine.set_bg_gradient === 'function') {
        const [r, g, b] = _hexToRgb(endHex || '#000000')
        engine.set_bg_gradient(!!enabled, r, g, b)
        markDirty()
      }
    },

    setCandleBullWickColor(hex) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_candle_bull_wick_color === 'function') {
        engine.set_candle_bull_wick_color(r, g, b)
        markDirty()
      }
    },

    setCandleBullBorderColor(hex) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_candle_bull_border_color === 'function') {
        engine.set_candle_bull_border_color(r, g, b)
        markDirty()
      }
    },

    setCandleBearWickColor(hex) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_candle_bear_wick_color === 'function') {
        engine.set_candle_bear_wick_color(r, g, b)
        markDirty()
      }
    },

    setCandleBearBorderColor(hex) {
      const [r, g, b] = _hexToRgb(hex)
      if (typeof engine.set_candle_bear_border_color === 'function') {
        engine.set_candle_bear_border_color(r, g, b)
        markDirty()
      }
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
      lifecycle.destroyed = true
      running = false
      paused = false
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
      if (throttleTimer) { clearTimeout(throttleTimer); throttleTimer = null }
      cleanupEvents()
      // Only free the Rust-side memory if the engine is still alive — a
      // dead engine's memory is already unusable and calling `free()` on
      // it would just re-trap.
      if (!lifecycle.dead) {
        try { rawEngine.free() } catch {}
      }
      lifecycle.dead = true
    },

    // ── Custom Indicator API ──

    addIndicator(config) {
      if (!featureGate('customIndicators')) return null
      const id = customIndicators.add(config)
      // Re-apply the cached Hide-menu state if this is a position overlay
      // re-registering after positions flipped from empty → non-empty.
      if (
        !_positionMarkersVisible
        && config
        && POSITION_MARKER_NAMES.includes(config.name)
      ) {
        customIndicators.setEnabled(id, false)
      }
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

    async setLicenseKey(newKey) {
      licenseInfo = await validateLicense(newKey)
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
