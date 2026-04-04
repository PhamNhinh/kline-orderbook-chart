/**
 * Custom Indicator Plugin System (WASM-backed)
 *
 * Indicators render through the WASM command buffer pipeline, not Canvas2D
 * overlay. This ensures pixel-perfect alignment with native indicators and
 * consistent rendering performance.
 *
 * Usage:
 *   const id = bridge.addIndicator({
 *     name: 'My SMA',
 *     params: { period: 20, color: '#e8a04a', lineWidth: 1.5 },
 *     compute(ohlcv, params) {
 *       const sma = []
 *       const { close } = ohlcv
 *       for (let i = 0; i < close.length; i++) {
 *         if (i < params.period - 1) { sma.push(NaN); continue }
 *         let sum = 0
 *         for (let j = i - params.period + 1; j <= i; j++) sum += close[j]
 *         sma.push(sum / params.period)
 *       }
 *       return { sma }
 *     },
 *     render(draw, computed) {
 *       draw.seriesLine(computed.sma, this.params.color, this.params.lineWidth)
 *     },
 *   })
 *
 *   bridge.updateIndicatorParams(id, { period: 50 })
 *   bridge.removeIndicator(id)
 */

let nextId = 1

function parseColor(color) {
  if (typeof color !== 'string') return { r: 255, g: 255, b: 255, a: 153 }

  if (color.startsWith('#')) {
    const hex = color.slice(1)
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16),
      }
    }
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return { r, g, b, a: 255 }
  }

  const rgba = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)/)
  if (rgba) {
    return {
      r: +rgba[1], g: +rgba[2], b: +rgba[3],
      a: rgba[4] !== undefined ? Math.round(+rgba[4] * 255) : 255,
    }
  }
  return { r: 255, g: 255, b: 255, a: 153 }
}

export function createCustomIndicatorManager(engine, wasmMemory, dispatchFn) {
  const indicators = new Map()
  let cachedOhlcv = null
  let cachedLen = 0
  let cachedLastClose = NaN

  function getOhlcv() {
    let len
    try { len = engine.kline_count() } catch { return cachedOhlcv }
    if (len === 0) return null

    const closes = engine.kline_closes()
    const lastClose = closes?.[len - 1] ?? NaN

    const dataChanged = len !== cachedLen || lastClose !== cachedLastClose
    if (cachedOhlcv && !dataChanged) return cachedOhlcv

    try {
      const timestamps = engine.kline_timestamps()
      const open = engine.kline_opens()
      const high = engine.kline_highs()
      const low = engine.kline_lows()
      const volume = engine.kline_volumes()

      if (!timestamps || !closes) return cachedOhlcv

      cachedOhlcv = {
        timestamps: Array.from(timestamps),
        open: Array.from(open),
        high: Array.from(high),
        low: Array.from(low),
        close: Array.from(closes),
        volume: Array.from(volume),
        length: len,
      }
      cachedLen = len
      cachedLastClose = lastClose

      for (const ind of indicators.values()) {
        ind._needsCompute = true
      }
    } catch {
      // engine freed or unavailable
    }
    return cachedOhlcv
  }

  /**
   * Creates a WASM-backed drawing context for custom indicators.
   * All draw calls go through the WASM custom command buffer.
   */
  function createDrawAPI() {
    return {
      /**
       * Draw a data series as a smooth polyline.
       * Values align to kline timestamps. NaN = gap.
       * @param {number[]} series
       * @param {string} color - '#rrggbb', '#rrggbbaa', 'rgba(r,g,b,a)'
       * @param {number} [lineWidth=1.5]
       */
      seriesLine(series, color = '#ffffff99', lineWidth = 1.5) {
        const c = parseColor(color)
        engine.custom_series_line(new Float64Array(series), c.r, c.g, c.b, c.a, lineWidth)
      },

      /**
       * Draw a dashed data series line.
       * @param {number[]} series
       * @param {string} color
       * @param {number} [lineWidth=1]
       * @param {number} [dash=4]
       * @param {number} [gap=4]
       */
      seriesDashedLine(series, color = '#ffffff66', lineWidth = 1, dash = 4, gap = 4) {
        const c = parseColor(color)
        engine.custom_series_dashed_line(new Float64Array(series), c.r, c.g, c.b, c.a, lineWidth, dash, gap)
      },

      /**
       * Draw a filled band between two series (e.g. Bollinger Bands).
       * @param {number[]} upper
       * @param {number[]} lower
       * @param {string} fillColor
       */
      band(upper, lower, fillColor = 'rgba(100,149,237,0.08)') {
        const c = parseColor(fillColor)
        engine.custom_band(new Float64Array(upper), new Float64Array(lower), c.r, c.g, c.b, c.a)
      },

      /**
       * Draw a horizontal line at a price level.
       * @param {number} price
       * @param {string} color
       * @param {number} [lineWidth=1]
       */
      hline(price, color = '#ffffff66', lineWidth = 1) {
        const c = parseColor(color)
        engine.custom_hline(price, c.r, c.g, c.b, c.a, lineWidth)
      },

      /**
       * Draw a dashed horizontal line at a price level.
       * @param {number} price
       * @param {string} color
       * @param {number} [lineWidth=1]
       * @param {number} [dash=6]
       * @param {number} [gap=4]
       */
      dashedHline(price, color = '#ffffff66', lineWidth = 1, dash = 6, gap = 4) {
        const c = parseColor(color)
        engine.custom_dashed_hline(price, c.r, c.g, c.b, c.a, lineWidth, dash, gap)
      },

      /**
       * Draw a circle marker at a candle index.
       * @param {number} index - candle index
       * @param {number} price
       * @param {string} color
       * @param {number} [radius=3]
       */
      marker(index, price, color = '#e8a04a', radius = 3) {
        const c = parseColor(color)
        engine.custom_marker(index, price, c.r, c.g, c.b, c.a, radius)
      },

      /**
       * Draw an up-triangle marker (buy signal).
       * @param {number} index
       * @param {number} price
       * @param {string} color
       * @param {number} [size=5]
       */
      markerUp(index, price, color = '#26a69a', size = 5) {
        const c = parseColor(color)
        engine.custom_marker_up(index, price, c.r, c.g, c.b, c.a, size)
      },

      /**
       * Draw a down-triangle marker (sell signal).
       * @param {number} index
       * @param {number} price
       * @param {string} color
       * @param {number} [size=5]
       */
      markerDown(index, price, color = '#ef5350', size = 5) {
        const c = parseColor(color)
        engine.custom_marker_down(index, price, c.r, c.g, c.b, c.a, size)
      },

      /**
       * Draw text at a candle index and price.
       * @param {number} index
       * @param {number} price
       * @param {string} text
       * @param {string} color
       * @param {number} [fontSize=10]
       * @param {'left'|'center'|'right'} [align='center']
       */
      text(index, price, text, color = '#ffffffaa', fontSize = 10, align = 'center') {
        const c = parseColor(color)
        const a = align === 'center' ? 1 : align === 'right' ? 2 : 0
        engine.custom_text(index, price, text, c.r, c.g, c.b, c.a, fontSize, a)
      },

      /**
       * Draw a price label at the right edge of the chart.
       * @param {number} price
       * @param {string} text
       * @param {string} color
       * @param {number} [fontSize=10]
       */
      priceLabel(price, text, color = '#ffffffaa', fontSize = 10) {
        const c = parseColor(color)
        engine.custom_price_label(price, text, c.r, c.g, c.b, c.a, fontSize)
      },

      // ── Low-level screen-coordinate primitives ──

      /**
       * Draw a line in screen (pixel) coordinates.
       */
      linePx(x1, y1, x2, y2, color, lineWidth = 1) {
        const c = parseColor(color)
        engine.custom_line_px(x1, y1, x2, y2, c.r, c.g, c.b, c.a, lineWidth)
      },

      /**
       * Draw a filled rect in screen coordinates.
       */
      fillRectPx(x, y, w, h, color) {
        const c = parseColor(color)
        engine.custom_fill_rect_px(x, y, w, h, c.r, c.g, c.b, c.a)
      },

      /**
       * Draw a stroked rect in screen coordinates.
       */
      strokeRectPx(x, y, w, h, color, lineWidth = 1) {
        const c = parseColor(color)
        engine.custom_stroke_rect_px(x, y, w, h, c.r, c.g, c.b, c.a, lineWidth)
      },

      /**
       * Draw text in screen coordinates.
       */
      textPx(x, y, text, color, fontSize = 10, align = 'left') {
        const c = parseColor(color)
        const a = align === 'center' ? 1 : align === 'right' ? 2 : 0
        engine.custom_text_px(x, y, text, c.r, c.g, c.b, c.a, fontSize, a)
      },

      // ── Coordinate helpers ──

      worldToScreenX: (wx) => engine.world_to_screen_x(wx),
      worldToScreenY: (wy) => engine.world_to_screen_y(wy),
      screenToWorldX: (sx) => engine.screen_to_world_x(sx),
      screenToWorldY: (sy) => engine.screen_to_world_y(sy),

      chartArea: () => ({
        x: engine.chart_area_x(),
        y: engine.chart_area_y(),
        w: engine.chart_area_w(),
        h: engine.chart_area_h(),
      }),
    }
  }

  function recompute(ind) {
    if (!ind.compute) return
    const ohlcv = getOhlcv()
    if (!ohlcv) return
    try {
      ind._computed = ind.compute(ohlcv, ind.params) || {}
    } catch (e) {
      console.warn(`[CustomIndicator "${ind.name}"] compute error:`, e)
      ind._computed = {}
    }
  }

  /**
   * Called after main WASM render + dispatch. Runs all custom indicator
   * compute + render, writing to WASM custom_cmd_buf, then dispatches it.
   */
  function renderAll(ctx) {
    if (indicators.size === 0) return
    const ohlcv = getOhlcv()
    if (!ohlcv) return

    engine.custom_begin()

    const draw = createDrawAPI()

    for (const ind of indicators.values()) {
      if (!ind.enabled) continue
      if (ind._needsCompute) {
        recompute(ind)
        ind._needsCompute = false
      }
      try {
        ind.render.call(ind, draw, ind._computed || {}, ohlcv)
      } catch (e) {
        console.warn(`[CustomIndicator "${ind.name}"] render error:`, e)
      }
    }

    engine.custom_end()

    const cmdCount = engine.custom_command_count()
    if (cmdCount > 0) {
      const ptr = engine.get_custom_buffer_ptr()
      const len = engine.get_custom_buffer_len()
      dispatchFn(ctx, wasmMemory, ptr, len)
    }
  }

  function invalidateCompute() {
    cachedOhlcv = null
    cachedLen = 0
    cachedLastClose = NaN
    for (const ind of indicators.values()) {
      ind._needsCompute = true
    }
  }

  return {
    add(config) {
      const id = nextId++
      const ind = {
        id,
        name: config.name || `Custom ${id}`,
        params: { ...config.params },
        compute: config.compute || null,
        render: config.render,
        enabled: true,
        _computed: {},
        _needsCompute: true,
      }
      indicators.set(id, ind)
      return id
    },

    remove(id) {
      indicators.delete(id)
    },

    updateParams(id, newParams) {
      const ind = indicators.get(id)
      if (!ind) return
      Object.assign(ind.params, newParams)
      ind._needsCompute = true
    },

    setEnabled(id, enabled) {
      const ind = indicators.get(id)
      if (ind) ind.enabled = enabled
    },

    list() {
      return [...indicators.values()].map(i => ({
        id: i.id, name: i.name, params: { ...i.params }, enabled: i.enabled,
      }))
    },

    invalidateCompute,
    renderAll,
  }
}
