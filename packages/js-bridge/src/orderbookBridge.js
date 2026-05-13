/**
 * Orderbook heatmap bridge: loads WASM, creates OrderbookEngine,
 * manages render loop and event handling for the orderbook panel.
 *
 * Usage:
 *   import { createOrderbookBridge } from 'kline-orderbook-chart'
 *   const ob = await createOrderbookBridge(canvas, { symbol: 'ETH', tickSize: 0.25 })
 *   ob.start()
 *   ob.pushSnapshot(bids, asks, midPrice)
 */

import { dispatchCommands } from './canvasRenderer'
import { loadWasm as _loadWasm } from './wasmLoader'

let wasmModule = null
let wasmMemory = null

async function loadWasm() {
  if (wasmModule) return wasmModule
  const { module, memory } = await _loadWasm()
  wasmModule = module
  wasmMemory = memory
  return module
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Object} options
 * @param {string} [options.symbol='ETH']
 * @param {number} [options.tickSize=0.25]
 * @param {number} [options.visibleTicks=40]
 * @param {number} [options.exchangeCount=0]
 * @param {number} [options.pricePrecision=2]
 * @param {string} [options.theme='dark']
 * @param {number} [options.heatmapCols=5]
 * @param {number} [options.ringCols=300]
 * @param {number} [options.ringRows=400]
 * @param {number} [options.heatmapAlphaMul=0.6] Heatmap cell opacity scale (0.1–1.32, can exceed 1 to saturate alpha)
 */
let _createQueue = Promise.resolve()

export async function createOrderbookBridge(canvas, options = {}) {
  const wasm = await loadWasm()

  const bridge = await (_createQueue = _createQueue.then(
    () => _buildBridge(wasm, canvas, options),
    () => _buildBridge(wasm, canvas, options),
  ))
  return bridge
}

function _buildBridge(wasm, canvas, options) {
  let dpr = window.devicePixelRatio || 1
  let rect = canvas.getBoundingClientRect()
  const initW = Math.max(rect.width, 60)
  const initH = Math.max(rect.height, 60)

  canvas.width = initW * dpr
  canvas.height = initH * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const engine = new wasm.OrderbookEngine(initW, initH)

  if (options.symbol) engine.set_symbol(options.symbol)
  if (options.tickSize) engine.set_tick_size(options.tickSize)
  if (options.visibleTicks) engine.set_visible_ticks(options.visibleTicks)
  if (options.exchangeCount) engine.set_exchange_count(options.exchangeCount)
  if (options.pricePrecision != null) engine.set_price_precision(options.pricePrecision)
  if (options.theme === 'light') engine.set_theme(1)
  if (options.heatmapCols) engine.set_heatmap_cols(options.heatmapCols)
  if (options.ringCols || options.ringRows) {
    engine.set_ring_capacity(options.ringCols || 300, options.ringRows || 400)
  }
  if (options.heatmapAlphaMul != null) {
    engine.set_heatmap_alpha_mul(Number(options.heatmapAlphaMul))
  }
  if (options.showCumulative != null) {
    engine.set_show_cumulative(!!options.showCumulative)
  }
  if (options.showSignalOverlays != null) {
    engine.set_show_signal_overlays(!!options.showSignalOverlays)
  }

  let dirty = true
  let rafId = null
  let running = false
  let destroyed = false
  let _engineDead = false

  let _onHoverPriceCb = null
  let _onClickPriceCb = null

  function scheduleRender() {
    if (!running || _engineDead || rafId) return
    rafId = requestAnimationFrame(renderFrame)
  }

  const markDirty = () => {
    dirty = true
    scheduleRender()
  }

  function renderFrame() {
    rafId = null
    if (!running || _engineDead) return

    let needRender = false
    try { needRender = dirty || engine.is_dirty() } catch { _engineDead = true; return }

    if (needRender) {
      dirty = false
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
      } catch (e) {
        if (e instanceof WebAssembly.RuntimeError) {
          _engineDead = true
          console.error('[OrderbookEngine] crashed:', e.message)
          return
        }
        dirty = true
      }
    }
  }

  // ── Interaction events (mouse + touch) ──

  canvas.style.touchAction = 'none'

  let pointerDown = false
  let lastY = 0
  let activePointers = new Map()
  let lastPinchDist = 0
  let lastPinchMidY = 0
  let clickStartY = 0
  let clickStartX = 0
  let wasDrag = false

  function onWheel(e) {
    if (_engineDead) return
    e.preventDefault()
    const factor = e.deltaY > 0 ? 1.08 : 0.93
    engine.zoom_y(factor, e.offsetY)
    markDirty()
  }

  function onPointerDown(e) {
    if (_engineDead) return
    activePointers.set(e.pointerId, { y: e.offsetY })
    canvas.setPointerCapture(e.pointerId)

    if (activePointers.size === 1) {
      pointerDown = true
      lastY = e.offsetY
      clickStartX = e.offsetX
      clickStartY = e.offsetY
      wasDrag = false
    } else if (activePointers.size === 2) {
      pointerDown = false
      const pts = [...activePointers.values()]
      lastPinchDist = Math.abs(pts[0].y - pts[1].y)
      lastPinchMidY = (pts[0].y + pts[1].y) / 2
    }
  }

  function onPointerMove(e) {
    if (_engineDead) return
    activePointers.set(e.pointerId, { y: e.offsetY })

    if (activePointers.size >= 2) {
      const pts = [...activePointers.values()]
      const dist = Math.abs(pts[0].y - pts[1].y)
      const midY = (pts[0].y + pts[1].y) / 2

      if (lastPinchDist > 0) {
        const factor = lastPinchDist / Math.max(dist, 1)
        engine.zoom_y(factor, midY)
      }

      const panDy = midY - lastPinchMidY
      if (Math.abs(panDy) > 0.5) engine.pan_y(panDy)

      lastPinchDist = dist
      lastPinchMidY = midY
      markDirty()
    } else if (pointerDown) {
      const dy = e.offsetY - lastY
      lastY = e.offsetY
      if (Math.abs(e.offsetX - clickStartX) > 4 || Math.abs(e.offsetY - clickStartY) > 4) {
        wasDrag = true
      }
      engine.pan_y(dy)
      markDirty()
    } else {
      engine.set_hover(e.offsetX, e.offsetY)
      markDirty()
      if (_onHoverPriceCb) {
        try {
          const price = engine.get_hover_price()
          if (price > 0) {
            const qty = engine.get_hover_qty()
            const side = engine.get_hover_side()
            _onHoverPriceCb({ price, qty, side: side === 2 ? 'ask' : 'bid' })
          } else {
            _onHoverPriceCb(null)
          }
        } catch {}
      }
    }
  }

  function onPointerLeave() {
    if (_engineDead) return
    if (_onHoverPriceCb) _onHoverPriceCb(null)
    engine.clear_hover()
    markDirty()
  }

  function onPointerUp(e) {
    const wasClick = pointerDown && !wasDrag && activePointers.size === 1
    activePointers.delete(e.pointerId)
    try { canvas.releasePointerCapture(e.pointerId) } catch {}

    if (activePointers.size === 0) {
      if (wasClick && _onClickPriceCb && !_engineDead) {
        try {
          engine.set_hover(e.offsetX, e.offsetY)
          const price = engine.get_hover_price()
          if (price > 0) {
            const qty = engine.get_hover_qty()
            const side = engine.get_hover_side()
            _onClickPriceCb({ price, qty, side: side === 2 ? 'ask' : 'bid' })
          }
        } catch {}
      }
      pointerDown = false
      lastPinchDist = 0
    } else if (activePointers.size === 1) {
      pointerDown = true
      const remaining = [...activePointers.values()][0]
      lastY = remaining.y
      lastPinchDist = 0
    }
  }

  function onDblClick() {
    if (_engineDead) return
    engine.center_on_mid()
    markDirty()
  }

  canvas.addEventListener('wheel', onWheel, { passive: false })
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('dblclick', onDblClick)

  function cleanupEvents() {
    canvas.removeEventListener('wheel', onWheel)
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerUp)
    canvas.removeEventListener('pointerleave', onPointerLeave)
    canvas.removeEventListener('dblclick', onDblClick)
  }

  return {
    engine,

    start() {
      running = true
      dirty = true
      scheduleRender()
    },

    stop() {
      running = false
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    },

    resize() {
      if (destroyed || _engineDead) return
      rect = canvas.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
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

    /**
     * Push an aggregated orderbook snapshot.
     * @param {Array<[number,number]>} bids  [[price, qty], ...]
     * @param {Array<[number,number]>} asks  [[price, qty], ...]
     * @param {number} midPrice
     */
    pushSnapshot(bids, asks, midPrice) {
      if (_engineDead) return
      const bidFlat = new Float64Array(bids.length * 2)
      for (let i = 0; i < bids.length; i++) {
        bidFlat[i * 2] = bids[i][0]
        bidFlat[i * 2 + 1] = bids[i][1]
      }
      const askFlat = new Float64Array(asks.length * 2)
      for (let i = 0; i < asks.length; i++) {
        askFlat[i * 2] = asks[i][0]
        askFlat[i * 2 + 1] = asks[i][1]
      }
      try {
        engine.push_snapshot(bidFlat, askFlat, midPrice)
      } catch (e) {
        if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }
        throw e
      }
      markDirty()
    },

    /**
     * Push pre-flattened arrays (faster — avoids conversion).
     * @param {Float64Array} bidFlat  [p0,q0, p1,q1, ...]
     * @param {Float64Array} askFlat  [p0,q0, p1,q1, ...]
     * @param {number} midPrice
     */
    pushSnapshotFlat(bidFlat, askFlat, midPrice) {
      if (_engineDead) return
      try {
        engine.push_snapshot(bidFlat, askFlat, midPrice)
      } catch (e) {
        if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }
        throw e
      }
      markDirty()
    },

    /**
     * Set aggregated depth book for depth bar rendering only (no heatmap column).
     */
    setDepthBook(bids, asks, midPrice) {
      if (_engineDead) return
      const bidFlat = new Float64Array(bids.length * 2)
      for (let i = 0; i < bids.length; i++) {
        bidFlat[i * 2] = bids[i][0]
        bidFlat[i * 2 + 1] = bids[i][1]
      }
      const askFlat = new Float64Array(asks.length * 2)
      for (let i = 0; i < asks.length; i++) {
        askFlat[i * 2] = asks[i][0]
        askFlat[i * 2 + 1] = asks[i][1]
      }
      try { engine.set_depth_book(bidFlat, askFlat, midPrice) }
      catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },

    setDepthBookFlat(bidFlat, askFlat, midPrice) {
      if (_engineDead) return
      try { engine.set_depth_book(bidFlat, askFlat, midPrice) }
      catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },

    /**
     * Push one exchange column into the heatmap ring buffer.
     */
    pushHeatmapCol(bids, asks, midPrice) {
      if (_engineDead) return
      const bidFlat = new Float64Array(bids.length * 2)
      for (let i = 0; i < bids.length; i++) {
        bidFlat[i * 2] = bids[i][0]
        bidFlat[i * 2 + 1] = bids[i][1]
      }
      const askFlat = new Float64Array(asks.length * 2)
      for (let i = 0; i < asks.length; i++) {
        askFlat[i * 2] = asks[i][0]
        askFlat[i * 2 + 1] = asks[i][1]
      }
      try { engine.push_heatmap_col(bidFlat, askFlat, midPrice) }
      catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },

    pushHeatmapColFlat(bidFlat, askFlat, midPrice) {
      if (_engineDead) return
      try { engine.push_heatmap_col(bidFlat, askFlat, midPrice) }
      catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },

    resetRing() {
      if (_engineDead) return
      try { engine.reset_ring() } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },

    setExchangeLabels(labels) {
      if (_engineDead) return
      const csv = Array.isArray(labels) ? labels.join(',') : String(labels)
      try { engine.set_exchange_labels(csv) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },

    setSignalObi(obi, bidP, askP) {
      if (_engineDead) return
      try { engine.set_signal_obi(obi, bidP, askP) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },
    setSignalSpoof(score) {
      if (_engineDead) return
      try { engine.set_signal_spoof(score) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },
    setSignalAbsorption(bid, ask) {
      if (_engineDead) return
      try { engine.set_signal_absorption(bid, ask) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },
    setSignalFlow(netFlow, cumDelta) {
      if (_engineDead) return
      try { engine.set_signal_flow(netFlow, cumDelta) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },
    setSignalWalls(bidWalls, askWalls) {
      if (_engineDead) return
      try { engine.set_signal_walls(new Float64Array(bidWalls), new Float64Array(askWalls)) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },
    setSignalGaps(bidGaps, askGaps) {
      if (_engineDead) return
      try { engine.set_signal_gaps(new Float64Array(bidGaps), new Float64Array(askGaps)) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },

    setSymbol(s) { if (_engineDead) return; engine.set_symbol(s); markDirty() },
    setTickSize(t) { if (_engineDead) return; engine.set_tick_size(t); markDirty() },
    setVisibleTicks(n) { if (_engineDead) return; engine.set_visible_ticks(n); markDirty() },
    setExchangeCount(n) { if (_engineDead) return; engine.set_exchange_count(n); markDirty() },
    setPrecision(d) { if (_engineDead) return; engine.set_price_precision(d); markDirty() },
    setAutoCenter(b) { if (_engineDead) return; engine.set_auto_center(b) },
    centerOnMid() { if (_engineDead) return; engine.center_on_mid(); markDirty() },
    setHeatmapCols(n) { if (_engineDead) return; engine.set_heatmap_cols(n); markDirty() },
    setHeatmapAlphaMul(mul) {
      if (_engineDead) return
      try { engine.set_heatmap_alpha_mul(Number(mul)) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },
    setShowCumulative(show) {
      if (_engineDead) return
      try { engine.set_show_cumulative(!!show) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },
    setShowSignalOverlays(show) {
      if (_engineDead) return
      try { engine.set_show_signal_overlays(!!show) } catch (e) { if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }; throw e }
      markDirty()
    },

    getHoverPrice() { if (_engineDead) return 0; return engine.get_hover_price() },
    getHoverQty() { if (_engineDead) return 0; return engine.get_hover_qty() },
    getHoverSide() { if (_engineDead) return 0; return engine.get_hover_side() },

    onHoverPrice(cb) { _onHoverPriceCb = cb },
    onClickPrice(cb) { _onClickPriceCb = cb },

    setTheme(name) {
      if (_engineDead) return
      engine.set_theme(name === 'light' ? 1 : 0)
      markDirty()
    },

    clear() { if (_engineDead) return; engine.clear(); markDirty() },

    get isDead() { return _engineDead },

    destroy() {
      destroyed = true
      running = false
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
      cleanupEvents()
      try { engine.free() } catch {}
    },
  }
}
