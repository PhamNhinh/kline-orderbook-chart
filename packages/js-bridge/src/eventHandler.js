/**
 * Event handler: routes mouse/touch/keyboard events to the WASM engine.
 * Detects hit zones (main, x-axis, y-axis) and dispatches accordingly.
 *
 * Tool registry pattern: each drawing tool declares its interaction type
 * and WASM bindings, so adding a new tool only requires a registry entry.
 *
 * Delegates mouse events to eventMouse.js and touch events to eventTouch.js.
 * Constants and pure helpers live in eventConstants.js.
 */

import { ZONE_MAIN, ZONE_XAXIS, ZONE_YAXIS, ZONE_RSI_YAXIS, PANE_MAIN, panChartViewport, isIndicatorSubPaneZone, isIndicatorYAxisZone, indicatorPaneId } from './eventConstants.js'
import { setupMouseEvents } from './eventMouse.js'
import { setupTouchEvents } from './eventTouch.js'

export function setupEvents(canvas, engine, callbacks) {
  // ── Shared mutable state ──
  const ctx = {
    disposed: false,
    isDragging: false,
    dragZone: ZONE_MAIN,
    lastX: 0,
    lastY: 0,
    lastTouchDist: 0,
    isResizingRsi: false,
    isResizingOi: false,
    isResizingFr: false,
    isResizingCvd: false,
    resizeStartY: 0,
    resizeStartRatio: 0,
    lastClickTime: 0,
    isDraggingAnchor: false,
    dragAnchorIdx: -1,
    dragAnchorPane: PANE_MAIN,
    isBrushing: false,
    isDraggingDrawing: false,
    dragDrawingPane: PANE_MAIN,
    dragDrawingLastWx: 0,
    dragDrawingLastWy: 0,
    touchStartX: 0,
    touchStartY: 0,
    touchMoved: false,
    // True once the active gesture has used >= 2 fingers (pinch zoom).
    // Stays true until ALL fingers are lifted, so the per-finger touchend
    // sequence of a pinch (2→1→0) never gets misread as one or two taps.
    pinchActive: false,
    longPressTimer: null,
    isCrosshairMode: false,
    liqPinTimer: null,
    liqPinSx: 0,
    liqPinSy: 0,
    velSamples: [],
    momentumRaf: null,
    momentumVx: 0,
    momentumVy: 0,
    momentumZone: ZONE_MAIN,
    lastTapTime: 0,
    lastTapX: 0,
    lastTapY: 0,
    drawingMode: null,
  }

  // ── Momentum / inertia scrolling ──
  const MOMENTUM_FRICTION = 0.92
  const MOMENTUM_MIN_VEL = 0.5
  const VEL_SAMPLE_MS = 80

  ctx.recordVelocity = function (dx, dy) {
    const now = performance.now()
    ctx.velSamples.push({ dx, dy, t: now })
    while (ctx.velSamples.length > 0 && now - ctx.velSamples[0].t > VEL_SAMPLE_MS) {
      ctx.velSamples.shift()
    }
  }

  function computeVelocity() {
    if (ctx.velSamples.length < 2) return { vx: 0, vy: 0 }
    const first = ctx.velSamples[0]
    const last = ctx.velSamples[ctx.velSamples.length - 1]
    const dt = last.t - first.t
    if (dt < 5) return { vx: 0, vy: 0 }
    let sumDx = 0, sumDy = 0
    for (const s of ctx.velSamples) { sumDx += s.dx; sumDy += s.dy }
    const fps60dt = 16.67
    return { vx: (sumDx / dt) * fps60dt, vy: (sumDy / dt) * fps60dt }
  }

  ctx.cancelMomentum = function () {
    if (ctx.momentumRaf) { cancelAnimationFrame(ctx.momentumRaf); ctx.momentumRaf = null }
    ctx.velSamples = []
  }

  ctx.startMomentum = function (zone) {
    const { vx, vy } = computeVelocity()
    ctx.velSamples = []
    if (Math.abs(vx) < MOMENTUM_MIN_VEL && Math.abs(vy) < MOMENTUM_MIN_VEL) return
    ctx.momentumVx = vx
    ctx.momentumVy = vy
    ctx.momentumZone = zone

    function tick() {
      ctx.momentumVx *= MOMENTUM_FRICTION
      ctx.momentumVy *= MOMENTUM_FRICTION
      if (Math.abs(ctx.momentumVx) < MOMENTUM_MIN_VEL && Math.abs(ctx.momentumVy) < MOMENTUM_MIN_VEL) {
        ctx.momentumRaf = null
        return
      }
      if (ctx.momentumZone === ZONE_XAXIS) engine.pan_x(ctx.momentumVx)
      else if (ctx.momentumZone === ZONE_YAXIS) engine.pan_y(ctx.momentumVy)
      else if (ctx.momentumZone === ZONE_RSI_YAXIS) { ctx.momentumRaf = null; return }
      else if (isIndicatorYAxisZone(ctx.momentumZone)) engine.pan_indicator_y(indicatorPaneId(ctx.momentumZone), ctx.momentumVy)
      else panChartViewport(engine, ctx.momentumZone, ctx.momentumVx, ctx.momentumVy)
      callbacks.onDirty()
      ctx.momentumRaf = requestAnimationFrame(tick)
    }
    ctx.momentumRaf = requestAnimationFrame(tick)
  }

  // ── Drawing API ──
  const drawing = {
    setMode(tool, style) {
      if (!tool) {
        if (ctx.drawingMode?.pathStarted) {
          engine.finish_path()
        }
        ctx.drawingMode = null
        engine.clear_drawing_preview()
        canvas.style.cursor = 'crosshair'
      } else {
        ctx.drawingMode = { tool, style, step: 0, x1: 0, y1: 0 }
        canvas.style.cursor = 'crosshair'
      }
      callbacks.onDirty()
    },
    getMode() { return ctx.drawingMode },
  }
  callbacks.drawingApi?.(drawing)

  ctx.finishDrawing = function () {
    engine.clear_drawing_preview()
    callbacks.onDrawingComplete?.()
    ctx.drawingMode = null
    canvas.style.cursor = 'crosshair'
  }

  // ── Bind mouse & touch event handlers ──
  setupMouseEvents(canvas, engine, callbacks, ctx)
  setupTouchEvents(canvas, engine, callbacks, ctx)

  // ── Keyboard ──
  const keyHandler = (e) => {
    const tag = document.activeElement?.tagName
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable
    if ((e.key === 'Delete' || e.key === 'Backspace') && !ctx.drawingMode && !isTyping) {
      const selDraw = engine.get_selected_drawing()
      if (selDraw > 0) { engine.remove_drawing(selDraw); callbacks.onDrawingSelected?.(0); callbacks.onDirty(); return }
      const selMark = engine.get_selected_marker()
      if (selMark > 0) { engine.remove_marker(selMark); callbacks.onMarkerSelected?.(0); callbacks.onDirty(); return }
    }
    if (e.key === 'Escape' && !ctx.drawingMode) {
      const selDraw = engine.get_selected_drawing()
      if (selDraw > 0) { engine.deselect_drawing(); callbacks.onDrawingSelected?.(0); callbacks.onDirty(); return }
      const selMark = engine.get_selected_marker()
      if (selMark > 0) { engine.deselect_marker(); callbacks.onMarkerSelected?.(0); callbacks.onDirty(); return }
    }
    if (e.key === 'Escape' && ctx.drawingMode) {
      if (ctx.drawingMode.pathStarted) {
        if (ctx.drawingMode.tool === 'elliott') {
          engine.finish_elliott_manual()
        } else {
          engine.finish_path()
        }
        ctx.finishDrawing()
        callbacks.onDirty()
        return
      }
      engine.clear_drawing_preview()
      ctx.drawingMode = null
      canvas.style.cursor = 'crosshair'
      callbacks.onDrawingCancel?.()
      callbacks.onDirty()
      return
    }
    const step = 20
    switch (e.key) {
      case '+': case '=': engine.zoom(canvas.width / 2, canvas.height / 2, 0.9); break
      case '-': engine.zoom(canvas.width / 2, canvas.height / 2, 1.1); break
      case 'ArrowLeft': engine.pan_x(step); break
      case 'ArrowRight': engine.pan_x(-step); break
      case 'ArrowUp': engine.pan_y(-step); break
      case 'ArrowDown': engine.pan_y(step); break
      case 'r': case 'R':
        engine.auto_scale_y()
        for (let p = 1; p <= 5; p++) engine.reset_indicator_y_auto(p)
        break
      default: return
    }
    callbacks.onDirty()
  }

  window.addEventListener('keydown', keyHandler)

  return () => {
    ctx.disposed = true
    ctx.cancelMomentum()
    window.removeEventListener('keydown', keyHandler)
  }
}
