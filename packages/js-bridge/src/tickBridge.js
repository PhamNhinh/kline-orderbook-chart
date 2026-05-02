/**
 * Tick-mode bridge — Bookmap-style continuous time × price visualization.
 *
 * Mirrors the orderbook bridge's lifecycle, but:
 *   • Uses `TickEngine` (WASM) instead of `OrderbookEngine`.
 *   • Coalesces WS pushes into a per-frame batch so a 500 msg/s feed
 *     doesn't blow the WASM call budget — only one `push_book` and one
 *     `push_trades_batch` per RAF tick.
 *   • Adaptive frame cap: 60 FPS desktop / 30 FPS mobile, paused while
 *     the tab is hidden or the canvas is offscreen.
 *   • Pause/resume API so the parent (`useTickMode`) can stop the loop
 *     when the user toggles back to candle mode without destroying the
 *     engine — re-enter is instant.
 *
 * Usage:
 *   const tb = await createTickBridge(canvas, { tickSize: 0.5 })
 *   tb.start()
 *   tb.pushBook(t_ms, bidsFlat, asksFlat, mid)
 *   tb.pushTrade(t_ms, price, qty, side)
 *   tb.pause()    // freeze RAF, keep state — fast resume
 *   tb.resume()
 *   tb.destroy()  // tear down engine + listeners
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

// Detect mobile-class hardware. We treat "mobile" as a thermal hint, not a
// resolution rule — desktops on battery / low-power mode could opt-in too,
// but that's a separate setting passed via `options.lowPower`.
function detectMobile() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  const isCoarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
  const isSmall = typeof window !== 'undefined' && Math.min(window.innerWidth, window.innerHeight) < 820
  return /iphone|ipad|ipod|android|mobile/i.test(ua) || (isCoarse && isSmall)
}

let _createQueue = Promise.resolve()

export async function createTickBridge(canvas, options = {}) {
  const wasm = await loadWasm()
  return (_createQueue = _createQueue.then(
    () => _buildBridge(wasm, canvas, options),
    () => _buildBridge(wasm, canvas, options),
  ))
}

function _buildBridge(wasm, canvas, options) {
  let dpr = window.devicePixelRatio || 1
  let rect = canvas.getBoundingClientRect()
  const initW = Math.max(rect.width, 60)
  const initH = Math.max(rect.height, 60)

  // Initial sizing — actual resize() handles DPR transform fully.
  canvas.width = initW * dpr
  canvas.height = initH * dpr
  const ctx = canvas.getContext('2d')
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)

  const engine = new wasm.TickEngine(initW, initH)

  if (options.tickSize) engine.set_tick_size(options.tickSize)
  if (options.pricePrecision != null) engine.set_price_precision(options.pricePrecision)
  if (options.theme === 'light') engine.set_theme(1)
  if (options.lookbackMs || options.cellMs) {
    engine.set_lookback(options.lookbackMs || 5 * 60 * 1000, options.cellMs || 100)
  }
  if (options.showTradeTape != null) engine.set_show_trade_tape(!!options.showTradeTape)
  if (options.showBookHeatmap != null) engine.set_show_book_heatmap(!!options.showBookHeatmap)
  if (options.showVwap != null) engine.set_show_vwap(!!options.showVwap)
  if (options.showGrid != null) engine.set_show_grid(!!options.showGrid)

  // ── Adaptive FPS / thermal guards ─────────────────────────────
  // The minimum frame interval (in ms) gates the RAF loop. Three layers:
  //   1. Hard mobile cap (default 33 ms = ~30 FPS) — biggest battery win.
  //   2. Hidden tab → 0 FPS (RAF is naturally throttled to ~1 Hz, but we
  //      explicitly stop scheduling so WASM compute pauses too).
  //   3. Idle detection → relax cap to 15 FPS after 30 s without input AND
  //      no new ticks (chart effectively static, no need to repaint).
  const isMobile = options.isMobile != null ? !!options.isMobile : detectMobile()
  const lowPower = !!options.lowPower
  const baseFrameMs = (isMobile || lowPower) ? 33 : 16
  const idleFrameMs = 66 // ~15 FPS once "idle"
  const idleAfterMs = 30_000

  let dirty = true
  let rafId = null
  let running = false
  let paused = false
  let destroyed = false
  let _engineDead = false

  let lastFrameTs = 0
  let lastInputTs = performance.now()
  let lastTickTs = performance.now()

  // Adaptive frame budget — exponential moving avg of actual render cost.
  // When the canvas dispatch starts blowing the frame budget (e.g. user
  // is on a low-end CPU OR the WASM cap is being hit) we slow the loop
  // down rather than letting renders stack up and freeze the UI thread.
  let _emaRenderMs = 0
  const _budgetWarnLimit = 8 // ms; >8 ms render = we're losing 60fps
  let _slowFrameStreak = 0   // consecutive frames over budget
  let _adaptiveFrameMs = 0   // additive throttle (ms) on top of base cap

  // Pending WS payloads — coalesced and flushed once per frame BEFORE
  // calling render(). One snapshot of (book, trades) per frame is enough;
  // any intermediate state was visually discarded anyway.
  let pendingBookT = 0
  let pendingBookBids = null
  let pendingBookAsks = null
  let pendingBookMid = 0
  let pendingTrades = [] // [t_ms, price, qty, side, ...] flat

  function _currentFrameMs() {
    if (paused || !running) return Number.POSITIVE_INFINITY
    if (typeof document !== 'undefined' && document.hidden) return Number.POSITIVE_INFINITY
    const now = performance.now()
    const idle = (now - lastInputTs) > idleAfterMs && (now - lastTickTs) > idleAfterMs
    const base = idle ? idleFrameMs : baseFrameMs
    return base + _adaptiveFrameMs
  }

  function scheduleRender() {
    if (!running || paused || _engineDead || rafId) return
    rafId = requestAnimationFrame(_tick)
  }

  function _tick(ts) {
    rafId = null
    if (!running || paused || _engineDead) return

    // Frame-rate cap: skip if too soon since last frame.
    const minInterval = _currentFrameMs()
    if (!Number.isFinite(minInterval)) {
      // Effectively paused (hidden tab) — don't reschedule.
      return
    }
    if (ts - lastFrameTs < minInterval) {
      // Re-schedule on the NEXT RAF — browser will throttle naturally.
      rafId = requestAnimationFrame(_tick)
      return
    }
    lastFrameTs = ts

    _flushPending()

    let needRender = dirty
    if (!needRender) {
      try { needRender = engine.is_dirty() } catch { _engineDead = true; return }
    }

    if (needRender) {
      dirty = false
      const tStart = performance.now()
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
          console.error('[TickEngine] crashed:', e.message)
          return
        }
        dirty = true
      }
      // Adaptive backpressure: if the render+dispatch consistently runs
      // over budget, raise the per-frame minimum interval so we don't
      // stack up RAFs on a slow device. We only ratchet UP — never down
      // — until 60 consecutive fast frames in which case we relax.
      const renderCost = performance.now() - tStart
      _emaRenderMs = _emaRenderMs * 0.85 + renderCost * 0.15
      if (renderCost > _budgetWarnLimit) {
        _slowFrameStreak += 1
        if (_slowFrameStreak >= 8) {
          // Slow streak → add 16 ms (one frame) of throttle, capped at 100 ms
          _adaptiveFrameMs = Math.min(100, _adaptiveFrameMs + 16)
          _slowFrameStreak = 0
          console.debug(
            `[TickEngine] adaptive throttle → ${baseFrameMs + _adaptiveFrameMs}ms ` +
            `(EMA ${_emaRenderMs.toFixed(1)}ms, last ${renderCost.toFixed(1)}ms)`,
          )
        }
      } else {
        _slowFrameStreak = 0
        if (_adaptiveFrameMs > 0 && _emaRenderMs < _budgetWarnLimit * 0.5) {
          _adaptiveFrameMs = Math.max(0, _adaptiveFrameMs - 8)
        }
      }
    }

    // Keep the loop alive to honour the cap; if no input AND no ticks for
    // a long time AND nothing is dirty, _currentFrameMs() returns idle ms
    // and we essentially burn ~15 FPS. To stop completely the caller must
    // pause() — that's the explicit opt-out.
    rafId = requestAnimationFrame(_tick)
  }

  function _flushPending() {
    if (pendingBookBids && pendingBookMid > 0) {
      try {
        engine.push_book(pendingBookT, pendingBookBids, pendingBookAsks, pendingBookMid)
      } catch (e) {
        if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }
      }
      pendingBookBids = null
      pendingBookAsks = null
      pendingBookMid = 0
    }
    if (pendingTrades.length) {
      const flat = new Float64Array(pendingTrades)
      pendingTrades.length = 0
      try {
        engine.push_trades_batch(flat)
      } catch (e) {
        if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }
      }
    }
  }

  const markDirty = () => { dirty = true; scheduleRender() }

  // ── Visibility / lifecycle hooks ────────────────────────────────
  function _onVisibility() {
    if (typeof document === 'undefined') return
    if (document.hidden) {
      // Cancel pending RAF so WASM doesn't even compute. Will resume on
      // visibility change OR user input.
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    } else {
      // Drop any stale pending payloads so we don't render an old snapshot
      // a second after the user comes back. The next WS push fills them.
      pendingTrades.length = 0
      pendingBookBids = null
      pendingBookAsks = null
      pendingBookMid = 0
      lastFrameTs = 0
      markDirty()
    }
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', _onVisibility)
  }

  // ── Resize ──────────────────────────────────────────────────────
  function resize() {
    if (destroyed || _engineDead) return
    rect = canvas.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return
    dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
    try { engine.resize(rect.width, rect.height) }
    catch (e) {
      if (e instanceof WebAssembly.RuntimeError) { _engineDead = true; return }
      throw e
    }
    _refreshAxisDims()
    markDirty()
  }

  // ── Pointer interaction ─────────────────────────────────────────
  //
  // Routing uses the engine-side hit-test (`engine.hit_zone(x, y)`) so
  // the bridge stays in sync with the renderer's actual layout — exact
  // same pattern the candle bridge uses (`packages/js-bridge/src/eventMouse.js`).
  // Zone codes are normalised across engines:
  //   ZONE_MAIN  = 0  → chart body
  //   ZONE_XAXIS = 2  → bottom time axis
  //   ZONE_YAXIS = 3  → right price axis
  //
  // Drag intent is decided ONCE on `pointerdown`; subsequent moves keep
  // that mode regardless of where the cursor wanders, matching
  // Iced / flowsurface `Interaction` semantics.
  const ZONE_MAIN = 0
  const ZONE_XAXIS = 2
  const ZONE_YAXIS = 3

  let dragZone = ZONE_MAIN
  let pointerDown = false
  let lastX = 0
  let lastY = 0
  let activePointers = new Map()
  let lastPinchDist = 0
  let lastPinchMidY = 0

  function _hitZone(x, y) {
    if (_engineDead) return ZONE_MAIN
    try {
      const z = engine.hit_zone?.(x, y)
      return Number.isFinite(z) ? z : ZONE_MAIN
    } catch {
      return ZONE_MAIN
    }
  }
  function _refreshAxisDims() { /* no-op — kept for resize() compatibility */ }

  canvas.style.touchAction = 'none'

  // Tick mode shares the canvas with the candle bridge, whose mouse/touch
  // listeners stay attached even when paused. Without intervention, every
  // wheel / pointer event would also reach the candle bridge and mutate
  // its (invisible) viewport — confusing for the user, and on some
  // browsers it leaks `e.preventDefault()` semantics back to the kline
  // engine. Two-step fix:
  //
  //   1. Register all listeners in CAPTURE phase. Capture listeners on
  //      the same element fire BEFORE bubble-phase listeners regardless
  //      of registration order — so tick handles the event first.
  //   2. When tick is active (not paused), call `stopImmediatePropagation`
  //      so the candle bridge's bubble listeners never run.
  //
  // When tick is PAUSED (i.e. user is on candle mode), our handlers
  // early-return WITHOUT calling stopImmediatePropagation, so the candle
  // bridge gets the events normally.
  // Wheel — Mirrors the candle bridge convention in
  // `packages/js-bridge/src/eventMouse.js:24-58` so users get one
  // muscle memory across the whole product:
  //
  //   • Wheel on chart body     → engine.zoom(x, y, factor)   (uniform XY)
  //   • Wheel on Y axis         → engine.zoom_y(y, factor)
  //   • Wheel on X axis         → engine.zoom_x(x, factor)
  //   • Ctrl + wheel            → engine.zoom_y(y, factor)    (Y only)
  //   • Shift + wheel           → engine.zoom_x(x, factor)    (X only)
  //
  // macOS quirk: Chrome / Safari can swap `deltaY` ↔ `deltaX` while
  // shift is held; we collapse both into a single signed scalar so
  // the direction is correct regardless of platform / modifier.
  //
  // Sign convention (also matches the candle wheel handler):
  //   deltaY > 0 (scroll DOWN) → zoom OUT, factor = 1.1
  //   deltaY < 0 (scroll UP)   → zoom IN,  factor = 0.9
  function onWheel(e) {
    if (_engineDead || paused) return
    e.stopImmediatePropagation()
    e.preventDefault()
    lastInputTs = performance.now()

    const dyRaw = e.deltaY
    const dxRaw = e.deltaX
    const d = Math.abs(dyRaw) >= Math.abs(dxRaw) ? dyRaw : dxRaw
    if (d === 0) return
    const factor = d > 0 ? 1.1 : 0.9

    const zone = _hitZone(e.offsetX, e.offsetY)

    try {
      if (e.ctrlKey) {
        // Ctrl + wheel anywhere → Y-only zoom. (`eventMouse.js:45-46`)
        engine.zoom_y(e.offsetY, factor)
      } else if (e.shiftKey) {
        // Shift + wheel anywhere → X-only zoom. (`eventMouse.js:47-48`)
        engine.zoom_x(e.offsetX, factor)
      } else if (zone === ZONE_XAXIS) {
        engine.zoom_x(e.offsetX, factor)
      } else if (zone === ZONE_YAXIS) {
        engine.zoom_y(e.offsetY, factor)
      } else {
        // Plain wheel on chart body → uniform XY anchor zoom.
        engine.zoom(e.offsetX, e.offsetY, factor)
      }
    } catch {}
    markDirty()
  }
  function onPointerDown(e) {
    if (_engineDead || paused) return
    e.stopImmediatePropagation()
    lastInputTs = performance.now()
    activePointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY })
    canvas.setPointerCapture(e.pointerId)
    if (activePointers.size === 1) {
      pointerDown = true
      lastX = e.offsetX
      lastY = e.offsetY
      // Lock drag zone at press-time so the gesture's intent doesn't
      // shift when the cursor leaves the original area.
      dragZone = _hitZone(e.offsetX, e.offsetY)
    } else if (activePointers.size === 2) {
      pointerDown = false
      const pts = [...activePointers.values()]
      lastPinchDist = Math.abs(pts[0].y - pts[1].y)
      lastPinchMidY = (pts[0].y + pts[1].y) / 2
    }
  }
  function onPointerMove(e) {
    if (_engineDead || paused) return
    e.stopImmediatePropagation()
    lastInputTs = performance.now()
    activePointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY })
    if (activePointers.size >= 2) {
      const pts = [...activePointers.values()]
      const dist = Math.abs(pts[0].y - pts[1].y)
      const midY = (pts[0].y + pts[1].y) / 2
      if (lastPinchDist > 0) {
        const factor = lastPinchDist / Math.max(dist, 1)
        try { engine.zoom_y(midY, factor) } catch {}
      }
      const panDy = midY - lastPinchMidY
      if (Math.abs(panDy) > 0.5) { try { engine.pan_y(panDy) } catch {} }
      lastPinchDist = dist
      lastPinchMidY = midY
      markDirty()
    } else if (pointerDown) {
      const dx = e.offsetX - lastX
      const dy = e.offsetY - lastY
      lastX = e.offsetX
      lastY = e.offsetY
      try {
        // Drag-on-axis  → scale that axis around the drag origin.
        // Drag-on-chart → pan both axes (translate viewport).
        // Anchor + sign conventions follow the candle bridge so the
        // muscle memory carries over between modes.
        if (dragZone === ZONE_XAXIS) {
          if (Math.abs(dx) > 0.5) {
            // Drag right → zoom OUT, drag left → zoom IN.
            // exp(0.004 px) ≈ ±0.4 % per pixel — predictable on
            // trackpads and mice alike.
            const factor = Math.exp(dx * 0.004)
            engine.zoom_x(lastX, factor)
          }
        } else if (dragZone === ZONE_YAXIS) {
          if (Math.abs(dy) > 0.5) {
            // Drag down → zoom OUT vertically (more price visible).
            const factor = Math.exp(dy * 0.004)
            engine.zoom_y(lastY, factor)
          }
        } else {
          if (Math.abs(dx) > 0.5) engine.pan_x(dx)
          if (Math.abs(dy) > 0.5) engine.pan_y(dy)
        }
      } catch {}
      markDirty()
    } else {
      try { engine.set_hover(e.offsetX, e.offsetY) } catch {}
      markDirty()
    }
  }
  function onPointerUp(e) {
    if (_engineDead) return
    if (!paused) e.stopImmediatePropagation()
    activePointers.delete(e.pointerId)
    try { canvas.releasePointerCapture(e.pointerId) } catch {}
    if (activePointers.size === 0) {
      pointerDown = false
      lastPinchDist = 0
    } else if (activePointers.size === 1) {
      pointerDown = true
      const remaining = [...activePointers.values()][0]
      lastX = remaining.x
      lastY = remaining.y
      lastPinchDist = 0
    }
  }
  function onPointerLeave(e) {
    if (_engineDead) return
    if (!paused) e.stopImmediatePropagation()
    try { engine.clear_hover() } catch {}
    markDirty()
  }
  // Double-click — flowsurface convention (`AxisScaleClicked` in
  // `chart.rs:283`): each axis double-click resets THAT axis only.
  //   • dblclick on Y axis  → re-engage Y auto-scale (mid centred again)
  //   • dblclick on X axis  → reset X span + glue to live
  //   • dblclick in chart   → full reset (X + Y)
  function onDblClick(e) {
    if (_engineDead || paused) return
    e.stopImmediatePropagation()
    const zone = _hitZone(e.offsetX, e.offsetY)
    try {
      if (zone === ZONE_YAXIS) {
        engine.reset_y_auto?.()
      } else if (zone === ZONE_XAXIS) {
        engine.set_follow_live?.(true)
      } else {
        engine.reset_view?.()
      }
    } catch {}
    markDirty()
  }

  // Mouse-event aliases — the candle bridge listens to legacy `mousedown`
  // / `mousemove` / `mouseup` (not pointer events). Browsers fire BOTH
  // for the same input, so we must intercept the mouse-side too or the
  // candle bridge would still receive them and trigger candle pans.
  function onMouseDown(e) {
    if (_engineDead || paused) return
    e.stopImmediatePropagation()
  }
  function onMouseMove(e) {
    if (_engineDead || paused) return
    e.stopImmediatePropagation()
  }
  function onMouseUp(e) {
    if (_engineDead || paused) return
    e.stopImmediatePropagation()
  }
  function onContextMenu(e) {
    if (_engineDead || paused) return
    e.stopImmediatePropagation()
    e.preventDefault()
  }

  const captureOpt = { capture: true }
  const captureNonPassiveOpt = { capture: true, passive: false }

  canvas.addEventListener('wheel', onWheel, captureNonPassiveOpt)
  canvas.addEventListener('pointerdown', onPointerDown, captureOpt)
  canvas.addEventListener('pointermove', onPointerMove, captureOpt)
  canvas.addEventListener('pointerup', onPointerUp, captureOpt)
  canvas.addEventListener('pointercancel', onPointerUp, captureOpt)
  canvas.addEventListener('pointerleave', onPointerLeave, captureOpt)
  canvas.addEventListener('dblclick', onDblClick, captureOpt)
  // Mouse-event guards (kill candle bridge handlers while tick is active).
  canvas.addEventListener('mousedown', onMouseDown, captureOpt)
  canvas.addEventListener('mousemove', onMouseMove, captureOpt)
  canvas.addEventListener('mouseup', onMouseUp, captureOpt)
  canvas.addEventListener('contextmenu', onContextMenu, captureOpt)

  function _cleanupEvents() {
    canvas.removeEventListener('wheel', onWheel, captureNonPassiveOpt)
    canvas.removeEventListener('pointerdown', onPointerDown, captureOpt)
    canvas.removeEventListener('pointermove', onPointerMove, captureOpt)
    canvas.removeEventListener('pointerup', onPointerUp, captureOpt)
    canvas.removeEventListener('pointercancel', onPointerUp, captureOpt)
    canvas.removeEventListener('pointerleave', onPointerLeave, captureOpt)
    canvas.removeEventListener('dblclick', onDblClick, captureOpt)
    canvas.removeEventListener('mousedown', onMouseDown, captureOpt)
    canvas.removeEventListener('mousemove', onMouseMove, captureOpt)
    canvas.removeEventListener('mouseup', onMouseUp, captureOpt)
    canvas.removeEventListener('contextmenu', onContextMenu, captureOpt)
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', _onVisibility)
    }
  }

  return {
    engine,

    isMobile,

    start() {
      running = true
      paused = false
      dirty = true
      lastFrameTs = 0
      lastInputTs = performance.now()
      lastTickTs = performance.now()
      scheduleRender()
    },

    /**
     * Pause RAF + WS coalescing without destroying engine state. Re-enter
     * via `resume()` is instant — used when the user toggles back to
     * candle mode so we don't lose ring buffer history.
     */
    pause() {
      paused = true
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    },

    resume() {
      if (destroyed || _engineDead) return
      paused = false
      running = true
      dirty = true
      lastFrameTs = 0
      scheduleRender()
    },

    stop() {
      running = false
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    },

    resize,

    /**
     * Coalesced book diff push. Call as fast as the WS sends; only the
     * latest snapshot per frame survives to the engine.
     */
    pushBook(t_ms, bidsFlat, asksFlat, mid) {
      if (_engineDead || paused) return
      lastTickTs = performance.now()
      pendingBookT = t_ms
      pendingBookBids = bidsFlat
      pendingBookAsks = asksFlat
      pendingBookMid = mid
      scheduleRender()
    },

    /**
     * Append one trade to the per-frame trade batch. Use for aggTrade.
     */
    pushTrade(t_ms, price, qty, side) {
      if (_engineDead || paused) return
      lastTickTs = performance.now()
      pendingTrades.push(t_ms, price, qty, side)
      scheduleRender()
    },

    /**
     * Bulk-append trades — useful for backfill from REST historical fills.
     * `flat`: [t, p, q, side, t, p, q, side, ...].
     */
    pushTradesFlat(flat) {
      if (_engineDead || paused) return
      lastTickTs = performance.now()
      // Append by extending the batch — final flush still emits one WASM
      // call, so this is amortised regardless of input size.
      for (let i = 0; i < flat.length; i++) pendingTrades.push(flat[i])
      scheduleRender()
    },

    setTheme(id) {
      if (_engineDead) return
      try { engine.set_theme(id === 'light' || id === 1 ? 1 : 0) } catch {}
      markDirty()
    },

    setTickSize(t) {
      if (_engineDead) return
      try { engine.set_tick_size(t) } catch {}
      markDirty()
    },

    setPricePrecision(d) {
      if (_engineDead) return
      try { engine.set_price_precision(d) } catch {}
      markDirty()
    },

    setLookback(lookbackMs, cellMs) {
      if (_engineDead) return
      try { engine.set_lookback(lookbackMs, cellMs) } catch {}
      markDirty()
    },

    setShowTradeTape(v) { if (!_engineDead) { engine.set_show_trade_tape(!!v); markDirty() } },
    setShowBookHeatmap(v) { if (!_engineDead) { engine.set_show_book_heatmap(!!v); markDirty() } },
    setShowVwap(v) { if (!_engineDead) { engine.set_show_vwap(!!v); markDirty() } },
    setShowGrid(v) { if (!_engineDead) { engine.set_show_grid(!!v); markDirty() } },

    /** Pick one of 5 heatmap colour presets (idx 0..=4). Indexes outside
     *  that range are clamped by the WASM side, so passing a stale value
     *  from localStorage can never crash the engine. */
    setHeatmapPalette(idx) {
      if (_engineDead) return
      const i = Math.max(0, Math.min(4, idx | 0))
      try { engine.set_heatmap_palette?.(i) } catch {}
      markDirty()
    },
    /** Toggle 3-D bubble rendering for large trades. False = flat alpha
     *  circles for everything (cheaper). True = glossy gradient bubbles
     *  for trades whose radius crosses the engine's `LARGE_BUBBLE_RADIUS_PX`. */
    setLargeTrade3d(enabled) {
      if (_engineDead) return
      try { engine.set_large_trade_3d?.(!!enabled) } catch {}
      markDirty()
    },
    /** Uniform scale on trade-bubble radius + the LARGE / volume-label
     *  cutoffs. 1.0 = baseline, 0.5 = half-size, 2.5 = ceiling. WASM
     *  clamps to its own bounds so any out-of-range value is safe. */
    setLargeTradeScale(scale) {
      if (_engineDead) return
      const s = Number.isFinite(scale) ? +scale : 1.0
      try { engine.set_large_trade_scale?.(s) } catch {}
      markDirty()
    },
    /** Toggle the per-bucket volume strip (bottom 12 % of the chart). */
    setShowVolume(v) {
      if (_engineDead) return
      try { engine.set_show_volume?.(!!v) } catch {}
      markDirty()
    },
    /** Set the heatmap intensity window — equivalent to the orderbook
     *  chart's dual-handle slider. `min`/`max` are fractions of
     *  `book.smooth_max` in `[0..1]`. The WASM side clamps to keep
     *  `0 ≤ min < max ≤ 1` so any stale call (e.g. mid-drag from a
     *  slider that hasn't snapped yet) is safe. Default `(0, 1)` =
     *  identity ⇒ no change to the alpha curve. */
    setHeatmapIntensity(min, max) {
      if (_engineDead) return
      const mn = Number.isFinite(min) ? Math.max(0, Math.min(0.99, +min)) : 0
      const mx = Number.isFinite(max) ? Math.max(mn + 0.01, Math.min(1, +max)) : 1
      try { engine.set_heatmap_intensity?.(mn, mx) } catch {}
      markDirty()
    },
    /** Toggle the latest-depth profile bars on the right edge — the
     *  flowsurface signature feature surfaces dominant resting walls. */
    setShowLatestProfile(v) {
      if (_engineDead) return
      try { engine.set_show_latest_profile?.(!!v) } catch {}
      markDirty()
    },
    setFollowLive(v) { if (!_engineDead) { engine.set_follow_live(!!v); markDirty() } },
    setAutoScaleY(v) { if (!_engineDead) { engine.set_auto_scale_y(!!v); markDirty() } },
    /** Snap viewport back to "live + auto-fit" — the equivalent of the
     *  Flowsurface `R` keystroke. */
    resetView() { if (!_engineDead) { engine.reset_view(); markDirty() } },

    /** Latest mid price observed from the data feed. */
    getLastMid() {
      if (_engineDead) return 0
      try { return engine.get_last_mid() } catch { return 0 }
    },

    /** Drop ring buffer state — used on symbol change. */
    clearData() {
      if (_engineDead) return
      try { engine.clear() } catch {}
      pendingTrades.length = 0
      pendingBookBids = null
      pendingBookAsks = null
      pendingBookMid = 0
      markDirty()
    },

    destroy() {
      if (destroyed) return
      destroyed = true
      running = false
      paused = true
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
      _cleanupEvents()
      try { engine.free?.() } catch {}
    },
  }
}
