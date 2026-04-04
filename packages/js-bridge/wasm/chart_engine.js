/* @ts-self-types="./chart_engine.d.ts" */

export class ChartEngine {
    __destroy_into_raw() {
        const ptr = this.__mrd_ptr;
        this.__mrd_ptr = 0;
        ChartEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__mrd_chartengine_free(ptr, 0);
    }
    /**
     * @param {number} anchor_x
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} _dashed
     * @param {number} pane
     * @returns {number}
     */
    add_anchored_vwap(anchor_x, r, g, b, line_width, _dashed, pane) {
        const ret = wasm.chartengine_add_anchored_vwap(this.__mrd_ptr, anchor_x, r, g, b, line_width, _dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} dashed
     * @param {number} pane
     * @returns {number}
     */
    add_arrow(x1, y1, x2, y2, r, g, b, line_width, dashed, pane) {
        const ret = wasm.chartengine_add_arrow(this.__mrd_ptr, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} _font_size
     * @param {number} pane
     * @returns {number}
     */
    add_arrow_marker_down(x, y, r, g, b, _font_size, pane) {
        const ret = wasm.chartengine_add_arrow_marker_down(this.__mrd_ptr, x, y, r, g, b, _font_size, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} _font_size
     * @param {number} pane
     * @returns {number}
     */
    add_arrow_marker_up(x, y, r, g, b, _font_size, pane) {
        const ret = wasm.chartengine_add_arrow_marker_up(this.__mrd_ptr, x, y, r, g, b, _font_size, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} wx
     * @param {number} wy
     */
    add_brush_point(wx, wy) {
        wasm.chartengine_add_brush_point(this.__mrd_ptr, wx, wy);
    }
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {number} ex
     * @param {number} ey
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} _dashed
     * @param {number} pane
     * @returns {number}
     */
    add_circle(cx, cy, ex, ey, r, g, b, line_width, _dashed, pane) {
        const ret = wasm.chartengine_add_circle(this.__mrd_ptr, cx, cy, ex, ey, r, g, b, line_width, _dashed, pane);
        return ret >>> 0;
    }
    /**
     * Adds an Elliott Impulse Wave (1-2-3-4-5) drawing.
     * @param {number} click_x
     * @param {number} click_y
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} _font_size
     * @param {number} pane
     * @returns {number}
     */
    add_elliott_impulse(click_x, click_y, r, g, b, _font_size, pane) {
        const ret = wasm.chartengine_add_elliott_impulse(this.__mrd_ptr, click_x, click_y, r, g, b, _font_size, pane);
        return ret >>> 0;
    }
    /**
     * Add a point. Returns true when all 6 points collected (auto-finish).
     * @param {number} wx
     * @param {number} wy
     * @returns {boolean}
     */
    add_elliott_manual_point(wx, wy) {
        const ret = wasm.chartengine_add_elliott_manual_point(this.__mrd_ptr, wx, wy);
        return ret !== 0;
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} _dashed
     * @param {number} pane
     * @returns {number}
     */
    add_fib_extension(x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane) {
        const ret = wasm.chartengine_add_fib_extension(this.__mrd_ptr, x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} dashed
     * @param {number} pane
     * @returns {number}
     */
    add_fib_retracement(x1, y1, x2, y2, r, g, b, line_width, dashed, pane) {
        const ret = wasm.chartengine_add_fib_retracement(this.__mrd_ptr, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x
     * @param {number} price
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} dashed
     * @param {number} pane
     * @returns {number}
     */
    add_horizontal_line(x, price, r, g, b, line_width, dashed, pane) {
        const ret = wasm.chartengine_add_horizontal_line(this.__mrd_ptr, x, price, r, g, b, line_width, dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x1
     * @param {number} entry
     * @param {number} x2
     * @param {number} tp
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} _dashed
     * @param {number} pane
     * @returns {number}
     */
    add_long_position(x1, entry, x2, tp, r, g, b, line_width, _dashed, pane) {
        const ret = wasm.chartengine_add_long_position(this.__mrd_ptr, x1, entry, x2, tp, r, g, b, line_width, _dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} timestamp
     * @param {number} price
     * @param {boolean} is_bid
     */
    add_marker(timestamp, price, is_bid) {
        wasm.chartengine_add_marker(this.__mrd_ptr, timestamp, price, is_bid);
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} _dashed
     * @param {number} pane
     * @returns {number}
     */
    add_parallel_channel(x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane) {
        const ret = wasm.chartengine_add_parallel_channel(this.__mrd_ptr, x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} wx
     * @param {number} wy
     */
    add_path_point(wx, wy) {
        wasm.chartengine_add_path_point(this.__mrd_ptr, wx, wy);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} font_size
     * @param {number} pane
     * @returns {number}
     */
    add_price_label(x, y, r, g, b, font_size, pane) {
        const ret = wasm.chartengine_add_price_label(this.__mrd_ptr, x, y, r, g, b, font_size, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} dashed
     * @param {number} pane
     * @returns {number}
     */
    add_price_range(x1, y1, x2, y2, r, g, b, line_width, dashed, pane) {
        const ret = wasm.chartengine_add_price_range(this.__mrd_ptr, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x1
     * @param {number} entry
     * @param {number} x2
     * @param {number} tp
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} _dashed
     * @param {number} pane
     * @returns {number}
     */
    add_short_position(x1, entry, x2, tp, r, g, b, line_width, _dashed, pane) {
        const ret = wasm.chartengine_add_short_position(this.__mrd_ptr, x1, entry, x2, tp, r, g, b, line_width, _dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} font_size
     * @param {number} pane
     * @returns {number}
     */
    add_text_note(x, y, r, g, b, font_size, pane) {
        const ret = wasm.chartengine_add_text_note(this.__mrd_ptr, x, y, r, g, b, font_size, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} dashed
     * @param {number} pane
     * @returns {number}
     */
    add_trendline(x1, y1, x2, y2, r, g, b, line_width, dashed, pane) {
        const ret = wasm.chartengine_add_trendline(this.__mrd_ptr, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
        return ret >>> 0;
    }
    /**
     * Append a brand-new column (new candle) to the heatmap.
     * @param {Float64Array} values
     * @param {number} col_timestamp
     * @param {number} y_start
     * @param {number} y_step
     */
    append_heatmap_column(values, col_timestamp, y_start, y_step) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_append_heatmap_column(this.__mrd_ptr, ptr0, len0, col_timestamp, y_start, y_step);
    }
    /**
     * @param {number} ts
     * @param {number} o
     * @param {number} h
     * @param {number} l
     * @param {number} c
     * @param {number} v
     */
    append_kline(ts, o, h, l, c, v) {
        wasm.chartengine_append_kline(this.__mrd_ptr, ts, o, h, l, c, v);
    }
    /**
     * Append a single real timestamp (call after `append_kline` for Forex).
     * @param {number} real_ts
     */
    append_real_timestamp(real_ts) {
        wasm.chartengine_append_real_timestamp(this.__mrd_ptr, real_ts);
    }
    cancel_brush() {
        wasm.chartengine_cancel_brush(this.__mrd_ptr);
    }
    cancel_elliott_manual() {
        wasm.chartengine_cancel_elliott_manual(this.__mrd_ptr);
    }
    cancel_path() {
        wasm.chartengine_cancel_path(this.__mrd_ptr);
    }
    /**
     * @returns {number}
     */
    chart_area_h() {
        const ret = wasm.chartengine_chart_area_h(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    chart_area_w() {
        const ret = wasm.chartengine_chart_area_w(this.__mrd_ptr);
        return ret;
    }
    /**
     * Get chart area dimensions for custom clipping.
     * @returns {number}
     */
    chart_area_x() {
        const ret = wasm.chartengine_chart_area_x(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    chart_area_y() {
        const ret = wasm.chartengine_chart_area_y(this.__mrd_ptr);
        return ret;
    }
    clear_channel_preview() {
        wasm.chartengine_clear_channel_preview(this.__mrd_ptr);
    }
    clear_drawing_preview() {
        wasm.chartengine_clear_drawing_preview(this.__mrd_ptr);
    }
    clear_drawings() {
        wasm.chartengine_clear_drawings(this.__mrd_ptr);
    }
    clear_elliott_preview() {
        wasm.chartengine_clear_elliott_preview(this.__mrd_ptr);
    }
    clear_fib_ext_preview() {
        wasm.chartengine_clear_fib_ext_preview(this.__mrd_ptr);
    }
    clear_heatmap_prefetch_range() {
        wasm.chartengine_clear_heatmap_prefetch_range(this.__mrd_ptr);
    }
    clear_hover_price() {
        wasm.chartengine_clear_hover_price(this.__mrd_ptr);
    }
    clear_large_trades() {
        wasm.chartengine_clear_large_trades(this.__mrd_ptr);
    }
    clear_live_signals() {
        wasm.chartengine_clear_live_signals(this.__mrd_ptr);
    }
    clear_markers() {
        wasm.chartengine_clear_markers(this.__mrd_ptr);
    }
    /**
     * Draw a filled band between two series (e.g. Bollinger Bands).
     * Upper and lower are value arrays aligned to kline timestamps.
     * @param {Float64Array} upper
     * @param {Float64Array} lower
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     */
    custom_band(upper, lower, r, g, b, a) {
        const ptr0 = passArrayF64ToWasm0(upper, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(lower, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_band(this.__mrd_ptr, ptr0, len0, ptr1, len1, r, g, b, a);
    }
    custom_begin() {
        wasm.chartengine_custom_begin(this.__mrd_ptr);
    }
    /**
     * Draw a circle in screen coordinates.
     * @param {number} cx
     * @param {number} cy
     * @param {number} radius
     * @param {number} fr
     * @param {number} fg
     * @param {number} fb
     * @param {number} fa
     * @param {number} sr
     * @param {number} sg
     * @param {number} sb
     * @param {number} sa
     * @param {number} line_width
     */
    custom_circle_px(cx, cy, radius, fr, fg, fb, fa, sr, sg, sb, sa, line_width) {
        wasm.chartengine_custom_circle_px(this.__mrd_ptr, cx, cy, radius, fr, fg, fb, fa, sr, sg, sb, sa, line_width);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    custom_clip_rect(x, y, w, h) {
        wasm.chartengine_custom_clip_rect(this.__mrd_ptr, x, y, w, h);
    }
    /**
     * @returns {number}
     */
    custom_command_count() {
        const ret = wasm.chartengine_custom_command_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * Draw a dashed horizontal line at a price level.
     * @param {number} price
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} line_width
     * @param {number} dash_len
     * @param {number} gap_len
     */
    custom_dashed_hline(price, r, g, b, a, line_width, dash_len, gap_len) {
        wasm.chartengine_custom_dashed_hline(this.__mrd_ptr, price, r, g, b, a, line_width, dash_len, gap_len);
    }
    custom_end() {
        wasm.chartengine_custom_end(this.__mrd_ptr);
    }
    /**
     * Draw a filled rect in screen coordinates.
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     */
    custom_fill_rect_px(x, y, w, h, r, g, b, a) {
        wasm.chartengine_custom_fill_rect_px(this.__mrd_ptr, x, y, w, h, r, g, b, a);
    }
    /**
     * Draw a horizontal line at a price level across the full chart width.
     * @param {number} price
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} line_width
     */
    custom_hline(price, r, g, b, a, line_width) {
        wasm.chartengine_custom_hline(this.__mrd_ptr, price, r, g, b, a, line_width);
    }
    /**
     * Draw a line in screen coordinates.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} line_width
     */
    custom_line_px(x1, y1, x2, y2, r, g, b, a, line_width) {
        wasm.chartengine_custom_line_px(this.__mrd_ptr, x1, y1, x2, y2, r, g, b, a, line_width);
    }
    /**
     * Draw a marker (circle) at a specific candle index and price.
     * @param {number} index
     * @param {number} price
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} radius
     */
    custom_marker(index, price, r, g, b, a, radius) {
        wasm.chartengine_custom_marker(this.__mrd_ptr, index, price, r, g, b, a, radius);
    }
    /**
     * Draw a down-triangle marker at a candle index.
     * @param {number} index
     * @param {number} price
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} size
     */
    custom_marker_down(index, price, r, g, b, a, size) {
        wasm.chartengine_custom_marker_down(this.__mrd_ptr, index, price, r, g, b, a, size);
    }
    /**
     * Draw an up-triangle marker at a candle index.
     * @param {number} index
     * @param {number} price
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} size
     */
    custom_marker_up(index, price, r, g, b, a, size) {
        wasm.chartengine_custom_marker_up(this.__mrd_ptr, index, price, r, g, b, a, size);
    }
    /**
     * Draw text at a world-coordinate price level (at the right edge).
     * @param {number} price
     * @param {string} text
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} font_size
     */
    custom_price_label(price, text, r, g, b, a, font_size) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_price_label(this.__mrd_ptr, price, ptr0, len0, r, g, b, a, font_size);
    }
    custom_restore() {
        wasm.chartengine_custom_restore(this.__mrd_ptr);
    }
    /**
     * Save/Restore canvas state in custom buffer (for clipping etc.)
     */
    custom_save() {
        wasm.chartengine_custom_save(this.__mrd_ptr);
    }
    /**
     * Draw a dashed data series line. Same as series_line but with dash pattern.
     * @param {Float64Array} values
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} line_width
     * @param {number} dash_len
     * @param {number} gap_len
     */
    custom_series_dashed_line(values, r, g, b, a, line_width, dash_len, gap_len) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_series_dashed_line(this.__mrd_ptr, ptr0, len0, r, g, b, a, line_width, dash_len, gap_len);
    }
    /**
     * Draw a data series as a polyline. `values` is aligned to kline timestamps.
     * NaN values create gaps. Converts world→screen automatically.
     * @param {Float64Array} values
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} line_width
     */
    custom_series_line(values, r, g, b, a, line_width) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_series_line(this.__mrd_ptr, ptr0, len0, r, g, b, a, line_width);
    }
    /**
     * Draw a stroked rect in screen coordinates.
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} line_width
     */
    custom_stroke_rect_px(x, y, w, h, r, g, b, a, line_width) {
        wasm.chartengine_custom_stroke_rect_px(this.__mrd_ptr, x, y, w, h, r, g, b, a, line_width);
    }
    /**
     * Draw text at a candle index and price.
     * @param {number} index
     * @param {number} price
     * @param {string} text
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} font_size
     * @param {number} align
     */
    custom_text(index, price, text, r, g, b, a, font_size, align) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_text(this.__mrd_ptr, index, price, ptr0, len0, r, g, b, a, font_size, align);
    }
    /**
     * Draw text in screen coordinates.
     * @param {number} x
     * @param {number} y
     * @param {string} text
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @param {number} font_size
     * @param {number} align
     */
    custom_text_px(x, y, text, r, g, b, a, font_size, align) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_text_px(this.__mrd_ptr, x, y, ptr0, len0, r, g, b, a, font_size, align);
    }
    /**
     * @returns {boolean}
     */
    delta_histogram_enabled() {
        const ret = wasm.chartengine_delta_histogram_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    deselect_drawing() {
        wasm.chartengine_deselect_drawing(this.__mrd_ptr);
    }
    deselect_marker() {
        wasm.chartengine_deselect_marker(this.__mrd_ptr);
    }
    disable_cvd() {
        wasm.chartengine_disable_cvd(this.__mrd_ptr);
    }
    disable_delta_histogram() {
        wasm.chartengine_disable_delta_histogram(this.__mrd_ptr);
    }
    disable_ema_structure() {
        wasm.chartengine_disable_ema_structure(this.__mrd_ptr);
    }
    disable_forex_signals() {
        wasm.chartengine_disable_forex_signals(this.__mrd_ptr);
    }
    disable_funding_rate() {
        wasm.chartengine_disable_funding_rate(this.__mrd_ptr);
    }
    disable_large_trades() {
        wasm.chartengine_disable_large_trades(this.__mrd_ptr);
    }
    disable_liq_heatmap() {
        wasm.chartengine_disable_liq_heatmap(this.__mrd_ptr);
    }
    disable_live_signals() {
        wasm.chartengine_disable_live_signals(this.__mrd_ptr);
    }
    disable_oi() {
        wasm.chartengine_disable_oi(this.__mrd_ptr);
    }
    disable_rsi() {
        wasm.chartengine_disable_rsi(this.__mrd_ptr);
    }
    disable_smart_ranges() {
        wasm.chartengine_disable_smart_ranges(this.__mrd_ptr);
    }
    disable_stop_iceberg() {
        wasm.chartengine_disable_stop_iceberg(this.__mrd_ptr);
    }
    disable_tpo() {
        wasm.chartengine_disable_tpo(this.__mrd_ptr);
    }
    disable_volume() {
        wasm.chartengine_disable_volume(this.__mrd_ptr);
    }
    disable_vpin() {
        wasm.chartengine_disable_vpin(this.__mrd_ptr);
    }
    disable_vrvp() {
        wasm.chartengine_disable_vrvp(this.__mrd_ptr);
    }
    /**
     * @returns {number}
     */
    drawing_count() {
        const ret = wasm.chartengine_drawing_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    enable_cvd() {
        wasm.chartengine_enable_cvd(this.__mrd_ptr);
    }
    enable_delta_histogram() {
        wasm.chartengine_enable_delta_histogram(this.__mrd_ptr);
    }
    enable_ema_structure() {
        wasm.chartengine_enable_ema_structure(this.__mrd_ptr);
    }
    enable_forex_signals() {
        wasm.chartengine_enable_forex_signals(this.__mrd_ptr);
    }
    enable_funding_rate() {
        wasm.chartengine_enable_funding_rate(this.__mrd_ptr);
    }
    enable_large_trades() {
        wasm.chartengine_enable_large_trades(this.__mrd_ptr);
    }
    enable_liq_heatmap() {
        wasm.chartengine_enable_liq_heatmap(this.__mrd_ptr);
    }
    enable_live_signals() {
        wasm.chartengine_enable_live_signals(this.__mrd_ptr);
    }
    enable_oi() {
        wasm.chartengine_enable_oi(this.__mrd_ptr);
    }
    enable_rsi() {
        wasm.chartengine_enable_rsi(this.__mrd_ptr);
    }
    enable_smart_ranges() {
        wasm.chartengine_enable_smart_ranges(this.__mrd_ptr);
    }
    enable_stop_iceberg() {
        wasm.chartengine_enable_stop_iceberg(this.__mrd_ptr);
    }
    enable_tpo() {
        wasm.chartengine_enable_tpo(this.__mrd_ptr);
    }
    enable_volume() {
        wasm.chartengine_enable_volume(this.__mrd_ptr);
    }
    enable_vpin() {
        wasm.chartengine_enable_vpin(this.__mrd_ptr);
    }
    enable_vrvp() {
        wasm.chartengine_enable_vrvp(this.__mrd_ptr);
    }
    /**
     * @returns {string}
     */
    export_drawings_json() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_export_drawings_json(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    finish_brush() {
        const ret = wasm.chartengine_finish_brush(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * Finish manual elliott. If < 6 points, predict remaining with Fibonacci.
     * @returns {number}
     */
    finish_elliott_manual() {
        const ret = wasm.chartengine_finish_elliott_manual(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    finish_path() {
        const ret = wasm.chartengine_finish_path(this.__mrd_ptr);
        return ret >>> 0;
    }
    fit_content() {
        wasm.chartengine_fit_content(this.__mrd_ptr);
    }
    /**
     * @param {number} bar_idx
     * @param {number} price
     * @param {number} volume
     * @param {boolean} is_buyer_maker
     */
    footprint_add_trade(bar_idx, price, volume, is_buyer_maker) {
        wasm.chartengine_footprint_add_trade(this.__mrd_ptr, bar_idx, price, volume, is_buyer_maker);
    }
    /**
     * @param {Float64Array} data
     */
    footprint_add_trade_batch(data) {
        const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_footprint_add_trade_batch(this.__mrd_ptr, ptr0, len0);
    }
    footprint_clear() {
        wasm.chartengine_footprint_clear(this.__mrd_ptr);
    }
    /**
     * @param {number} bar_idx
     */
    footprint_clear_bar(bar_idx) {
        wasm.chartengine_footprint_clear_bar(this.__mrd_ptr, bar_idx);
    }
    /**
     * @param {number} n
     */
    footprint_ensure_len(n) {
        wasm.chartengine_footprint_ensure_len(this.__mrd_ptr, n);
    }
    /**
     * @returns {number}
     */
    footprint_get_display_mode() {
        const ret = wasm.chartengine_footprint_get_display_mode(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    footprint_get_show_profile() {
        const ret = wasm.chartengine_footprint_get_show_profile(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    footprint_get_show_signals() {
        const ret = wasm.chartengine_footprint_get_show_signals(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} count
     */
    footprint_prepend_empty(count) {
        wasm.chartengine_footprint_prepend_empty(this.__mrd_ptr, count);
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    footprint_profile_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_footprint_profile_hit_test(retptr, this.__mrd_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} bar_idx
     * @param {number} tick_size
     * @param {Float64Array} prices
     * @param {Float64Array} bid_vols
     * @param {Float64Array} ask_vols
     */
    footprint_set_bar(bar_idx, tick_size, prices, bid_vols, ask_vols) {
        const ptr0 = passArrayF64ToWasm0(prices, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(bid_vols, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(ask_vols, wasm.__wbindgen_export);
        const len2 = WASM_VECTOR_LEN;
        wasm.chartengine_footprint_set_bar(this.__mrd_ptr, bar_idx, tick_size, ptr0, len0, ptr1, len1, ptr2, len2);
    }
    /**
     * 0 = BidAsk, 1 = Delta, 2 = Volume
     * @param {number} mode
     */
    footprint_set_display_mode(mode) {
        wasm.chartengine_footprint_set_display_mode(this.__mrd_ptr, mode);
    }
    /**
     * @param {boolean} show
     */
    footprint_set_show_profile(show) {
        wasm.chartengine_footprint_set_show_profile(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    footprint_set_show_signals(show) {
        wasm.chartengine_footprint_set_show_signals(this.__mrd_ptr, show);
    }
    /**
     * @returns {number}
     */
    footprint_signal_count() {
        const ret = wasm.chartengine_footprint_signal_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_chart_type() {
        const ret = wasm.chartengine_get_chart_type(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_command_buffer_len() {
        const ret = wasm.chartengine_get_command_buffer_len(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_command_buffer_ptr() {
        const ret = wasm.chartengine_get_command_buffer_ptr(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_custom_buffer_len() {
        const ret = wasm.chartengine_get_custom_buffer_len(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_custom_buffer_ptr() {
        const ret = wasm.chartengine_get_custom_buffer_ptr(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_cvd_mode() {
        const ret = wasm.chartengine_get_cvd_mode(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_cvd_ratio() {
        const ret = wasm.chartengine_get_cvd_ratio(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get_cvd_show_delta() {
        const ret = wasm.chartengine_get_cvd_show_delta(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get_cvd_show_divergence() {
        const ret = wasm.chartengine_get_cvd_show_divergence(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get_cvd_show_signals() {
        const ret = wasm.chartengine_get_cvd_show_signals(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get_cvd_source() {
        const ret = wasm.chartengine_get_cvd_source(this.__mrd_ptr);
        return ret;
    }
    /**
     * @param {number} id
     * @returns {number}
     */
    get_drawing_color(id) {
        const ret = wasm.chartengine_get_drawing_color(this.__mrd_ptr, id);
        return ret >>> 0;
    }
    /**
     * @param {number} id
     * @returns {boolean}
     */
    get_drawing_dashed(id) {
        const ret = wasm.chartengine_get_drawing_dashed(this.__mrd_ptr, id);
        return ret !== 0;
    }
    /**
     * @param {number} id
     * @returns {number}
     */
    get_drawing_font_size(id) {
        const ret = wasm.chartengine_get_drawing_font_size(this.__mrd_ptr, id);
        return ret;
    }
    /**
     * @param {number} id
     * @returns {boolean}
     */
    get_drawing_hide_label(id) {
        const ret = wasm.chartengine_get_drawing_hide_label(this.__mrd_ptr, id);
        return ret !== 0;
    }
    /**
     * Returns a u8 identifying the drawing kind: 0=Trendline, 1=Arrow, 2=HLine,
     * 3=PriceRange, 4=FibRetrace, 5=Position, 6=AnchoredVwap, 7=PriceLabel,
     * 8=Brush, 9=Circle, 10=ArrowUp, 11=ArrowDown, 12=TextNote, 13=Channel,
     * 14=FibExtension, 15=Path, 16=ElliottImpulse, 255=unknown
     * @param {number} id
     * @returns {number}
     */
    get_drawing_kind_id(id) {
        const ret = wasm.chartengine_get_drawing_kind_id(this.__mrd_ptr, id);
        return ret;
    }
    /**
     * @param {number} id
     * @returns {string}
     */
    get_drawing_text(id) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_get_drawing_text(retptr, this.__mrd_ptr, id);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get_forex_signals_count() {
        const ret = wasm.chartengine_get_forex_signals_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_fr_ratio() {
        const ret = wasm.chartengine_get_fr_ratio(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_data_max() {
        const ret = wasm.chartengine_get_heatmap_data_max(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_data_min() {
        const ret = wasm.chartengine_get_heatmap_data_min(this.__mrd_ptr);
        return ret;
    }
    /**
     * Return the timestamp of the last heatmap column.
     * @returns {number}
     */
    get_heatmap_last_timestamp() {
        const ret = wasm.chartengine_get_heatmap_last_timestamp(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_prefetch_max() {
        const ret = wasm.chartengine_get_heatmap_prefetch_max(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_x_step() {
        const ret = wasm.chartengine_get_heatmap_x_step(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_iceberg_count() {
        const ret = wasm.chartengine_get_iceberg_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * Returns JSON with the last candle's OHLCV + change info.
     * Used by the chart legend to show current price when no crosshair hover.
     * @returns {string}
     */
    get_last_candle_json() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_get_last_candle_json(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get_last_close() {
        const ret = wasm.chartengine_get_last_close(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_cell_height() {
        const ret = wasm.chartengine_get_liq_heatmap_cell_height(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_filled_pct() {
        const ret = wasm.chartengine_get_liq_heatmap_filled_pct(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_max() {
        const ret = wasm.chartengine_get_liq_heatmap_max(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_min() {
        const ret = wasm.chartengine_get_liq_heatmap_min(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_seg_max() {
        const ret = wasm.chartengine_get_liq_heatmap_seg_max(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_live_signals_count() {
        const ret = wasm.chartengine_get_live_signals_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_live_signals_leverage() {
        const ret = wasm.chartengine_get_live_signals_leverage(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_lt_data_max_vol() {
        const ret = wasm.chartengine_get_lt_data_max_vol(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_lt_data_min_vol() {
        const ret = wasm.chartengine_get_lt_data_min_vol(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_oi_ratio() {
        const ret = wasm.chartengine_get_oi_ratio(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_rsi_ratio() {
        const ret = wasm.chartengine_get_rsi_ratio(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_selected_drawing() {
        const ret = wasm.chartengine_get_selected_drawing(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_selected_marker() {
        const ret = wasm.chartengine_get_selected_marker(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_sr_signals_count() {
        const ret = wasm.chartengine_get_sr_signals_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_stop_run_count() {
        const ret = wasm.chartengine_get_stop_run_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_theme() {
        const ret = wasm.chartengine_get_theme(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get_tooltip_data() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_get_tooltip_data(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get_tpo_period() {
        const ret = wasm.chartengine_get_tpo_period(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_volume_color_mode() {
        const ret = wasm.chartengine_get_volume_color_mode(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_volume_ma_period() {
        const ret = wasm.chartengine_get_volume_ma_period(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    get_volume_show_ma() {
        const ret = wasm.chartengine_get_volume_show_ma(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get_volume_show_signals() {
        const ret = wasm.chartengine_get_volume_show_signals(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get_vpin_bucket_size() {
        const ret = wasm.chartengine_get_vpin_bucket_size(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_vpin_num_buckets() {
        const ret = wasm.chartengine_get_vpin_num_buckets(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_vpin_ratio() {
        const ret = wasm.chartengine_get_vpin_ratio(this.__mrd_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_vpin_threshold() {
        const ret = wasm.chartengine_get_vpin_threshold(this.__mrd_ptr);
        return ret;
    }
    hide_crosshair() {
        wasm.chartengine_hide_crosshair(this.__mrd_ptr);
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_test_drawing(sx, sy) {
        const ret = wasm.chartengine_hit_test_drawing(this.__mrd_ptr, sx, sy);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_test_drawing_anchor(sx, sy) {
        const ret = wasm.chartengine_hit_test_drawing_anchor(this.__mrd_ptr, sx, sy);
        return ret;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_test_marker(sx, sy) {
        const ret = wasm.chartengine_hit_test_marker(this.__mrd_ptr, sx, sy);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_zone(sx, sy) {
        const ret = wasm.chartengine_hit_zone(this.__mrd_ptr, sx, sy);
        return ret;
    }
    /**
     * Batch hover hit-test: returns [zone, selected_drawing, anchor_hit, drawing_hit, marker_hit]
     * as a packed Int32Array. One WASM boundary crossing instead of 5-10 separate calls.
     * @param {number} sx
     * @param {number} sy
     * @returns {Int32Array}
     */
    hover_hit_test(sx, sy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_hover_hit_test(retptr, this.__mrd_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayI32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} json
     */
    import_drawings_json(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_import_drawings_json(this.__mrd_ptr, ptr0, len0);
    }
    /**
     * @returns {boolean}
     */
    is_cvd_enabled() {
        const ret = wasm.chartengine_is_cvd_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_dirty() {
        const ret = wasm.chartengine_is_dirty(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_ema_structure_enabled() {
        const ret = wasm.chartengine_is_ema_structure_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_forex_signals_enabled() {
        const ret = wasm.chartengine_is_forex_signals_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_funding_rate_enabled() {
        const ret = wasm.chartengine_is_funding_rate_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_large_trades_enabled() {
        const ret = wasm.chartengine_is_large_trades_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_liq_heatmap_enabled() {
        const ret = wasm.chartengine_is_liq_heatmap_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_liq_heatmap_filled_zones() {
        const ret = wasm.chartengine_is_liq_heatmap_filled_zones(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_liq_heatmap_predictions() {
        const ret = wasm.chartengine_is_liq_heatmap_predictions(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_liq_heatmap_profile() {
        const ret = wasm.chartengine_is_liq_heatmap_profile(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_live_signals_enabled() {
        const ret = wasm.chartengine_is_live_signals_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_oi_enabled() {
        const ret = wasm.chartengine_is_oi_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_rsi_enabled() {
        const ret = wasm.chartengine_is_rsi_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_rsi_show_traps() {
        const ret = wasm.chartengine_is_rsi_show_traps(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_smart_ranges_enabled() {
        const ret = wasm.chartengine_is_smart_ranges_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_stop_iceberg_enabled() {
        const ret = wasm.chartengine_is_stop_iceberg_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_tpo_enabled() {
        const ret = wasm.chartengine_is_tpo_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_tpo_signals() {
        const ret = wasm.chartengine_is_tpo_signals(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_volume_enabled() {
        const ret = wasm.chartengine_is_volume_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_vpin_enabled() {
        const ret = wasm.chartengine_is_vpin_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_vrvp_enabled() {
        const ret = wasm.chartengine_is_vrvp_enabled(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Float64Array}
     */
    kline_closes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_kline_closes(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    kline_count() {
        const ret = wasm.chartengine_kline_count(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Float64Array}
     */
    kline_highs() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_kline_highs(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Float64Array}
     */
    kline_lows() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_kline_lows(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Float64Array}
     */
    kline_opens() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_kline_opens(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Float64Array}
     */
    kline_timestamps() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_kline_timestamps(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Float64Array}
     */
    kline_volumes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_kline_volumes(retptr, this.__mrd_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    liq_filled_zone_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_liq_filled_zone_hit_test(retptr, this.__mrd_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    liq_heatmap_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_liq_heatmap_hit_test(retptr, this.__mrd_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    liq_predict_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_liq_predict_hit_test(retptr, this.__mrd_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    liq_zone_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_liq_zone_hit_test(retptr, this.__mrd_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    lt_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_lt_hit_test(retptr, this.__mrd_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} dx
     * @param {number} dy
     */
    move_drawing(dx, dy) {
        wasm.chartengine_move_drawing(this.__mrd_ptr, dx, dy);
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        const ret = wasm.chartengine_new(width, height);
        this.__mrd_ptr = ret >>> 0;
        ChartEngineFinalization.register(this, this.__mrd_ptr, this);
        return this;
    }
    /**
     * @param {number} val
     * @returns {number}
     */
    oi_to_screen_y(val) {
        const ret = wasm.chartengine_oi_to_screen_y(this.__mrd_ptr, val);
        return ret;
    }
    /**
     * @param {number} dx
     * @param {number} dy
     */
    pan(dx, dy) {
        wasm.chartengine_pan(this.__mrd_ptr, dx, dy);
    }
    /**
     * Pan the Y axis of a specific indicator sub-pane.
     * pane: 1=RSI, 2=OI, 3=FR, 4=CVD, 5=VPIN
     * @param {number} pane
     * @param {number} dy
     */
    pan_indicator_y(pane, dy) {
        wasm.chartengine_pan_indicator_y(this.__mrd_ptr, pane, dy);
    }
    /**
     * @param {number} dx
     */
    pan_x(dx) {
        wasm.chartengine_pan_x(this.__mrd_ptr, dx);
    }
    /**
     * @param {number} dy
     */
    pan_y(dy) {
        wasm.chartengine_pan_y(this.__mrd_ptr, dy);
    }
    /**
     * Remove the last kline (used by bar replay to step backward).
     * @returns {boolean}
     */
    pop_last_kline() {
        const ret = wasm.chartengine_pop_last_kline(this.__mrd_ptr);
        return ret !== 0;
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} open
     * @param {Float64Array} high
     * @param {Float64Array} low
     * @param {Float64Array} close
     * @param {Float64Array} volume
     */
    prepend_klines(timestamps, open, high, low, close, volume) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(open, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(high, wasm.__wbindgen_export);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF64ToWasm0(low, wasm.__wbindgen_export);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArrayF64ToWasm0(close, wasm.__wbindgen_export);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArrayF64ToWasm0(volume, wasm.__wbindgen_export);
        const len5 = WASM_VECTOR_LEN;
        wasm.chartengine_prepend_klines(this.__mrd_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
    }
    /**
     * @param {number} ts
     * @param {number} price
     * @param {number} vol_usd
     * @param {number} side_type
     */
    push_large_trade(ts, price, vol_usd, side_type) {
        wasm.chartengine_push_large_trade(this.__mrd_ptr, ts, price, vol_usd, side_type);
    }
    /**
     * @param {number} id
     */
    remove_drawing(id) {
        wasm.chartengine_remove_drawing(this.__mrd_ptr, id);
    }
    /**
     * @param {number} id
     */
    remove_marker(id) {
        wasm.chartengine_remove_marker(this.__mrd_ptr, id);
    }
    /**
     * @returns {number}
     */
    render() {
        const ret = wasm.chartengine_render(this.__mrd_ptr);
        return ret >>> 0;
    }
    /**
     * Reset an indicator pane's Y axis back to auto-scale.
     * @param {number} pane
     */
    reset_indicator_y_auto(pane) {
        wasm.chartengine_reset_indicator_y_auto(this.__mrd_ptr, pane);
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        wasm.chartengine_resize(this.__mrd_ptr, width, height);
    }
    /**
     * @param {number} val
     * @returns {number}
     */
    rsi_to_screen_y(val) {
        const ret = wasm.chartengine_rsi_to_screen_y(this.__mrd_ptr, val);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_cvd_y(sy) {
        const ret = wasm.chartengine_screen_to_cvd_y(this.__mrd_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_fr_y(sy) {
        const ret = wasm.chartengine_screen_to_fr_y(this.__mrd_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_oi_y(sy) {
        const ret = wasm.chartengine_screen_to_oi_y(this.__mrd_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_rsi_y(sy) {
        const ret = wasm.chartengine_screen_to_rsi_y(this.__mrd_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_vpin_y(sy) {
        const ret = wasm.chartengine_screen_to_vpin_y(this.__mrd_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sx
     * @returns {number}
     */
    screen_to_world_x(sx) {
        const ret = wasm.chartengine_screen_to_world_x(this.__mrd_ptr, sx);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_world_y(sy) {
        const ret = wasm.chartengine_screen_to_world_y(this.__mrd_ptr, sy);
        return ret;
    }
    /**
     * @param {number} id
     */
    select_drawing(id) {
        wasm.chartengine_select_drawing(this.__mrd_ptr, id);
    }
    /**
     * @param {number} id
     */
    select_marker(id) {
        wasm.chartengine_select_marker(this.__mrd_ptr, id);
    }
    /**
     * @param {number} seconds
     */
    set_candle_interval(seconds) {
        wasm.chartengine_set_candle_interval(this.__mrd_ptr, seconds);
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} _dashed
     * @param {number} pane
     */
    set_channel_preview(x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane) {
        wasm.chartengine_set_channel_preview(this.__mrd_ptr, x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane);
    }
    /**
     * @param {number} ct
     */
    set_chart_type(ct) {
        wasm.chartengine_set_chart_type(this.__mrd_ptr, ct);
    }
    /**
     * @param {number} sx
     * @param {number} sy
     */
    set_crosshair(sx, sy) {
        wasm.chartengine_set_crosshair(this.__mrd_ptr, sx, sy);
    }
    /**
     * @param {Float64Array} taker_buy_vol
     * @param {Float64Array} total_vol
     */
    set_cvd_data(taker_buy_vol, total_vol) {
        const ptr0 = passArrayF64ToWasm0(taker_buy_vol, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(total_vol, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_cvd_data(this.__mrd_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} mode
     */
    set_cvd_mode(mode) {
        wasm.chartengine_set_cvd_mode(this.__mrd_ptr, mode);
    }
    /**
     * @param {number} ratio
     */
    set_cvd_ratio(ratio) {
        wasm.chartengine_set_cvd_ratio(this.__mrd_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_show_delta(show) {
        wasm.chartengine_set_cvd_show_delta(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_show_divergence(show) {
        wasm.chartengine_set_cvd_show_divergence(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_show_signals(show) {
        wasm.chartengine_set_cvd_show_signals(this.__mrd_ptr, show);
    }
    /**
     * @param {number} mode
     */
    set_cvd_source(mode) {
        wasm.chartengine_set_cvd_source(this.__mrd_ptr, mode);
    }
    /**
     * @param {Float64Array} taker_buy_vol
     * @param {Float64Array} total_vol
     */
    set_cvd_spot_data(taker_buy_vol, total_vol) {
        const ptr0 = passArrayF64ToWasm0(taker_buy_vol, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(total_vol, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_cvd_spot_data(this.__mrd_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} id
     * @param {boolean} dashed
     */
    set_drawing_dashed(id, dashed) {
        wasm.chartengine_set_drawing_dashed(this.__mrd_ptr, id, dashed);
    }
    /**
     * @param {number} id
     * @param {number} font_size
     */
    set_drawing_font_size(id, font_size) {
        wasm.chartengine_set_drawing_font_size(this.__mrd_ptr, id, font_size);
    }
    /**
     * @param {number} id
     * @param {boolean} hide
     */
    set_drawing_hide_label(id, hide) {
        wasm.chartengine_set_drawing_hide_label(this.__mrd_ptr, id, hide);
    }
    /**
     * @param {number} kind
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} dashed
     * @param {number} pane
     */
    set_drawing_preview(kind, x1, y1, x2, y2, r, g, b, line_width, dashed, pane) {
        wasm.chartengine_set_drawing_preview(this.__mrd_ptr, kind, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
    }
    /**
     * @param {number} id
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     */
    set_drawing_style(id, r, g, b, line_width) {
        wasm.chartengine_set_drawing_style(this.__mrd_ptr, id, r, g, b, line_width);
    }
    /**
     * @param {number} id
     * @param {string} text
     */
    set_drawing_text(id, text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_drawing_text(this.__mrd_ptr, id, ptr0, len0);
    }
    /**
     * @param {number} wx
     * @param {number} wy
     */
    set_elliott_manual_cursor(wx, wy) {
        wasm.chartengine_set_elliott_manual_cursor(this.__mrd_ptr, wx, wy);
    }
    /**
     * Compute and store the Elliott Wave preview for the given cursor position.
     * Called on every mouse-move while the elliott tool is active.
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} lw
     * @param {number} pane
     */
    set_elliott_preview(x, y, r, g, b, lw, pane) {
        wasm.chartengine_set_elliott_preview(this.__mrd_ptr, x, y, r, g, b, lw, pane);
    }
    /**
     * @param {number} len
     */
    set_es_ema1_len(len) {
        wasm.chartengine_set_es_ema1_len(this.__mrd_ptr, len);
    }
    /**
     * @param {number} len
     */
    set_es_ema2_len(len) {
        wasm.chartengine_set_es_ema2_len(this.__mrd_ptr, len);
    }
    /**
     * @param {boolean} show
     */
    set_es_show_bos(show) {
        wasm.chartengine_set_es_show_bos(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_es_show_ema1(show) {
        wasm.chartengine_set_es_show_ema1(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_es_show_ema2(show) {
        wasm.chartengine_set_es_show_ema2(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_es_show_wma(show) {
        wasm.chartengine_set_es_show_wma(this.__mrd_ptr, show);
    }
    /**
     * @param {number} len
     */
    set_es_swing_len(len) {
        wasm.chartengine_set_es_swing_len(this.__mrd_ptr, len);
    }
    /**
     * @param {number} len
     */
    set_es_wma_len(len) {
        wasm.chartengine_set_es_wma_len(this.__mrd_ptr, len);
    }
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} _dashed
     * @param {number} pane
     */
    set_fib_ext_preview(x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane) {
        wasm.chartengine_set_fib_ext_preview(this.__mrd_ptr, x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane);
    }
    /**
     * @param {number} tick
     */
    set_footprint_tick_size(tick) {
        wasm.chartengine_set_footprint_tick_size(this.__mrd_ptr, tick);
    }
    /**
     * @param {number} mode
     */
    set_forex_signals_mode(mode) {
        wasm.chartengine_set_forex_signals_mode(this.__mrd_ptr, mode);
    }
    /**
     * @param {boolean} is_btc_5m
     */
    set_forex_signals_setup(is_btc_5m) {
        wasm.chartengine_set_forex_signals_setup(this.__mrd_ptr, is_btc_5m);
    }
    /**
     * @param {boolean} show
     */
    set_forex_signals_show_stats(show) {
        wasm.chartengine_set_forex_signals_show_stats(this.__mrd_ptr, show);
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} values
     */
    set_fr_agg_data(timestamps, values) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_fr_agg_data(this.__mrd_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} values
     */
    set_fr_binance_data(timestamps, values) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_fr_binance_data(this.__mrd_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} ratio
     */
    set_fr_ratio(ratio) {
        wasm.chartengine_set_fr_ratio(this.__mrd_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_fr_show_agg(show) {
        wasm.chartengine_set_fr_show_agg(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_fr_show_sma(show) {
        wasm.chartengine_set_fr_show_sma(this.__mrd_ptr, show);
    }
    /**
     * @param {Float64Array} matrix
     * @param {number} rows
     * @param {number} cols
     * @param {number} x_start
     * @param {number} x_step
     * @param {number} y_start
     * @param {number} y_step
     */
    set_heatmap(matrix, rows, cols, x_start, x_step, y_start, y_step) {
        const ptr0 = passArrayF64ToWasm0(matrix, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_heatmap(this.__mrd_ptr, ptr0, len0, rows, cols, x_start, x_step, y_start, y_step);
    }
    /**
     * Store the server-reported total volume max so that progressive chunk
     * loading produces stable heatmap colours from the first rendered chunk.
     * Does NOT mark dirty — this only affects future normalization, not current pixels.
     * @param {number} max
     */
    set_heatmap_prefetch_range(max) {
        wasm.chartengine_set_heatmap_prefetch_range(this.__mrd_ptr, max);
    }
    /**
     * @param {number} min
     * @param {number} max
     */
    set_heatmap_range(min, max) {
        wasm.chartengine_set_heatmap_range(this.__mrd_ptr, min, max);
    }
    /**
     * @param {number} price
     */
    set_hover_price(price) {
        wasm.chartengine_set_hover_price(this.__mrd_ptr, price);
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} prices
     * @param {Float64Array} visible_sizes
     * @param {Float64Array} hidden_sizes
     * @param {Uint8Array} is_bids
     * @param {Uint32Array} refill_counts
     */
    set_iceberg_events(timestamps, prices, visible_sizes, hidden_sizes, is_bids, refill_counts) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(prices, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(visible_sizes, wasm.__wbindgen_export);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF64ToWasm0(hidden_sizes, wasm.__wbindgen_export);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArray8ToWasm0(is_bids, wasm.__wbindgen_export);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArray32ToWasm0(refill_counts, wasm.__wbindgen_export);
        const len5 = WASM_VECTOR_LEN;
        wasm.chartengine_set_iceberg_events(this.__mrd_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} open
     * @param {Float64Array} high
     * @param {Float64Array} low
     * @param {Float64Array} close
     * @param {Float64Array} volume
     */
    set_klines(timestamps, open, high, low, close, volume) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(open, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(high, wasm.__wbindgen_export);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF64ToWasm0(low, wasm.__wbindgen_export);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArrayF64ToWasm0(close, wasm.__wbindgen_export);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArrayF64ToWasm0(volume, wasm.__wbindgen_export);
        const len5 = WASM_VECTOR_LEN;
        wasm.chartengine_set_klines(this.__mrd_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
    }
    /**
     * @param {Float64Array} flat
     */
    set_large_trades_data(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_large_trades_data(this.__mrd_ptr, ptr0, len0);
    }
    /**
     * Set license state from JS bridge. Token must match hash to prevent direct bypass.
     * state: 0 = licensed, 1 = trial, 2 = expired
     * @param {number} state
     * @param {number} days
     * @param {number} token
     */
    set_license_state(state, days, token) {
        wasm.chartengine_set_license_state(this.__mrd_ptr, state, days, token);
    }
    /**
     * @param {number} mult
     */
    set_liq_heatmap_cell_height(mult) {
        wasm.chartengine_set_liq_heatmap_cell_height(this.__mrd_ptr, mult);
    }
    /**
     * @param {number} pct
     */
    set_liq_heatmap_filled_pct(pct) {
        wasm.chartengine_set_liq_heatmap_filled_pct(this.__mrd_ptr, pct);
    }
    /**
     * @param {boolean} show
     */
    set_liq_heatmap_filled_zones(show) {
        wasm.chartengine_set_liq_heatmap_filled_zones(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_liq_heatmap_predictions(show) {
        wasm.chartengine_set_liq_heatmap_predictions(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_liq_heatmap_profile(show) {
        wasm.chartengine_set_liq_heatmap_profile(this.__mrd_ptr, show);
    }
    /**
     * @param {number} min
     * @param {number} max
     */
    set_liq_heatmap_range(min, max) {
        wasm.chartengine_set_liq_heatmap_range(this.__mrd_ptr, min, max);
    }
    /**
     * @param {Float64Array} flat
     */
    set_live_signals_data(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_live_signals_data(this.__mrd_ptr, ptr0, len0);
    }
    /**
     * @param {number} leverage
     */
    set_live_signals_leverage(leverage) {
        wasm.chartengine_set_live_signals_leverage(this.__mrd_ptr, leverage);
    }
    /**
     * @param {boolean} loading
     */
    set_live_signals_loading(loading) {
        wasm.chartengine_set_live_signals_loading(this.__mrd_ptr, loading);
    }
    /**
     * @param {number} pip_value
     */
    set_live_signals_pip_value(pip_value) {
        wasm.chartengine_set_live_signals_pip_value(this.__mrd_ptr, pip_value);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_entry(show) {
        wasm.chartengine_set_live_signals_show_entry(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_labels(show) {
        wasm.chartengine_set_live_signals_show_labels(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_max_profit(show) {
        wasm.chartengine_set_live_signals_show_max_profit(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_tp_sl(show) {
        wasm.chartengine_set_live_signals_show_tp_sl(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_zones(show) {
        wasm.chartengine_set_live_signals_show_zones(this.__mrd_ptr, show);
    }
    /**
     * @param {number} size
     */
    set_live_signals_text_size(size) {
        wasm.chartengine_set_live_signals_text_size(this.__mrd_ptr, size);
    }
    /**
     * @param {boolean} is_trial
     */
    set_live_signals_trial(is_trial) {
        wasm.chartengine_set_live_signals_trial(this.__mrd_ptr, is_trial);
    }
    /**
     * @param {number} scale
     */
    set_lt_bubble_scale(scale) {
        wasm.chartengine_set_lt_bubble_scale(this.__mrd_ptr, scale);
    }
    /**
     * @param {number} min
     * @param {number} max
     */
    set_lt_volume_filter(min, max) {
        wasm.chartengine_set_lt_volume_filter(this.__mrd_ptr, min, max);
    }
    /**
     * @param {Float64Array} values
     */
    set_oi_data(values) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_oi_data(this.__mrd_ptr, ptr0, len0);
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} values
     */
    set_oi_data_ts(timestamps, values) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_oi_data_ts(this.__mrd_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} mode
     */
    set_oi_display_mode(mode) {
        wasm.chartengine_set_oi_display_mode(this.__mrd_ptr, mode);
    }
    /**
     * @param {number} ratio
     */
    set_oi_ratio(ratio) {
        wasm.chartengine_set_oi_ratio(this.__mrd_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_oi_show_on_chart(show) {
        wasm.chartengine_set_oi_show_on_chart(this.__mrd_ptr, show);
    }
    /**
     * @param {number} wx
     * @param {number} wy
     */
    set_path_cursor(wx, wy) {
        wasm.chartengine_set_path_cursor(this.__mrd_ptr, wx, wy);
    }
    /**
     * @param {number} decimals
     */
    set_price_precision(decimals) {
        wasm.chartengine_set_price_precision(this.__mrd_ptr, decimals);
    }
    /**
     * Store wall-clock timestamps for Forex gap-free rendering.
     * Must be called after `set_klines` with the same length.
     * @param {Float64Array} real_ts
     */
    set_real_timestamps(real_ts) {
        const ptr0 = passArrayF64ToWasm0(real_ts, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_real_timestamps(this.__mrd_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} hovered
     */
    set_replay_hovered(hovered) {
        wasm.chartengine_set_replay_hovered(this.__mrd_ptr, hovered);
    }
    /**
     * @param {number} screen_x
     */
    set_replay_preview(screen_x) {
        wasm.chartengine_set_replay_preview(this.__mrd_ptr, screen_x);
    }
    /**
     * @param {boolean} active
     * @param {number} current
     * @param {number} total
     */
    set_replay_state(active, current, total) {
        wasm.chartengine_set_replay_state(this.__mrd_ptr, active, current, total);
    }
    /**
     * @param {number} period
     */
    set_rsi_period(period) {
        wasm.chartengine_set_rsi_period(this.__mrd_ptr, period);
    }
    /**
     * @param {number} ratio
     */
    set_rsi_ratio(ratio) {
        wasm.chartengine_set_rsi_ratio(this.__mrd_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_divergence(show) {
        wasm.chartengine_set_rsi_show_divergence(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_ema(show) {
        wasm.chartengine_set_rsi_show_ema(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_signals(show) {
        wasm.chartengine_set_rsi_show_signals(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_traps(show) {
        wasm.chartengine_set_rsi_show_traps(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_wma(show) {
        wasm.chartengine_set_rsi_show_wma(this.__mrd_ptr, show);
    }
    /**
     * @param {number} val
     */
    set_rsi_smoothing(val) {
        wasm.chartengine_set_rsi_smoothing(this.__mrd_ptr, val);
    }
    /**
     * @param {boolean} show
     */
    set_si_show_icebergs(show) {
        wasm.chartengine_set_si_show_icebergs(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_si_show_stops(show) {
        wasm.chartengine_set_si_show_stops(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_si_show_zones(show) {
        wasm.chartengine_set_si_show_zones(this.__mrd_ptr, show);
    }
    /**
     * @param {number} extend
     */
    set_sr_fvg_extend(extend) {
        wasm.chartengine_set_sr_fvg_extend(this.__mrd_ptr, extend);
    }
    /**
     * @param {boolean} show
     */
    set_sr_fvg_htf(show) {
        wasm.chartengine_set_sr_fvg_htf(this.__mrd_ptr, show);
    }
    /**
     * @param {number} mode
     */
    set_sr_fvg_mitigation(mode) {
        wasm.chartengine_set_sr_fvg_mitigation(this.__mrd_ptr, mode);
    }
    /**
     * @param {number} theme
     */
    set_sr_fvg_theme(theme) {
        wasm.chartengine_set_sr_fvg_theme(this.__mrd_ptr, theme);
    }
    /**
     * @param {number} minutes
     */
    set_sr_htf_minutes(minutes) {
        wasm.chartengine_set_sr_htf_minutes(this.__mrd_ptr, minutes);
    }
    /**
     * @param {number} mode
     */
    set_sr_mitigation(mode) {
        wasm.chartengine_set_sr_mitigation(this.__mrd_ptr, mode);
    }
    /**
     * @param {number} count
     */
    set_sr_ob_last(count) {
        wasm.chartengine_set_sr_ob_last(this.__mrd_ptr, count);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_breakers(show) {
        wasm.chartengine_set_sr_show_breakers(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_fvg(show) {
        wasm.chartengine_set_sr_show_fvg(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_fvg_signals(show) {
        wasm.chartengine_set_sr_show_fvg_signals(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_htf_ob(show) {
        wasm.chartengine_set_sr_show_htf_ob(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_metrics(show) {
        wasm.chartengine_set_sr_show_metrics(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_ob(show) {
        wasm.chartengine_set_sr_show_ob(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_ob_activity(show) {
        wasm.chartengine_set_sr_show_ob_activity(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_ob_signals(show) {
        wasm.chartengine_set_sr_show_ob_signals(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_predict(show) {
        wasm.chartengine_set_sr_show_predict(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_smart_rev(show) {
        wasm.chartengine_set_sr_show_smart_rev(this.__mrd_ptr, show);
    }
    /**
     * @param {number} minutes
     */
    set_sr_smart_rev_htf(minutes) {
        wasm.chartengine_set_sr_smart_rev_htf(this.__mrd_ptr, minutes);
    }
    /**
     * @param {number} pos
     */
    set_sr_stats_position(pos) {
        wasm.chartengine_set_sr_stats_position(this.__mrd_ptr, pos);
    }
    /**
     * @param {number} stats_type
     */
    set_sr_stats_type(stats_type) {
        wasm.chartengine_set_sr_stats_type(this.__mrd_ptr, stats_type);
    }
    /**
     * @param {number} size
     */
    set_sr_text_size(size) {
        wasm.chartengine_set_sr_text_size(this.__mrd_ptr, size);
    }
    /**
     * Switch theme: 0 = dark, 1 = light
     * @param {number} id
     */
    set_theme(id) {
        wasm.chartengine_set_theme(this.__mrd_ptr, id);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_ib(show) {
        wasm.chartengine_set_tpo_ib(this.__mrd_ptr, show);
    }
    /**
     * @param {number} minutes
     */
    set_tpo_ib_minutes(minutes) {
        wasm.chartengine_set_tpo_ib_minutes(this.__mrd_ptr, minutes);
    }
    /**
     * @param {number} minutes
     */
    set_tpo_letter_minutes(minutes) {
        wasm.chartengine_set_tpo_letter_minutes(this.__mrd_ptr, minutes);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_naked_poc(show) {
        wasm.chartengine_set_tpo_naked_poc(this.__mrd_ptr, show);
    }
    /**
     * @param {number} minutes
     */
    set_tpo_period(minutes) {
        wasm.chartengine_set_tpo_period(this.__mrd_ptr, minutes);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_poc_line(show) {
        wasm.chartengine_set_tpo_poc_line(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_profile_shape(show) {
        wasm.chartengine_set_tpo_profile_shape(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_signals(show) {
        wasm.chartengine_set_tpo_signals(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_single_prints(show) {
        wasm.chartengine_set_tpo_single_prints(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_va_lines(show) {
        wasm.chartengine_set_tpo_va_lines(this.__mrd_ptr, show);
    }
    /**
     * @param {number} mode
     */
    set_volume_color_mode(mode) {
        wasm.chartengine_set_volume_color_mode(this.__mrd_ptr, mode);
    }
    /**
     * @param {number} period
     */
    set_volume_ma_period(period) {
        wasm.chartengine_set_volume_ma_period(this.__mrd_ptr, period);
    }
    /**
     * @param {boolean} show
     */
    set_volume_show_ma(show) {
        wasm.chartengine_set_volume_show_ma(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_volume_show_signals(show) {
        wasm.chartengine_set_volume_show_signals(this.__mrd_ptr, show);
    }
    /**
     * @param {number} size
     */
    set_vpin_bucket_size(size) {
        wasm.chartengine_set_vpin_bucket_size(this.__mrd_ptr, size);
    }
    /**
     * @param {Float64Array} taker_buy_vol
     * @param {Float64Array} total_vol
     */
    set_vpin_data(taker_buy_vol, total_vol) {
        const ptr0 = passArrayF64ToWasm0(taker_buy_vol, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(total_vol, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_vpin_data(this.__mrd_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} count
     */
    set_vpin_num_buckets(count) {
        wasm.chartengine_set_vpin_num_buckets(this.__mrd_ptr, count);
    }
    /**
     * @param {number} ratio
     */
    set_vpin_ratio(ratio) {
        wasm.chartengine_set_vpin_ratio(this.__mrd_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_vpin_show_sma(show) {
        wasm.chartengine_set_vpin_show_sma(this.__mrd_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_vpin_show_zones(show) {
        wasm.chartengine_set_vpin_show_zones(this.__mrd_ptr, show);
    }
    /**
     * @param {number} threshold
     */
    set_vpin_threshold(threshold) {
        wasm.chartengine_set_vpin_threshold(this.__mrd_ptr, threshold);
    }
    /**
     * @param {boolean} show
     */
    set_vrvp_poc_line(show) {
        wasm.chartengine_set_vrvp_poc_line(this.__mrd_ptr, show);
    }
    /**
     * @param {number} n_candles
     */
    show_latest(n_candles) {
        wasm.chartengine_show_latest(this.__mrd_ptr, n_candles);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {number} pane
     */
    start_brush(r, g, b, line_width, pane) {
        wasm.chartengine_start_brush(this.__mrd_ptr, r, g, b, line_width, pane);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} lw
     * @param {number} pane
     */
    start_elliott_manual(r, g, b, lw, pane) {
        wasm.chartengine_start_elliott_manual(this.__mrd_ptr, r, g, b, lw, pane);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {boolean} dashed
     * @param {number} pane
     */
    start_path(r, g, b, line_width, dashed, pane) {
        wasm.chartengine_start_path(this.__mrd_ptr, r, g, b, line_width, dashed, pane);
    }
    /**
     * @param {number} anchor
     * @param {number} wx
     * @param {number} wy
     */
    update_drawing_anchor(anchor, wx, wy) {
        wasm.chartengine_update_drawing_anchor(this.__mrd_ptr, anchor, wx, wy);
    }
    /**
     * @param {number} col
     * @param {Float64Array} values
     */
    update_heatmap_column(col, values) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_update_heatmap_column(this.__mrd_ptr, col, ptr0, len0);
    }
    /**
     * Update (or append) the column whose world-x matches `timestamp`.
     * If the timestamp falls within the existing grid, that column is
     * overwritten. If it is past the end, `append_column` handles
     * gap-filling automatically.
     * @param {Float64Array} values
     * @param {number} timestamp
     * @param {number} y_start
     * @param {number} y_step
     */
    update_heatmap_column_at(values, timestamp, y_start, y_step) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_update_heatmap_column_at(this.__mrd_ptr, ptr0, len0, timestamp, y_start, y_step);
    }
    /**
     * Overwrite the last column of the heatmap (forming candle update).
     * @param {Float64Array} values
     * @param {number} y_start
     * @param {number} y_step
     */
    update_last_heatmap_column(values, y_start, y_step) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_update_last_heatmap_column(this.__mrd_ptr, ptr0, len0, y_start, y_step);
    }
    /**
     * @param {number} ts
     * @param {number} o
     * @param {number} h
     * @param {number} l
     * @param {number} c
     * @param {number} v
     */
    update_last_kline(ts, o, h, l, c, v) {
        wasm.chartengine_update_last_kline(this.__mrd_ptr, ts, o, h, l, c, v);
    }
    /**
     * @param {number} val
     * @returns {number}
     */
    vpin_to_screen_y(val) {
        const ret = wasm.chartengine_vpin_to_screen_y(this.__mrd_ptr, val);
        return ret;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    vrvp_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_vrvp_hit_test(retptr, this.__mrd_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} wx
     * @returns {number}
     */
    world_to_screen_x(wx) {
        const ret = wasm.chartengine_world_to_screen_x(this.__mrd_ptr, wx);
        return ret;
    }
    /**
     * @param {number} wy
     * @returns {number}
     */
    world_to_screen_y(wy) {
        const ret = wasm.chartengine_world_to_screen_y(this.__mrd_ptr, wy);
        return ret;
    }
    /**
     * @param {number} screen_x
     * @param {number} screen_y
     * @param {number} factor
     */
    zoom(screen_x, screen_y, factor) {
        wasm.chartengine_zoom(this.__mrd_ptr, screen_x, screen_y, factor);
    }
    /**
     * Zoom the Y axis of a specific indicator sub-pane.
     * @param {number} pane
     * @param {number} screen_y
     * @param {number} factor
     */
    zoom_indicator_y(pane, screen_y, factor) {
        wasm.chartengine_zoom_indicator_y(this.__mrd_ptr, pane, screen_y, factor);
    }
    /**
     * @param {number} screen_x
     * @param {number} factor
     */
    zoom_x(screen_x, factor) {
        wasm.chartengine_zoom_x(this.__mrd_ptr, screen_x, factor);
    }
    /**
     * @param {number} screen_y
     * @param {number} factor
     */
    zoom_y(screen_y, factor) {
        wasm.chartengine_zoom_y(this.__mrd_ptr, screen_y, factor);
    }
}
if (Symbol.dispose) ChartEngine.prototype[Symbol.dispose] = ChartEngine.prototype.free;

/**
 * @returns {any}
 */
export function wasm_memory() {
    const ret = wasm.wasm_memory();
    return takeObject(ret);
}

function __mrd_get_imports() {
    const import0 = {
        __proto__: null,
        __mrd___wbindgen_memory_edb3f01e3930bbf6: function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        },
        __mrd___wbindgen_throw_6ddd609b62940d55: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
    };
    return {
        __proto__: null,
        "./chart_engine_bg.js": import0,
    };
}

const ChartEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__mrd_chartengine_free(ptr >>> 0, 1));

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 1028) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

let cachedInt32ArrayMemory0 = null;
function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

let heap = new Array(1024).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __mrd_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedInt32ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    return wasm;
}

async function __mrd_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __mrd_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __mrd_finalize_init(instance, module);
}

async function __mrd_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('chart_engine_bg.wasm', import.meta.url);
    }
    const imports = __mrd_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __mrd_load(await module_or_path, imports);

    return __mrd_finalize_init(instance, module);
}

export { initSync, __mrd_init as default };
