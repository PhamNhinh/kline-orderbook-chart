/**
 * Bridge methods for drawing tools, markers, and coordinate conversion.
 * Extracted from bridge.js for maintainability.
 *
 * Basic drawing tools (all plans): Trendline, HLine, Arrow, PriceLabel, Markers
 * Full drawing tools (Professional+): Fib, Positions, Anchored VWAP, Elliott
 */
export function createDrawingMethods(engine, markDirty, isDestroyed, getGate) {
  const gate = (k) => getGate()(k)

  // Auto-detect float colors (0.0-1.0) vs integer colors (0-255)
  const c = (r, g, b) => {
    if (r <= 1 && g <= 1 && b <= 1 && (r > 0 || g > 0 || b > 0)) {
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
    }
    return [r & 0xFF, g & 0xFF, b & 0xFF]
  }

  return {
    // ── Markers ──

    addMarker(timestamp, price, isBid) {
      engine.add_marker(timestamp, price, isBid)
      markDirty()
    },

    clearMarkers() {
      engine.clear_markers()
      markDirty()
    },

    hitTestMarker(sx, sy) {
      return engine.hit_test_marker(sx, sy)
    },

    selectMarker(id) {
      engine.select_marker(id)
      markDirty()
    },

    deselectMarker() {
      engine.deselect_marker()
      markDirty()
    },

    getSelectedMarker() {
      return engine.get_selected_marker()
    },

    removeMarker(id) {
      engine.remove_marker(id)
      markDirty()
    },

    deleteSelectedMarker() {
      const sel = engine.get_selected_marker()
      if (sel > 0) {
        engine.remove_marker(sel)
        markDirty()
      }
      return sel
    },

    // ── Drawing creation ──

    addTrendline(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane = 0) {
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_trendline(x1, y1, x2, y2, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
      return id
    },

    addHorizontalLine(x, price, r, g, b, lineWidth, dashed, pane = 0) {
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_horizontal_line(x, price, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
      return id
    },

    addArrow(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane = 0) {
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_arrow(x1, y1, x2, y2, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
      return id
    },

    addFibRetracement(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane = 0) {
      if (!gate('drawingFull')) return 0
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_fib_retracement(x1, y1, x2, y2, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
      return id
    },

    addFibExtension(x1, y1, x2, y2, x3, y3, r, g, b, lineWidth, dashed, pane = 0) {
      if (!gate('drawingFull')) return 0
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_fib_extension(x1, y1, x2, y2, x3, y3, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
      return id
    },

    addLongPosition(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane = 0) {
      if (!gate('drawingFull')) return 0
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_long_position(x1, y1, x2, y2, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
      return id
    },

    addShortPosition(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane = 0) {
      if (!gate('drawingFull')) return 0
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_short_position(x1, y1, x2, y2, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
      return id
    },

    addAnchoredVwap(anchorX, r, g, b, lineWidth, dashed, pane = 0) {
      if (!gate('drawingFull')) return 0
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_anchored_vwap(anchorX, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
      return id
    },

    addPriceLabel(x, y, r, g, b, fontSize, pane = 0) {
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_price_label(x, y, cr, cg, cb, fontSize, pane)
      markDirty()
      return id
    },

    addTextNote(x, y, r, g, b, fontSize, pane = 0) {
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_text_note(x, y, cr, cg, cb, fontSize, pane)
      markDirty()
      return id
    },

    addElliottImpulse(x, y, r, g, b, fontSize, pane = 0) {
      if (!gate('drawingFull')) return 0
      const [cr, cg, cb] = c(r, g, b)
      const id = engine.add_elliott_impulse(x, y, cr, cg, cb, fontSize, pane)
      markDirty()
      return id
    },

    // ── Drawing properties ──

    setDrawingFontSize(id, fontSize) {
      engine.set_drawing_font_size(id, fontSize)
      markDirty()
    },

    getDrawingFontSize(id) {
      return engine.get_drawing_font_size(id)
    },

    setDrawingText(id, text) {
      engine.set_drawing_text(id, text)
      markDirty()
    },

    getDrawingText(id) {
      return engine.get_drawing_text(id)
    },

    setDrawingStyle(id, r, g, b, lineWidth) {
      const [cr, cg, cb] = c(r, g, b)
      engine.set_drawing_style(id, cr, cg, cb, lineWidth)
      markDirty()
    },

    getDrawingColor(id) {
      const packed = engine.get_drawing_color(id)
      if (!packed) return null
      return {
        r: (packed >>> 24) & 0xFF,
        g: (packed >>> 16) & 0xFF,
        b: (packed >>> 8) & 0xFF,
        lineWidth: (packed & 0xFF) / 10,
      }
    },

    getDrawingDashed(id) {
      try { return engine.get_drawing_dashed(id) } catch { return false }
    },

    setDrawingDashed(id, dashed) {
      engine.set_drawing_dashed(id, dashed)
      markDirty()
    },

    getDrawingHideLabel(id) {
      try { return engine.get_drawing_hide_label(id) } catch { return false }
    },

    setDrawingHideLabel(id, hide) {
      engine.set_drawing_hide_label(id, hide)
      markDirty()
    },

    getDrawingFlipLeft(id) {
      try { return engine.get_drawing_flip_left(id) } catch { return false }
    },

    setDrawingFlipLeft(id, flip) {
      try { engine.set_drawing_flip_left(id, flip); markDirty() } catch {}
    },

    getDrawingTextWrap(id) {
      try { return engine.get_drawing_text_wrap(id) } catch { return false }
    },

    setDrawingTextWrap(id, wrap) {
      try { engine.set_drawing_text_wrap(id, wrap); markDirty() } catch {}
    },

    getDrawingKindId(id) {
      try { return engine.get_drawing_kind_id(id) } catch { return 255 }
    },

    // ── Drawing management ──

    removeDrawing(id) {
      engine.remove_drawing(id)
      markDirty()
    },

    clearDrawings() {
      engine.clear_drawings()
      markDirty()
    },

    drawingCount() {
      return engine.drawing_count()
    },

    setDrawingPreview(kind, x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane = 0) {
      const [cr, cg, cb] = c(r, g, b)
      engine.set_drawing_preview(kind, x1, y1, x2, y2, cr, cg, cb, lineWidth, dashed, pane)
      markDirty()
    },

    clearDrawingPreview() {
      engine.clear_drawing_preview()
      markDirty()
    },

    cancelBrush() {
      engine.cancel_brush()
      markDirty()
    },

    selectDrawing(id) {
      engine.select_drawing(id)
      markDirty()
    },

    deselectDrawing() {
      engine.deselect_drawing()
      markDirty()
    },

    getSelectedDrawing() {
      return engine.get_selected_drawing()
    },

    deleteSelectedDrawing() {
      const sel = engine.get_selected_drawing()
      if (sel > 0) {
        engine.remove_drawing(sel)
        markDirty()
      }
      return sel
    },

    // ── Drawing serialization ──

    exportDrawingsJson() {
      try { return engine.export_drawings_json() } catch { return '[]' }
    },

    importDrawingsJson(json) {
      try { engine.import_drawings_json(json); markDirty() } catch (e) { console.warn('[bridge] importDrawingsJson failed', e) }
    },

    // ── Coordinate conversion ──

    screenToWorld(sx, sy) {
      return {
        x: engine.screen_to_world_x(sx),
        y: engine.screen_to_world_y(sy),
      }
    },

    worldToScreen(wx, wy) {
      try {
        return { x: engine.world_to_screen_x(wx), y: engine.world_to_screen_y(wy) }
      } catch {
        return null
      }
    },
  }
}
