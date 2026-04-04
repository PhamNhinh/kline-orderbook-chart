/**
 * Shared constants, tool registry, and pure helper functions
 * used by both mouse and touch event handlers.
 */

export const ZONE_MAIN = 0
export const ZONE_VOLUME = 1
export const ZONE_XAXIS = 2
export const ZONE_YAXIS = 3
export const ZONE_RSI = 4
export const ZONE_RSI_SEP = 5
export const ZONE_OI = 6
export const ZONE_OI_SEP = 7
export const ZONE_FR = 8
export const ZONE_FR_SEP = 9
export const ZONE_CVD = 10
export const ZONE_CVD_SEP = 11
export const ZONE_VPIN = 12
export const ZONE_VPIN_SEP = 13
export const ZONE_RSI_YAXIS = 14
export const ZONE_OI_YAXIS = 15
export const ZONE_FR_YAXIS = 16
export const ZONE_CVD_YAXIS = 17
export const ZONE_VPIN_YAXIS = 18

export const PANE_MAIN = 0
export const PANE_RSI = 1
export const PANE_OI = 2
export const PANE_FR = 3
export const PANE_CVD = 4
export const PANE_VPIN = 5

export const TAP_THRESHOLD = 10
export const LONG_PRESS_MS = 300
export const LIQ_PIN_MS = 700
export const LIQ_PIN_MOVE_THRESHOLD = 6
export const DOUBLE_TAP_MS = 350
export const DOUBLE_TAP_DIST = 30

// ── Tool Registry ──
// type: '2point' = click p1, click/drag p2
//       '1point' = single click to place
// previewKind: the u8 kind id passed to engine.set_drawing_preview()
// addFn: the WASM engine method name for creating the drawing
export const TOOL_REGISTRY = {
  trendline: { type: '2point', previewKind: 0, addFn: 'add_trendline' },
  arrow:     { type: '2point', previewKind: 4, addFn: 'add_arrow' },
  measure:   { type: '2point', previewKind: 2, addFn: 'add_price_range' },
  fib:       { type: '2point', previewKind: 3, addFn: 'add_fib_retracement' },
  long:      { type: '2point', previewKind: 5, addFn: 'add_long_position' },
  short:     { type: '2point', previewKind: 5, addFn: 'add_short_position' },
  hline:     { type: '1point_xp', previewKind: 1, addFn: 'add_horizontal_line' },
  vwap:      { type: '1point_x', previewKind: 6, addFn: 'add_anchored_vwap' },
  pricelabel:{ type: '1point_xy', previewKind: 7, addFn: 'add_price_label' },
  circle:    { type: '2point', previewKind: 8, addFn: 'add_circle' },
  arrowup:   { type: '1point_xy', previewKind: 9, addFn: 'add_arrow_marker_up' },
  arrowdown: { type: '1point_xy', previewKind: 10, addFn: 'add_arrow_marker_down' },
  textnote:  { type: '1point_xy', previewKind: 11, addFn: 'add_text_note' },
  channel:   { type: '3point', previewKind: 0, addFn: 'add_parallel_channel' },
  fibext:    { type: '3point', previewKind: 0, addFn: 'add_fib_extension', previewFn: 'fib_ext' },
  brush:     { type: 'freehand' },
  path:      { type: 'npoint' },
  elliott:      { type: 'elliott_manual' },
  elliottauto:  { type: '1point_xy', previewKind: 12, addFn: 'add_elliott_impulse', previewFn: 'elliott' },
}

export function is2Point(tool) { return TOOL_REGISTRY[tool]?.type === '2point' }
export function is3Point(tool) { return TOOL_REGISTRY[tool]?.type === '3point' }
export function is1Point(tool) { const t = TOOL_REGISTRY[tool]?.type; return t === '1point' || t === '1point_x' || t === '1point_xy' || t === '1point_xp' }
export function isFreehand(tool) { return TOOL_REGISTRY[tool]?.type === 'freehand' }
export function isNPoint(tool) { return TOOL_REGISTRY[tool]?.type === 'npoint' }
export function isElliottManual(tool) { return TOOL_REGISTRY[tool]?.type === 'elliott_manual' }

const DEFAULT_STYLE = { r: 0.04, g: 0.49, b: 1.0, lineWidth: 2, dashed: false, fontSize: 12 }

export function addDrawing(engine, tool, dm, wx, wy, s) {
  s = s || DEFAULT_STYLE
  const reg = TOOL_REGISTRY[tool]
  if (!reg) return 0
  let id = 0
  if (reg.type === '3point') {
    id = engine[reg.addFn](dm.x1, dm.y1, dm.x2, dm.y2, wx, wy, s.r, s.g, s.b, s.lineWidth, s.dashed, dm.pane)
  } else if (reg.type === '2point') {
    id = engine[reg.addFn](dm.x1, dm.y1, wx, wy, s.r, s.g, s.b, s.lineWidth, s.dashed, dm.pane)
  } else if (reg.type === '1point_x') {
    id = engine[reg.addFn](wx, s.r, s.g, s.b, s.lineWidth, s.dashed, dm.pane)
  } else if (reg.type === '1point_xp') {
    id = engine[reg.addFn](wx, wy, s.r, s.g, s.b, s.lineWidth, s.dashed, dm.pane)
  } else if (reg.type === '1point_xy') {
    id = engine[reg.addFn](wx, wy, s.r, s.g, s.b, s.fontSize || 12, dm.pane)
  } else {
    id = engine[reg.addFn](wy, s.r, s.g, s.b, s.lineWidth, s.dashed, dm.pane)
  }
  return id || 0
}

export function showPreview(engine, tool, dm, wx, wy, s, pane) {
  s = s || DEFAULT_STYLE
  const reg = TOOL_REGISTRY[tool]
  if (!reg) return
  if (reg.previewFn === 'elliott') {
    engine.set_elliott_preview(wx, wy, s.r, s.g, s.b, s.lineWidth, pane)
    return
  }
  if (reg.type === '3point') {
    if (dm.step === 1) {
      engine.set_drawing_preview(reg.previewKind, dm.x1, dm.y1, wx, wy, s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
    } else if (dm.step === 2) {
      if (reg.previewFn === 'fib_ext') {
        engine.set_fib_ext_preview(dm.x1, dm.y1, dm.x2, dm.y2, wx, wy, s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
      } else {
        engine.set_channel_preview(dm.x1, dm.y1, dm.x2, dm.y2, wx, wy, s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
      }
    }
  } else if (reg.type === '2point') {
    engine.set_drawing_preview(reg.previewKind, dm.x1, dm.y1, wx, wy, s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
  } else if (reg.type === '1point_x') {
    engine.set_drawing_preview(reg.previewKind, wx, 0, 0, 0, s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
  } else if (reg.type === '1point_xp') {
    engine.set_drawing_preview(reg.previewKind, wx, wy, 0, 0, s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
  } else if (reg.type === '1point_xy') {
    engine.set_drawing_preview(reg.previewKind, wx, wy, 0, 0, s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
  } else {
    engine.set_drawing_preview(reg.previewKind, 0, wy, 0, 0, s.r, s.g, s.b, s.lineWidth, s.dashed, pane)
  }
}

export function screenToWorld(engine, sx, sy, pane) {
  const wx = engine.screen_to_world_x(sx)
  let wy
  switch (pane) {
    case PANE_RSI:  wy = engine.screen_to_rsi_y(sy); break
    case PANE_OI:   wy = engine.screen_to_oi_y(sy); break
    case PANE_FR:   wy = engine.screen_to_fr_y(sy); break
    case PANE_CVD:  wy = engine.screen_to_cvd_y(sy); break
    case PANE_VPIN: wy = engine.screen_to_vpin_y(sy); break
    default:        wy = engine.screen_to_world_y(sy); break
  }
  return { wx, wy }
}

export function paneFromZone(zone) {
  if (zone === ZONE_RSI) return PANE_RSI
  if (zone === ZONE_OI) return PANE_OI
  if (zone === ZONE_FR) return PANE_FR
  if (zone === ZONE_CVD) return PANE_CVD
  if (zone === ZONE_VPIN) return PANE_VPIN
  return PANE_MAIN
}

/** RSI/OI/FR/CVD/VPIN share time (X) with the main chart but use a fixed Y range; vertical drag there must not rescale price. */
export function isIndicatorSubPaneZone(zone) {
  return zone === ZONE_RSI || zone === ZONE_OI || zone === ZONE_FR
      || zone === ZONE_CVD || zone === ZONE_VPIN
}

/** Indicator Y-axis zones (right-side axis of each indicator pane). */
export function isIndicatorYAxisZone(zone) {
  return zone === ZONE_RSI_YAXIS || zone === ZONE_OI_YAXIS || zone === ZONE_FR_YAXIS
      || zone === ZONE_CVD_YAXIS || zone === ZONE_VPIN_YAXIS
}

/** Map zone constant to indicator pane id (1=RSI,2=OI,3=FR,4=CVD,5=VPIN). Works for both body and Y-axis zones. */
export function indicatorPaneId(zone) {
  if (zone === ZONE_RSI  || zone === ZONE_RSI_YAXIS)  return 1
  if (zone === ZONE_OI   || zone === ZONE_OI_YAXIS)   return 2
  if (zone === ZONE_FR   || zone === ZONE_FR_YAXIS)   return 3
  if (zone === ZONE_CVD  || zone === ZONE_CVD_YAXIS)  return 4
  if (zone === ZONE_VPIN || zone === ZONE_VPIN_YAXIS)  return 5
  return 0
}

/** Main chart: pan X+Y (price scroll). Indicator panes: pan X on main chart + pan Y on sub-pane. */
export function panChartViewport(engine, zone, dx, dy) {
  if (isIndicatorSubPaneZone(zone)) {
    engine.pan(dx, 0)
    if (Math.abs(dy) > 0.01) engine.pan_indicator_y(indicatorPaneId(zone), dy)
  } else {
    engine.pan(dx, dy)
  }
}

export function isDrawableZone(zone) {
  return zone === ZONE_MAIN || zone === ZONE_RSI || zone === ZONE_OI
      || zone === ZONE_FR || zone === ZONE_CVD || zone === ZONE_VPIN
}
