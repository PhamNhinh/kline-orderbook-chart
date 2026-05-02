/**
 * Mouse event handlers: wheel, mousedown, mousemove, mouseup, mouseleave, dblclick.
 * All shared state is accessed via the ctx object passed from setupEvents.
 *
 * Perf: crosshair position updates synchronously on mousemove (single-RAF to
 * render). Heavy cursor-style hit-testing is RAF-throttled separately.
 */

import {
  ZONE_MAIN, ZONE_VOLUME,
  ZONE_XAXIS, ZONE_YAXIS, ZONE_RSI, ZONE_RSI_SEP, ZONE_OI_SEP, ZONE_FR_SEP, ZONE_CVD_SEP, ZONE_VPIN_SEP, ZONE_OB_FLOW_SEP, ZONE_AGG_LIQ_SEP,
  ZONE_RSI_YAXIS,
  PANE_MAIN,
  LIQ_PIN_MS, LIQ_PIN_MOVE_THRESHOLD,
  TOOL_REGISTRY,
  is2Point, is3Point, is1Point, isFreehand, isNPoint, isElliottManual,
  addDrawing, showPreview, screenToWorld, paneFromZone, isDrawableZone,
  panChartViewport, isIndicatorSubPaneZone, isIndicatorYAxisZone, indicatorPaneId,
  addBrushPointsDensified,
} from './eventConstants.js'

export function setupMouseEvents(canvas, engine, callbacks, ctx) {
  // ── Mouse wheel (zoom) ──
  canvas.addEventListener('wheel', (e) => {
    if (ctx.disposed) return
    e.preventDefault()
    ctx.cancelMomentum()
    const factor = e.deltaY > 0 ? 1.1 : 0.9
    const zone = engine.hit_zone(e.offsetX, e.offsetY)

    if (isIndicatorYAxisZone(zone)) {
      // RSI Y scale: zoom locked (fixed 0–100 auto); other indicators keep Y zoom on their axis
      if (zone !== ZONE_RSI_YAXIS) {
        engine.zoom_indicator_y(indicatorPaneId(zone), e.offsetY, factor)
      }
    } else if (isIndicatorSubPaneZone(zone)) {
      // RSI pane: never vertical-zoom (ignore Ctrl); only horizontal zoom on time axis
      if (zone === ZONE_RSI) {
        engine.zoom_x(e.offsetX, factor)
      } else if (e.ctrlKey) {
        engine.zoom_indicator_y(indicatorPaneId(zone), e.offsetY, factor)
      } else {
        engine.zoom_x(e.offsetX, factor)
      }
    } else if (e.ctrlKey) {
      engine.zoom_y(e.offsetY, factor)
    } else if (e.shiftKey) {
      engine.zoom_x(e.offsetX, factor)
    } else if (zone === ZONE_XAXIS) {
      engine.zoom_x(e.offsetX, factor)
    } else if (zone === ZONE_YAXIS) {
      engine.zoom_y(e.offsetY, factor)
    } else {
      engine.zoom(e.offsetX, e.offsetY, factor)
    }

    callbacks.onDirty()
  }, { passive: false })

  // ── Mouse down ──
  canvas.addEventListener('mousedown', (e) => {
    if (ctx.disposed || e.button !== 0) return
    ctx.cancelMomentum()
    _cancelCursorRaf()

    const now = performance.now()
    if (now - ctx.lastClickTime < 300) { ctx.lastClickTime = now; return }
    ctx.lastClickTime = now

    // Drawing mode intercept
    const dm = ctx.drawingMode
    if (dm) {
      const zone = engine.hit_zone(e.offsetX, e.offsetY)
      if (!isDrawableZone(zone)) return
      const pane = paneFromZone(zone)
      const { wx, wy } = screenToWorld(engine, e.offsetX, e.offsetY, pane)
      const s = dm.style
      const tool = dm.tool

      if (isElliottManual(tool)) {
        if (!dm.pathStarted) {
          dm.pane = pane
          engine.start_elliott_manual(s.r, s.g, s.b, s.lineWidth, pane)
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
          engine.start_path(s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
          engine.add_path_point(wx, wy)
          dm.pathStarted = true
          dm.step = 1
        } else {
          engine.add_path_point(wx, wy)
        }
      } else if (isFreehand(tool)) {
        dm.pane = pane
        engine.start_brush(s.r, s.g, s.b, s.lineWidth, pane)
        engine.add_brush_point(wx, wy)
        ctx.isBrushing = true
        ctx.brushLastSx = e.offsetX
        ctx.brushLastSy = e.offsetY
      } else if (is3Point(tool)) {
        if (dm.step === 0) {
          dm.x1 = wx; dm.y1 = wy; dm.pane = pane; dm.step = 1
        } else if (dm.step === 1) {
          dm.x2 = wx; dm.y2 = wy; dm.step = 2
          engine.clear_drawing_preview()
        } else {
          const reg = TOOL_REGISTRY[tool]
          if (reg && reg.previewFn === 'fib_ext') {
            engine.clear_fib_ext_preview()
          } else {
            engine.clear_channel_preview()
          }
          addDrawing(engine, tool, dm, wx, wy, s)
          ctx.finishDrawing()
        }
      } else if (is2Point(tool)) {
        if (dm.step === 0) {
          dm.x1 = wx; dm.y1 = wy; dm.pane = pane; dm.step = 1
        } else {
          addDrawing(engine, tool, dm, wx, wy, s)
          ctx.finishDrawing()
        }
      } else {
        dm.pane = pane
        const newId = addDrawing(engine, tool, dm, wx, wy, s)
        ctx.finishDrawing()
        if (tool === 'textnote' && newId > 0) {
          engine.select_drawing(newId)
          callbacks.onDrawingSelected?.(newId)
          callbacks.onDrawingDblClick?.(newId, e.offsetX, e.offsetY, e.clientX, e.clientY)
        }
      }
      callbacks.onDirty()
      return
    }

    const zone = engine.hit_zone(e.offsetX, e.offsetY)
    if (zone === ZONE_RSI_SEP) {
      ctx.isResizingRsi = true
      ctx.resizeStartY = e.offsetY
      ctx.resizeStartRatio = engine.get_rsi_ratio()
      canvas.style.cursor = 'ns-resize'
      return
    }

    if (zone === ZONE_OI_SEP) {
      ctx.isResizingOi = true
      ctx.resizeStartY = e.offsetY
      ctx.resizeStartRatio = engine.get_oi_ratio()
      canvas.style.cursor = 'ns-resize'
      return
    }

    if (zone === ZONE_FR_SEP) {
      ctx.isResizingFr = true
      ctx.resizeStartY = e.offsetY
      ctx.resizeStartRatio = engine.get_fr_ratio()
      canvas.style.cursor = 'ns-resize'
      return
    }

    if (zone === ZONE_CVD_SEP) {
      ctx.isResizingCvd = true
      ctx.resizeStartY = e.offsetY
      ctx.resizeStartRatio = engine.get_cvd_ratio()
      canvas.style.cursor = 'ns-resize'
      return
    }

    if (zone === ZONE_VPIN_SEP) {
      ctx.isResizingVpin = true
      ctx.resizeStartY = e.offsetY
      ctx.resizeStartRatio = engine.get_vpin_ratio()
      canvas.style.cursor = 'ns-resize'
      return
    }

    if (zone === ZONE_OB_FLOW_SEP) {
      ctx.isResizingObFlow = true
      ctx.resizeStartY = e.offsetY
      ctx.resizeStartRatio = engine.get_obf_ratio()
      canvas.style.cursor = 'ns-resize'
      return
    }

    if (zone === ZONE_AGG_LIQ_SEP) {
      ctx.isResizingAggLiq = true
      ctx.resizeStartY = e.offsetY
      ctx.resizeStartRatio = engine.get_agg_liq_ratio()
      canvas.style.cursor = 'ns-resize'
      return
    }

    if (isDrawableZone(zone)) {
      const selDraw = engine.get_selected_drawing()
      if (selDraw > 0) {
        const anchorIdx = engine.hit_test_drawing_anchor(e.offsetX, e.offsetY)
        if (anchorIdx >= 0) {
          ctx.isDraggingAnchor = true
          ctx.dragAnchorIdx = anchorIdx
          ctx.dragAnchorPane = paneFromZone(zone)
          canvas.style.cursor = 'grabbing'
          return
        }
        const hitBody = engine.hit_test_drawing(e.offsetX, e.offsetY)
        if (hitBody === selDraw) {
          ctx.isDraggingDrawing = true
          ctx.dragDrawingPane = paneFromZone(zone)
          const { wx, wy } = screenToWorld(engine, e.offsetX, e.offsetY, ctx.dragDrawingPane)
          ctx.dragDrawingLastWx = wx
          ctx.dragDrawingLastWy = wy
          canvas.style.cursor = 'move'
          return
        }
      }

      const hitId = engine.hit_test_drawing(e.offsetX, e.offsetY)
      if (hitId > 0) {
        engine.deselect_marker()
        callbacks.onMarkerSelected?.(0)
        engine.select_drawing(hitId)
        callbacks.onDrawingSelected?.(hitId)
        callbacks.onDirty()
        return
      }

      const markerId = engine.hit_test_marker(e.offsetX, e.offsetY)
      if (markerId > 0) {
        engine.deselect_drawing()
        callbacks.onDrawingSelected?.(0)
        engine.select_marker(markerId)
        callbacks.onMarkerSelected?.(markerId)
        callbacks.onDirty()
        return
      }

      const prevDraw = engine.get_selected_drawing()
      const prevMark = engine.get_selected_marker()
      if (prevDraw > 0) { engine.deselect_drawing(); callbacks.onDrawingSelected?.(0); callbacks.onDirty() }
      if (prevMark > 0) { engine.deselect_marker(); callbacks.onMarkerSelected?.(0); callbacks.onDirty() }
    }

    // Long-press detection for liq annotation pinning
    if (isDrawableZone(zone)) {
      ctx.liqPinSx = e.offsetX
      ctx.liqPinSy = e.offsetY
      if (ctx.liqPinTimer) clearTimeout(ctx.liqPinTimer)
      ctx.liqPinTimer = setTimeout(() => {
        ctx.liqPinTimer = null
        callbacks.onLiqAnnotationPin?.(ctx.liqPinSx, ctx.liqPinSy)
      }, LIQ_PIN_MS)
    }

    ctx.isDragging = true
    ctx.dragZone = zone
    ctx.lastX = e.offsetX
    ctx.lastY = e.offsetY
    if (zone === ZONE_XAXIS) canvas.style.cursor = 'ew-resize'
    else if (zone === ZONE_YAXIS || isIndicatorYAxisZone(zone)) canvas.style.cursor = 'ns-resize'
    else canvas.style.cursor = 'grabbing'
  })

  // ── Mouse move (immediate crosshair, RAF-throttled cursor style) ──
  let _cursorRaf = null

  function _cancelCursorRaf() {
    if (_cursorRaf) { cancelAnimationFrame(_cursorRaf); _cursorRaf = null }
  }

  function _updateCursorStyle(sx, sy) {
    const hit = engine.hover_hit_test(sx, sy)
    const zone = hit[0], selDraw = hit[1], anchorHit = hit[2], drawingHit = hit[3], markerHit = hit[4]
    const dm = ctx.drawingMode

    if (zone === ZONE_XAXIS) {
      canvas.style.cursor = 'ew-resize'
    } else if (zone === ZONE_YAXIS || isIndicatorYAxisZone(zone)) {
      canvas.style.cursor = 'ns-resize'
    } else if (zone === ZONE_RSI_SEP || zone === ZONE_OI_SEP || zone === ZONE_FR_SEP || zone === ZONE_CVD_SEP || zone === ZONE_VPIN_SEP || zone === ZONE_OB_FLOW_SEP || zone === ZONE_AGG_LIQ_SEP) {
      canvas.style.cursor = 'ns-resize'
    } else if (!dm && isDrawableZone(zone) && selDraw > 0 && anchorHit >= 0) {
      canvas.style.cursor = 'grab'
    } else if (!dm && isDrawableZone(zone) && selDraw > 0 && drawingHit === selDraw) {
      canvas.style.cursor = 'move'
    } else if (!dm && isDrawableZone(zone) && (drawingHit > 0 || markerHit > 0)) {
      canvas.style.cursor = 'pointer'
    } else {
      canvas.style.cursor = 'crosshair'
    }
  }

  function _processIdleHover(sx, sy) {
    const zone = engine.hit_zone(sx, sy)

    if (zone === ZONE_XAXIS || zone === ZONE_YAXIS || isIndicatorYAxisZone(zone)) {
      engine.hide_crosshair()
    } else {
      engine.set_crosshair(sx, sy)
    }
    callbacks.onDirty()
    callbacks.onCrosshairMove?.(sx, sy, zone)
    callbacks.onVrvpHover?.(sx, sy)

    ctx._pendingHoverX = sx
    ctx._pendingHoverY = sy
    if (!_cursorRaf) {
      _cursorRaf = requestAnimationFrame(() => {
        _cursorRaf = null
        if (!ctx.disposed) {
          _updateCursorStyle(ctx._pendingHoverX, ctx._pendingHoverY)
        }
      })
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    if (ctx.disposed) return

    if (ctx.liqPinTimer) {
      const dx = Math.abs(e.offsetX - ctx.liqPinSx)
      const dy = Math.abs(e.offsetY - ctx.liqPinSy)
      if (dx > LIQ_PIN_MOVE_THRESHOLD || dy > LIQ_PIN_MOVE_THRESHOLD) {
        clearTimeout(ctx.liqPinTimer)
        ctx.liqPinTimer = null
      }
    }

    if (ctx.isResizingRsi) {
      const rect = canvas.getBoundingClientRect()
      const totalH = rect.height - 28
      const dy = ctx.resizeStartY - e.offsetY
      const deltaRatio = dy / totalH
      const newRatio = Math.max(0.05, Math.min(0.50, ctx.resizeStartRatio + deltaRatio))
      engine.set_rsi_ratio(newRatio)
      callbacks.onDirty()
      return
    }

    if (ctx.isResizingOi) {
      const rect = canvas.getBoundingClientRect()
      const totalH = rect.height - 28
      const dy = ctx.resizeStartY - e.offsetY
      const deltaRatio = dy / totalH
      const newRatio = Math.max(0.05, Math.min(0.50, ctx.resizeStartRatio + deltaRatio))
      engine.set_oi_ratio(newRatio)
      callbacks.onDirty()
      return
    }

    if (ctx.isResizingFr) {
      const rect = canvas.getBoundingClientRect()
      const totalH = rect.height - 28
      const dy = ctx.resizeStartY - e.offsetY
      const deltaRatio = dy / totalH
      const newRatio = Math.max(0.05, Math.min(0.50, ctx.resizeStartRatio + deltaRatio))
      engine.set_fr_ratio(newRatio)
      callbacks.onDirty()
      return
    }

    if (ctx.isResizingCvd) {
      const rect = canvas.getBoundingClientRect()
      const totalH = rect.height - 28
      const dy = ctx.resizeStartY - e.offsetY
      const deltaRatio = dy / totalH
      const newRatio = Math.max(0.05, Math.min(0.50, ctx.resizeStartRatio + deltaRatio))
      engine.set_cvd_ratio(newRatio)
      callbacks.onDirty()
      return
    }

    if (ctx.isResizingVpin) {
      const rect = canvas.getBoundingClientRect()
      const totalH = rect.height - 28
      const dy = ctx.resizeStartY - e.offsetY
      const deltaRatio = dy / totalH
      const newRatio = Math.max(0.05, Math.min(0.50, ctx.resizeStartRatio + deltaRatio))
      engine.set_vpin_ratio(newRatio)
      callbacks.onDirty()
      return
    }

    if (ctx.isResizingObFlow) {
      const rect = canvas.getBoundingClientRect()
      const totalH = rect.height - 28
      const dy = ctx.resizeStartY - e.offsetY
      const deltaRatio = dy / totalH
      const newRatio = Math.max(0.05, Math.min(0.50, ctx.resizeStartRatio + deltaRatio))
      engine.set_obf_ratio(newRatio)
      callbacks.onDirty()
      return
    }

    if (ctx.isResizingAggLiq) {
      const rect = canvas.getBoundingClientRect()
      const totalH = rect.height - 28
      const dy = ctx.resizeStartY - e.offsetY
      const deltaRatio = dy / totalH
      const newRatio = Math.max(0.05, Math.min(0.50, ctx.resizeStartRatio + deltaRatio))
      engine.set_agg_liq_ratio(newRatio)
      callbacks.onDirty()
      return
    }

    if (ctx.isDraggingAnchor) {
      const { wx, wy } = screenToWorld(engine, e.offsetX, e.offsetY, ctx.dragAnchorPane)
      engine.update_drawing_anchor(ctx.dragAnchorIdx, wx, wy)
      engine.set_crosshair(e.offsetX, e.offsetY)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(e.offsetX, e.offsetY, engine.hit_zone(e.offsetX, e.offsetY))
      return
    }

    if (ctx.isDraggingDrawing) {
      const { wx, wy } = screenToWorld(engine, e.offsetX, e.offsetY, ctx.dragDrawingPane)
      const ddx = wx - ctx.dragDrawingLastWx
      const ddy = wy - ctx.dragDrawingLastWy
      engine.move_drawing(ddx, ddy)
      ctx.dragDrawingLastWx = wx
      ctx.dragDrawingLastWy = wy
      engine.set_crosshair(e.offsetX, e.offsetY)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(e.offsetX, e.offsetY, engine.hit_zone(e.offsetX, e.offsetY))
      return
    }

    const dm = ctx.drawingMode
    if (ctx.isBrushing && dm) {
      const p = dm.pane || PANE_MAIN
      addBrushPointsDensified(engine, e.offsetX, e.offsetY, ctx.brushLastSx, ctx.brushLastSy, p)
      ctx.brushLastSx = e.offsetX
      ctx.brushLastSy = e.offsetY
      engine.set_crosshair(e.offsetX, e.offsetY)
      callbacks.onDirty()
      return
    }

    if (dm && isElliottManual(dm.tool) && dm.pathStarted) {
      const p = dm.pane || PANE_MAIN
      const { wx, wy } = screenToWorld(engine, e.offsetX, e.offsetY, p)
      engine.set_elliott_manual_cursor(wx, wy)
      engine.set_crosshair(e.offsetX, e.offsetY)
      const zone = engine.hit_zone(e.offsetX, e.offsetY)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(e.offsetX, e.offsetY, zone)
      return
    }

    if (dm && isNPoint(dm.tool) && dm.pathStarted) {
      const p = dm.pane || PANE_MAIN
      const { wx, wy } = screenToWorld(engine, e.offsetX, e.offsetY, p)
      engine.set_path_cursor(wx, wy)
      engine.set_crosshair(e.offsetX, e.offsetY)
      const zone = engine.hit_zone(e.offsetX, e.offsetY)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(e.offsetX, e.offsetY, zone)
      return
    }

    if (dm && dm.step > 0) {
      const p = dm.pane || PANE_MAIN
      const { wx, wy } = screenToWorld(engine, e.offsetX, e.offsetY, p)
      showPreview(engine, dm.tool, dm, wx, wy, dm.style, p)
      engine.set_crosshair(e.offsetX, e.offsetY)
      const zone = engine.hit_zone(e.offsetX, e.offsetY)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(e.offsetX, e.offsetY, zone)
      return
    }

    if (dm && is1Point(dm.tool)) {
      const zone = engine.hit_zone(e.offsetX, e.offsetY)
      const p = paneFromZone(zone)
      const { wx, wy } = screenToWorld(engine, e.offsetX, e.offsetY, p)
      showPreview(engine, dm.tool, dm, wx, wy, dm.style, p)
      engine.set_crosshair(e.offsetX, e.offsetY)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(e.offsetX, e.offsetY, zone)
      return
    }

    if (ctx.isDragging) {
      const dx = e.offsetX - ctx.lastX
      const dy = e.offsetY - ctx.lastY
      ctx.lastX = e.offsetX
      ctx.lastY = e.offsetY

      if (ctx.dragZone === ZONE_XAXIS) { engine.pan_x(dx) }
      else if (ctx.dragZone === ZONE_YAXIS) { engine.pan_y(dy) }
      else if (ctx.dragZone === ZONE_RSI_YAXIS) {
        /* RSI Y-axis: zoom locked — no drag zoom */
      } else if (isIndicatorYAxisZone(ctx.dragZone)) { engine.pan_indicator_y(indicatorPaneId(ctx.dragZone), dy) }
      else { panChartViewport(engine, ctx.dragZone, dx, dy) }
      engine.set_crosshair(e.offsetX, e.offsetY)
      callbacks.onDirty()
      callbacks.onCrosshairMove?.(e.offsetX, e.offsetY, ctx.dragZone)
      callbacks.onVrvpHover?.(e.offsetX, e.offsetY)
      return
    }

    // Idle hover: update crosshair immediately, RAF-throttle cursor style only
    _processIdleHover(e.offsetX, e.offsetY)
  })

  // ── Mouse up ──
  canvas.addEventListener('mouseup', () => {
    if (ctx.disposed) return
    if (ctx.liqPinTimer) { clearTimeout(ctx.liqPinTimer); ctx.liqPinTimer = null }
    if (ctx.isBrushing) {
      ctx.isBrushing = false
      ctx.brushLastSx = null
      ctx.brushLastSy = null
      engine.finish_brush()
      ctx.finishDrawing()
      callbacks.onDirty()
    }
    ctx.isDragging = false
    ctx.isResizingRsi = false
    ctx.isResizingOi = false
    ctx.isResizingFr = false
    ctx.isResizingCvd = false
    ctx.isResizingVpin = false
    ctx.isResizingObFlow = false
    ctx.isResizingAggLiq = false
    ctx.isDraggingAnchor = false
    ctx.isDraggingDrawing = false
    ctx.dragAnchorIdx = -1
    canvas.style.cursor = 'crosshair'
  })

  // ── Mouse/Pointer leave ──
  function _handleLeave() {
    if (ctx.disposed) return
    if (ctx._leaveHandled) return
    ctx._leaveHandled = true
    requestAnimationFrame(() => { ctx._leaveHandled = false })

    _cancelCursorRaf()
    if (ctx.liqPinTimer) { clearTimeout(ctx.liqPinTimer); ctx.liqPinTimer = null }
    if (ctx.isBrushing) {
      ctx.isBrushing = false
      ctx.brushLastSx = null
      ctx.brushLastSy = null
      engine.finish_brush()
      ctx.finishDrawing()
    }
    ctx.isDragging = false
    ctx.isResizingRsi = false
    ctx.isResizingOi = false
    ctx.isResizingFr = false
    ctx.isResizingCvd = false
    ctx.isResizingVpin = false
    ctx.isResizingObFlow = false
    ctx.isResizingAggLiq = false
    ctx.isDraggingAnchor = false
    ctx.isDraggingDrawing = false
    ctx.dragAnchorIdx = -1
    engine.hide_crosshair()
    canvas.style.cursor = 'crosshair'
    callbacks.onDirty()
    callbacks.onCrosshairHide?.()
    callbacks.onVrvpHover?.(null, null)
  }
  canvas.addEventListener('pointerleave', _handleLeave)
  canvas.addEventListener('mouseleave', _handleLeave)

  // ── Double click → finish path or edit drawing style ──
  canvas.addEventListener('dblclick', (e) => {
    if (ctx.disposed) return
    e.preventDefault()
    e.stopPropagation()
    const dm = ctx.drawingMode
    if (dm && isElliottManual(dm.tool) && dm.pathStarted) {
      engine.finish_elliott_manual()
      ctx.finishDrawing()
      callbacks.onDirty()
      return
    }
    if (dm && isNPoint(dm.tool) && dm.pathStarted) {
      engine.finish_path()
      ctx.finishDrawing()
      callbacks.onDirty()
      return
    }
    if (dm) return

    const zone = engine.hit_zone(e.offsetX, e.offsetY)

    // Drawing edit popup takes priority over Y-auto reset — works in main chart
    // AND in indicator sub-panes (RSI/OI/FR/CVD/VPIN/AggLiq) where drawings live too.
    const hitId = engine.hit_test_drawing(e.offsetX, e.offsetY)
    if (hitId > 0) {
      engine.select_drawing(hitId)
      callbacks.onDirty()
      callbacks.onDrawingDblClick?.(hitId, e.offsetX, e.offsetY, e.clientX, e.clientY)
      return
    }

    if (isIndicatorSubPaneZone(zone) || isIndicatorYAxisZone(zone)) {
      engine.reset_indicator_y_auto(indicatorPaneId(zone))
      callbacks.onDirty()
      return
    }

    // Empty area on the main chart pane (no drawing, no sub-pane).
    // Forward to host so it can implement features like Focus Mode
    // (TradingView-style: hide indicator sub-panes on dblclick).
    // Restrict to the main candle area + its volume overlay; firing on
    // X/Y-axis would feel unexpected since axes have their own gestures.
    if (zone === ZONE_MAIN || zone === ZONE_VOLUME) {
      callbacks.onChartDblClick?.(e.offsetX, e.offsetY, e.clientX, e.clientY)
    }
  })

  // ── Right click → finish path ──
  canvas.addEventListener('contextmenu', (e) => {
    if (ctx.disposed) return
    const dm = ctx.drawingMode
    if (dm && isElliottManual(dm.tool) && dm.pathStarted) {
      e.preventDefault()
      e.stopPropagation()
      engine.finish_elliott_manual()
      ctx.finishDrawing()
      callbacks.onDirty()
      return
    }
    if (dm && isNPoint(dm.tool) && dm.pathStarted) {
      e.preventDefault()
      e.stopPropagation()
      engine.finish_path()
      ctx.finishDrawing()
      callbacks.onDirty()
      return
    }
  })
}
