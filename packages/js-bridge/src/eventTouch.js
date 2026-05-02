/**
 * Touch event handlers: touchstart, touchmove, touchend.
 * All shared state is accessed via the ctx object passed from setupEvents.
 */

import {
  ZONE_MAIN, ZONE_XAXIS, ZONE_YAXIS, ZONE_RSI, ZONE_RSI_YAXIS,
  PANE_MAIN,
  TAP_THRESHOLD as _BASE_TAP_THRESHOLD, LONG_PRESS_MS, LIQ_PIN_MS, DOUBLE_TAP_MS, DOUBLE_TAP_DIST,
  TOOL_REGISTRY,
  is2Point, is3Point, is1Point, isFreehand, isNPoint, isElliottManual,
  addDrawing, showPreview, screenToWorld, paneFromZone, isDrawableZone,
  panChartViewport, isIndicatorSubPaneZone, isIndicatorYAxisZone, indicatorPaneId,
  addBrushPointsDensified,
} from './eventConstants.js'

// Touch taps have more natural jitter than mouse clicks
const TAP_THRESHOLD = 25

export function setupTouchEvents(canvas, engine, callbacks, ctx) {
  // ── Touch start ──
  canvas.addEventListener('touchstart', (e) => {
    if (ctx.disposed) return
    e.preventDefault()
    ctx.cancelMomentum()
    if (e.touches.length === 2) {
      clearTimeout(ctx.longPressTimer)
      if (ctx.liqPinTimer) { clearTimeout(ctx.liqPinTimer); ctx.liqPinTimer = null }
      ctx.isCrosshairMode = false
      ctx.pinchActive = true
      // Cancel any pending single-tap pairing so the previous solo tap
      // can't combine with the post-pinch finger-lift to fake a double-tap.
      ctx.lastTapTime = 0
      const rect = canvas.getBoundingClientRect()
      const dx = e.touches[1].clientX - e.touches[0].clientX
      const dy = e.touches[1].clientY - e.touches[0].clientY
      ctx.lastTouchDist = Math.sqrt(dx * dx + dy * dy)
      ctx.lastX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
      ctx.lastY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
      ctx.dragZone = engine.hit_zone(ctx.lastX, ctx.lastY)
      ctx.pinchAnchorY = ctx.lastY
    } else if (e.touches.length === 1) {
      const rect = canvas.getBoundingClientRect()
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      ctx.touchStartX = tx
      ctx.touchStartY = ty
      ctx.touchMoved = false

      const dm = ctx.drawingMode
      if (dm) {
        const zone = engine.hit_zone(tx, ty)
        if (isDrawableZone(zone)) {
          const pane = paneFromZone(zone)
          const { wx, wy } = screenToWorld(engine, tx, ty, pane)
          const tool = dm.tool

          if (isElliottManual(tool)) {
            if (!dm.pathStarted) {
              dm.pane = pane
              engine.start_elliott_manual(dm.style.r, dm.style.g, dm.style.b, dm.style.lineWidth, pane)
              engine.add_elliott_manual_point(wx, wy)
              dm.pathStarted = true
              dm.step = 1
            } else {
              const done = engine.add_elliott_manual_point(wx, wy)
              if (done) {
                ctx.finishDrawing()
                callbacks.onDirty()
                return
              }
            }
          } else if (isNPoint(tool)) {
            if (!dm.pathStarted) {
              dm.pane = pane
              engine.start_path(dm.style.r, dm.style.g, dm.style.b, dm.style.lineWidth, dm.style.dashed, pane)
              engine.add_path_point(wx, wy)
              dm.pathStarted = true
              dm.step = 1
            } else {
              engine.add_path_point(wx, wy)
            }
          } else if (isFreehand(tool)) {
            dm.pane = pane
            engine.start_brush(dm.style.r, dm.style.g, dm.style.b, dm.style.lineWidth, pane)
            engine.add_brush_point(wx, wy)
            ctx.isBrushing = true
            ctx.brushLastSx = tx
            ctx.brushLastSy = ty
          } else if (is3Point(tool)) {
            if (dm.step === 0) {
              dm.x1 = wx; dm.y1 = wy; dm.pane = pane; dm.step = 1
              dm._stepAtTouchStart = 0
              showPreview(engine, tool, dm, wx, wy, dm.style, pane)
            } else if (dm.step === 1) {
              dm._stepAtTouchStart = 1
              showPreview(engine, tool, dm, wx, wy, dm.style, dm.pane)
            } else {
              dm._stepAtTouchStart = 2
              showPreview(engine, tool, dm, wx, wy, dm.style, dm.pane)
            }
          } else if (is2Point(tool)) {
            if (dm.step === 0) {
              dm.x1 = wx; dm.y1 = wy; dm.pane = pane; dm.step = 1
              dm._stepAtTouchStart = 0
              showPreview(engine, tool, dm, wx, wy, dm.style, pane)
            } else {
              dm._stepAtTouchStart = 1
              showPreview(engine, tool, dm, wx, wy, dm.style, dm.pane)
            }
          } else if (is1Point(tool)) {
            dm.pane = pane
            showPreview(engine, tool, dm, wx, wy, dm.style, pane)
          } else {
            dm.pane = pane
            addDrawing(engine, tool, dm, wx, wy, dm.style)
            ctx.finishDrawing()
          }
          engine.set_crosshair(tx, ty)
          callbacks.onDirty()
          callbacks.onCrosshairMove?.(tx, ty, zone)
        }
        return
      }

      let hit = engine.hover_hit_test(tx, ty)
      let zone = hit[0], selDraw = hit[1], anchorHit = hit[2]
      if (isDrawableZone(zone) && !ctx.drawingMode && selDraw > 0) {
        if (anchorHit >= 0) {
          ctx.isDraggingAnchor = true
          ctx.dragAnchorIdx = anchorHit
          ctx.dragAnchorPane = paneFromZone(zone)
          return
        }
        const drawingHit = hit[3]
        if (drawingHit === selDraw) {
          ctx.isDraggingDrawing = true
          ctx.dragDrawingPane = paneFromZone(zone)
          const { wx, wy } = screenToWorld(engine, tx, ty, ctx.dragDrawingPane)
          ctx.dragDrawingLastWx = wx
          ctx.dragDrawingLastWy = wy
          return
        }
      }

      ctx.isDragging = true
      ctx.isCrosshairMode = false
      ctx.lastX = tx
      ctx.lastY = ty
      ctx.dragZone = zone

      // Start long-press timer: if held without moving, switch to crosshair-only mode
      clearTimeout(ctx.longPressTimer)
      ctx.longPressTimer = setTimeout(() => {
        if (ctx.isDragging && !ctx.touchMoved) {
          ctx.isCrosshairMode = true
          engine.set_crosshair(tx, ty)
          callbacks.onDirty()
          callbacks.onCrosshairMove?.(tx, ty, ctx.dragZone)
          callbacks.onVrvpHover?.(tx, ty)
        }
      }, LONG_PRESS_MS)

      // Liq annotation pin timer for touch
      if (isDrawableZone(ctx.dragZone)) {
        ctx.liqPinSx = tx
        ctx.liqPinSy = ty
        if (ctx.liqPinTimer) clearTimeout(ctx.liqPinTimer)
        ctx.liqPinTimer = setTimeout(() => {
          ctx.liqPinTimer = null
          if (!ctx.touchMoved) {
            callbacks.onLiqAnnotationPin?.(ctx.liqPinSx, ctx.liqPinSy)
          }
        }, LIQ_PIN_MS)
      }
    }
  }, { passive: false })

  // ── Touch move ──
  canvas.addEventListener('touchmove', (e) => {
    if (ctx.disposed) return
    e.preventDefault()
    const rect = canvas.getBoundingClientRect()

    // Anchor drag on touch
    if (ctx.isDraggingAnchor && e.touches.length === 1) {
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      const { wx, wy } = screenToWorld(engine, tx, ty, ctx.dragAnchorPane)
      engine.update_drawing_anchor(ctx.dragAnchorIdx, wx, wy)
      engine.set_crosshair(tx, ty)
      callbacks.onDirty()
      return
    }

    // Drawing body drag on touch
    if (ctx.isDraggingDrawing && e.touches.length === 1) {
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      ctx.touchMoved = true
      const { wx, wy } = screenToWorld(engine, tx, ty, ctx.dragDrawingPane)
      const dx = wx - ctx.dragDrawingLastWx
      const dy = wy - ctx.dragDrawingLastWy
      engine.move_drawing(dx, dy)
      ctx.dragDrawingLastWx = wx
      ctx.dragDrawingLastWy = wy
      engine.set_crosshair(tx, ty)
      callbacks.onDirty()
      return
    }

    const dm = ctx.drawingMode

    // Freehand brush on touch
    if (ctx.isBrushing && dm && e.touches.length === 1) {
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      const p = dm.pane || PANE_MAIN
      addBrushPointsDensified(engine, tx, ty, ctx.brushLastSx, ctx.brushLastSy, p)
      ctx.brushLastSx = tx
      ctx.brushLastSy = ty
      engine.set_crosshair(tx, ty)
      callbacks.onDirty()
      ctx.touchMoved = true
      return
    }

    // Elliott manual: update cursor preview on touch move
    if (dm && isElliottManual(dm.tool) && dm.pathStarted && e.touches.length === 1) {
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      const p = dm.pane || PANE_MAIN
      const { wx, wy } = screenToWorld(engine, tx, ty, p)
      engine.set_elliott_manual_cursor(wx, wy)
      engine.set_crosshair(tx, ty)
      callbacks.onDirty()
      ctx.touchMoved = true
      return
    }

    // Path tool: update cursor preview on touch move
    if (dm && isNPoint(dm.tool) && dm.pathStarted && e.touches.length === 1) {
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      const p = dm.pane || PANE_MAIN
      const { wx, wy } = screenToWorld(engine, tx, ty, p)
      engine.set_path_cursor(wx, wy)
      engine.set_crosshair(tx, ty)
      callbacks.onDirty()
      ctx.touchMoved = true
      return
    }

    // Drawing preview on touch move (2-point tools)
    if (dm && dm.step > 0 && e.touches.length === 1) {
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      if (!ctx.touchMoved && (Math.abs(tx - ctx.touchStartX) > TAP_THRESHOLD || Math.abs(ty - ctx.touchStartY) > TAP_THRESHOLD)) {
        ctx.touchMoved = true
      }
      const p = dm.pane || PANE_MAIN
      const { wx, wy } = screenToWorld(engine, tx, ty, p)
      showPreview(engine, dm.tool, dm, wx, wy, dm.style, p)
      engine.set_crosshair(tx, ty)
      const dmZone = engine.hit_zone(tx, ty)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(tx, ty, dmZone)
      return
    }

    // 1-point tool preview follows finger
    if (dm && is1Point(dm.tool) && e.touches.length === 1) {
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      const zone = engine.hit_zone(tx, ty)
      const p = paneFromZone(zone)
      const { wx, wy } = screenToWorld(engine, tx, ty, p)
      showPreview(engine, dm.tool, dm, wx, wy, dm.style, p)
      engine.set_crosshair(tx, ty)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(tx, ty, zone)
      return
    }

    if (e.touches.length === 2) {
      ctx.velSamples = []
      ctx.pinchActive = true
      const dx = e.touches[1].clientX - e.touches[0].clientX
      const dy = e.touches[1].clientY - e.touches[0].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const factor = ctx.lastTouchDist / dist
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top

      const yAnchor = ctx.pinchAnchorY ?? cy
      if (ctx.dragZone === ZONE_YAXIS) { engine.zoom_y(yAnchor, factor) }
      else if (isIndicatorYAxisZone(ctx.dragZone) && ctx.dragZone !== ZONE_RSI_YAXIS) {
        engine.zoom_indicator_y(indicatorPaneId(ctx.dragZone), yAnchor, factor)
      } else if (ctx.dragZone === ZONE_RSI_YAXIS) {
        engine.zoom_x(cx, factor)
        panChartViewport(engine, ZONE_RSI, cx - ctx.lastX, cy - ctx.lastY)
      } else if (ctx.dragZone === ZONE_XAXIS) { engine.zoom_x(cx, factor) }
      else if (isIndicatorSubPaneZone(ctx.dragZone)) {
        engine.zoom_x(cx, factor)
        panChartViewport(engine, ctx.dragZone, cx - ctx.lastX, cy - ctx.lastY)
      } else {
        engine.zoom(cx, cy, factor)
        panChartViewport(engine, ctx.dragZone, cx - ctx.lastX, cy - ctx.lastY)
      }

      ctx.lastTouchDist = dist
      ctx.lastX = cx
      ctx.lastY = cy
      callbacks.onDirty()
    } else if (e.touches.length === 1 && ctx.isDragging) {
      const tx = e.touches[0].clientX - rect.left
      const ty = e.touches[0].clientY - rect.top
      const dx = tx - ctx.lastX
      const dy = ty - ctx.lastY

      if (!ctx.touchMoved && (Math.abs(tx - ctx.touchStartX) > TAP_THRESHOLD || Math.abs(ty - ctx.touchStartY) > TAP_THRESHOLD)) {
        ctx.touchMoved = true
        if (!ctx.isCrosshairMode) {
          clearTimeout(ctx.longPressTimer)
        }
        if (ctx.liqPinTimer) { clearTimeout(ctx.liqPinTimer); ctx.liqPinTimer = null }
      }

      if (ctx.isCrosshairMode) {
        engine.set_crosshair(tx, ty)
        callbacks.onDirty()
        callbacks.onCrosshairMove?.(tx, ty, ctx.dragZone)
        callbacks.onVrvpHover?.(tx, ty)
      } else if (ctx.touchMoved) {
        ctx.lastX = tx
        ctx.lastY = ty

        const isYAxisZoom = ctx.dragZone === ZONE_YAXIS || isIndicatorYAxisZone(ctx.dragZone)
        if (!isYAxisZoom) ctx.recordVelocity(dx, dy)

        if (ctx.dragZone === ZONE_XAXIS) { engine.pan_x(dx) }
        else if (ctx.dragZone === ZONE_YAXIS) {
          const factor = Math.pow(1.005, dy)
          engine.zoom_y(ctx.touchStartY, factor)
        } else if (ctx.dragZone === ZONE_RSI_YAXIS) {
          /* RSI Y-axis: zoom locked — do not pan main chart */
        } else if (isIndicatorYAxisZone(ctx.dragZone)) {
          const factor = Math.pow(1.005, dy)
          engine.zoom_indicator_y(indicatorPaneId(ctx.dragZone), ctx.touchStartY, factor)
        } else { panChartViewport(engine, ctx.dragZone, dx, dy) }
        callbacks.onDirty()
      } else {
        ctx.lastX = tx
        ctx.lastY = ty
      }
    }
  }, { passive: false })

  // ── Touch end ──
  canvas.addEventListener('touchend', (e) => {
    if (ctx.disposed) return
    clearTimeout(ctx.longPressTimer)
    if (ctx.liqPinTimer) { clearTimeout(ctx.liqPinTimer); ctx.liqPinTimer = null }

    if (ctx.isDraggingAnchor) {
      ctx.isDraggingAnchor = false
      ctx.dragAnchorIdx = -1
      engine.hide_crosshair()
      callbacks.onDirty()
      callbacks.onCrosshairHide?.()
      return
    }

    if (ctx.isDraggingDrawing) {
      ctx.isDraggingDrawing = false
      engine.hide_crosshair()
      callbacks.onDirty()
      callbacks.onCrosshairHide?.()
      if (!ctx.touchMoved) {
        const hitId = engine.get_selected_drawing()
        if (hitId > 0) {
          const rect = canvas.getBoundingClientRect()
          callbacks.onDrawingDblClick?.(hitId, ctx.touchStartX, ctx.touchStartY, ctx.touchStartX + rect.left, ctx.touchStartY + rect.top)
        }
      }
      return
    }

    // Complete freehand brush on touch end
    if (ctx.isBrushing) {
      ctx.isBrushing = false
      ctx.brushLastSx = null
      ctx.brushLastSy = null
      engine.finish_brush()
      ctx.finishDrawing()
      callbacks.onDirty()
      callbacks.onCrosshairHide?.()
      return
    }

    const dm = ctx.drawingMode

    // Elliott manual: double-tap to finish
    if (dm && isElliottManual(dm.tool) && dm.pathStarted) {
      const now = Date.now()
      const dx = ctx.touchStartX - (ctx._pathLastTapX || 0)
      const dy = ctx.touchStartY - (ctx._pathLastTapY || 0)
      const dist = Math.sqrt(dx * dx + dy * dy)
      if ((now - (ctx._pathLastTapTime || 0) < DOUBLE_TAP_MS) && (dist < DOUBLE_TAP_DIST)) {
        engine.finish_elliott_manual()
        ctx.finishDrawing()
        ctx._pathLastTapTime = 0
      } else {
        ctx._pathLastTapTime = now
        ctx._pathLastTapX = ctx.touchStartX
        ctx._pathLastTapY = ctx.touchStartY
      }
      ctx.isDragging = false
      ctx.lastTouchDist = 0
      callbacks.onDirty()
      return
    }

    // Path tool: double-tap to finish
    if (dm && isNPoint(dm.tool) && dm.pathStarted) {
      const now = Date.now()
      const dx = ctx.touchStartX - (ctx._pathLastTapX || 0)
      const dy = ctx.touchStartY - (ctx._pathLastTapY || 0)
      const dist = Math.sqrt(dx * dx + dy * dy)
      if ((now - (ctx._pathLastTapTime || 0) < DOUBLE_TAP_MS) && (dist < DOUBLE_TAP_DIST)) {
        engine.finish_path()
        ctx.finishDrawing()
        ctx._pathLastTapTime = 0
      } else {
        ctx._pathLastTapTime = now
        ctx._pathLastTapX = ctx.touchStartX
        ctx._pathLastTapY = ctx.touchStartY
      }
      ctx.isDragging = false
      ctx.lastTouchDist = 0
      callbacks.onDirty()
      return
    }

    // 3-point tool touchend
    if (dm && is3Point(dm.tool)) {
      const wasStep = dm._stepAtTouchStart
      if (dm.step === 1 && (wasStep === 1 || ctx.touchMoved)) {
        const rect2 = canvas.getBoundingClientRect()
        const ct = e.changedTouches?.[0]
        if (ct) {
          const tx = ct.clientX - rect2.left
          const ty = ct.clientY - rect2.top
          const p = dm.pane || PANE_MAIN
          const { wx, wy } = screenToWorld(engine, tx, ty, p)
          dm.x2 = wx
          dm.y2 = wy
          dm.step = 2
          engine.clear_drawing_preview()
        }
      } else if (dm.step === 2 && (wasStep === 2 || ctx.touchMoved)) {
        const rect2 = canvas.getBoundingClientRect()
        const ct = e.changedTouches?.[0]
        if (ct) {
          const tx = ct.clientX - rect2.left
          const ty = ct.clientY - rect2.top
          const p = dm.pane || PANE_MAIN
          const { wx, wy } = screenToWorld(engine, tx, ty, p)
          const reg = TOOL_REGISTRY[dm.tool]
          if (reg && reg.previewFn === 'fib_ext') {
            engine.clear_fib_ext_preview()
          } else {
            engine.clear_channel_preview()
          }
          addDrawing(engine, dm.tool, dm, wx, wy, dm.style)
          ctx.finishDrawing()
        }
      }
      ctx.isDragging = false
      ctx.lastTouchDist = 0
      if (!ctx.drawingMode) {
        engine.hide_crosshair()
        callbacks.onCrosshairHide?.()
      }
      callbacks.onDirty()
      return
    }

    // TradingView-style 2-point drawing:
    if (dm && dm.step === 1 && is2Point(dm.tool)) {
      const wasSecondTouch = dm._stepAtTouchStart === 1
      if (wasSecondTouch || ctx.touchMoved) {
        const rect2 = canvas.getBoundingClientRect()
        const ct = e.changedTouches?.[0]
        if (ct) {
          const tx = ct.clientX - rect2.left
          const ty = ct.clientY - rect2.top
          const p = dm.pane || PANE_MAIN
          const { wx, wy } = screenToWorld(engine, tx, ty, p)
          addDrawing(engine, dm.tool, dm, wx, wy, dm.style)
          ctx.finishDrawing()
        }
      }
      ctx.isDragging = false
      ctx.lastTouchDist = 0
      if (!ctx.drawingMode) {
        engine.hide_crosshair()
        callbacks.onCrosshairHide?.()
      }
      callbacks.onDirty()
      return
    }

    // 1-point tool: place on touchend at final position
    if (dm && is1Point(dm.tool)) {
      const rect2 = canvas.getBoundingClientRect()
      const ct = e.changedTouches?.[0]
      if (ct) {
        const tx = ct.clientX - rect2.left
        const ty = ct.clientY - rect2.top
        const zone = engine.hit_zone(tx, ty)
        const p = isDrawableZone(zone) ? paneFromZone(zone) : (dm.pane || PANE_MAIN)
        const { wx, wy } = screenToWorld(engine, tx, ty, p)
        const tool = dm.tool
        engine.clear_drawing_preview()
        const newId = addDrawing(engine, tool, dm, wx, wy, dm.style)
        ctx.finishDrawing()
        if (tool === 'textnote' && newId > 0) {
          engine.select_drawing(newId)
          callbacks.onDrawingSelected?.(newId)
          callbacks.onDrawingDblClick?.(newId, tx, ty, tx + rect2.left, ty + rect2.top)
        }
      }
      ctx.isDragging = false
      ctx.lastTouchDist = 0
      engine.hide_crosshair()
      callbacks.onCrosshairHide?.()
      callbacks.onDirty()
      return
    }

    // Tap detection for selection + double-tap to edit
    // Uses direct hit_test_drawing/hit_test_marker (simple u32) instead of hover_hit_test (Int32Array)
    //
    // Gate on `e.touches.length === 0` and `!ctx.pinchActive` so a pinch
    // zoom never fires a phantom tap. A pinch produces two touchend events
    // (2→1 fingers, then 1→0); without these guards the per-finger lifts
    // get classified as taps at the original first-finger position and
    // two consecutive pinches register as a fake double-tap, which on the
    // main chart would toggle Focus Mode and hide indicator sub-panes.
    const allFingersUp = e.touches.length === 0
    const _isTap = allFingersUp && !ctx.pinchActive && !ctx.touchMoved && !ctx.drawingMode
    if (_isTap) {
      const now = Date.now()
      const tx = ctx.touchStartX
      const ty = ctx.touchStartY
      const tdx = tx - ctx.lastTapX
      const tdy = ty - ctx.lastTapY
      const tapDist = Math.sqrt(tdx * tdx + tdy * tdy)
      const isDoubleTap = (now - ctx.lastTapTime < DOUBLE_TAP_MS) && (tapDist < DOUBLE_TAP_DIST)
      const zone = engine.hit_zone(tx, ty)

      // On double-tap, give drawings priority over Y-auto reset so drawings in
      // sub-panes (RSI/OI/FR/CVD/VPIN/AggLiq) can still open the edit popup.
      const dblTapDrawingHit = isDoubleTap
        ? engine.hit_test_drawing(tx, ty)
        : 0

      if (isDoubleTap && (isIndicatorSubPaneZone(zone) || isIndicatorYAxisZone(zone)) && dblTapDrawingHit <= 0) {
        engine.reset_indicator_y_auto(indicatorPaneId(zone))
        callbacks.onDirty()
      } else if (isDrawableZone(zone)) {
        const selDraw = engine.get_selected_drawing()

        let drawingHit = dblTapDrawingHit > 0 ? dblTapDrawingHit : engine.hit_test_drawing(tx, ty)
        let markerHit = 0
        if (drawingHit <= 0) {
          markerHit = engine.hit_test_marker(tx, ty)
        }

        
        if (drawingHit > 0) {
          engine.deselect_marker()
          callbacks.onMarkerSelected?.(0)
          engine.select_drawing(drawingHit)
          const rect = canvas.getBoundingClientRect()
          const clientX = tx + rect.left
          const clientY = ty + rect.top
          callbacks.onDrawingSelected?.(drawingHit, clientX, clientY)
          if (selDraw <= 0 || selDraw === drawingHit) {
            callbacks.onDrawingDblClick?.(drawingHit, tx, ty, clientX, clientY)
          }
          callbacks.onDirty()
        } else if (markerHit > 0) {
          engine.deselect_drawing()
          callbacks.onDrawingSelected?.(0)
          engine.select_marker(markerHit)
          callbacks.onMarkerSelected?.(markerHit)
          callbacks.onDirty()
        } else {
          if (selDraw > 0) { engine.deselect_drawing(); callbacks.onDrawingSelected?.(0); callbacks.onDirty() }
          const selMark = engine.get_selected_marker()
          if (selMark > 0) { engine.deselect_marker(); callbacks.onMarkerSelected?.(0); callbacks.onDirty() }
          // Double-tap on empty main chart → forward to host for Focus
          // Mode (TradingView-style: hide indicator sub-panes).
          if (isDoubleTap && zone === ZONE_MAIN) {
            const rect = canvas.getBoundingClientRect()
            callbacks.onChartDblClick?.(tx, ty, tx + rect.left, ty + rect.top)
          }
        }
      }

      ctx.lastTapTime = now
      ctx.lastTapX = tx
      ctx.lastTapY = ty
    }

    // Inertial scrolling only fires when the whole gesture finishes and
    // it was a real single-finger pan, never the tail of a pinch.
    if (allFingersUp && !ctx.pinchActive
        && ctx.touchMoved && !ctx.isCrosshairMode && !ctx.drawingMode
        && ctx.dragZone !== ZONE_YAXIS && !isIndicatorYAxisZone(ctx.dragZone)) {
      ctx.startMomentum(ctx.dragZone)
    }

    ctx.isDragging = false
    ctx.isCrosshairMode = false
    ctx.lastTouchDist = 0
    // Pinch state survives intermediate touchend events (when one of two
    // fingers lifts but the other is still down) and only clears once the
    // user is fully off the canvas — otherwise the final lift would still
    // be classified as a tap.
    if (allFingersUp) ctx.pinchActive = false
    if (!ctx.drawingMode || ctx.drawingMode.step === 0) {
      engine.hide_crosshair()
      callbacks.onCrosshairHide?.()
    }
    callbacks.onDirty()
    callbacks.onVrvpHover?.(null, null)
  })

  // Reset state when browser cancels touch (system gesture, etc.)
  canvas.addEventListener('touchcancel', () => {
    clearTimeout(ctx.longPressTimer)
    if (ctx.liqPinTimer) { clearTimeout(ctx.liqPinTimer); ctx.liqPinTimer = null }
    ctx.isDragging = false
    ctx.isDraggingAnchor = false
    ctx.isDraggingDrawing = false
    ctx.isBrushing = false
    ctx.brushLastSx = null
    ctx.brushLastSy = null
    ctx.isCrosshairMode = false
    ctx.lastTouchDist = 0
    ctx.pinchActive = false
    ctx.cancelMomentum()
    engine.hide_crosshair()
    callbacks.onCrosshairHide?.()
    callbacks.onDirty()
  })
}
