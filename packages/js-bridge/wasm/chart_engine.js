/* @ts-self-types="./chart_engine.d.ts" */

export class ChartEngine {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChartEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chartengine_free(ptr, 0);
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
        const ret = wasm.chartengine_add_anchored_vwap(this.__wbg_ptr, anchor_x, r, g, b, line_width, _dashed, pane);
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
        const ret = wasm.chartengine_add_arrow(this.__wbg_ptr, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
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
        const ret = wasm.chartengine_add_arrow_marker_down(this.__wbg_ptr, x, y, r, g, b, _font_size, pane);
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
        const ret = wasm.chartengine_add_arrow_marker_up(this.__wbg_ptr, x, y, r, g, b, _font_size, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} wx
     * @param {number} wy
     */
    add_brush_point(wx, wy) {
        wasm.chartengine_add_brush_point(this.__wbg_ptr, wx, wy);
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
        const ret = wasm.chartengine_add_circle(this.__wbg_ptr, cx, cy, ex, ey, r, g, b, line_width, _dashed, pane);
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
        const ret = wasm.chartengine_add_elliott_impulse(this.__wbg_ptr, click_x, click_y, r, g, b, _font_size, pane);
        return ret >>> 0;
    }
    /**
     * Add a point. Returns true when all 6 points collected (auto-finish).
     * @param {number} wx
     * @param {number} wy
     * @returns {boolean}
     */
    add_elliott_manual_point(wx, wy) {
        const ret = wasm.chartengine_add_elliott_manual_point(this.__wbg_ptr, wx, wy);
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
        const ret = wasm.chartengine_add_fib_extension(this.__wbg_ptr, x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane);
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
        const ret = wasm.chartengine_add_fib_retracement(this.__wbg_ptr, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
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
        const ret = wasm.chartengine_add_horizontal_line(this.__wbg_ptr, x, price, r, g, b, line_width, dashed, pane);
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
        const ret = wasm.chartengine_add_long_position(this.__wbg_ptr, x1, entry, x2, tp, r, g, b, line_width, _dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} timestamp
     * @param {number} price
     * @param {boolean} is_bid
     */
    add_marker(timestamp, price, is_bid) {
        wasm.chartengine_add_marker(this.__wbg_ptr, timestamp, price, is_bid);
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
        const ret = wasm.chartengine_add_parallel_channel(this.__wbg_ptr, x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane);
        return ret >>> 0;
    }
    /**
     * @param {number} wx
     * @param {number} wy
     */
    add_path_point(wx, wy) {
        wasm.chartengine_add_path_point(this.__wbg_ptr, wx, wy);
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
        const ret = wasm.chartengine_add_price_label(this.__wbg_ptr, x, y, r, g, b, font_size, pane);
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
        const ret = wasm.chartengine_add_price_range(this.__wbg_ptr, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
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
        const ret = wasm.chartengine_add_short_position(this.__wbg_ptr, x1, entry, x2, tp, r, g, b, line_width, _dashed, pane);
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
        const ret = wasm.chartengine_add_text_note(this.__wbg_ptr, x, y, r, g, b, font_size, pane);
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
        const ret = wasm.chartengine_add_trendline(this.__wbg_ptr, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
        return ret >>> 0;
    }
    /**
     * Return the hovered bar as a JSON string (or empty when out of range).
     * @param {number} idx
     * @returns {string}
     */
    agg_liq_bar_json(idx) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_agg_liq_bar_json(retptr, this.__wbg_ptr, idx);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} val
     * @returns {number}
     */
    agg_liq_to_screen_y(val) {
        const ret = wasm.chartengine_agg_liq_to_screen_y(this.__wbg_ptr, val);
        return ret;
    }
    /**
     * Append a brand-new column (new candle) to the heatmap.
     * @param {Float64Array} values
     * @param {number} col_timestamp
     * @param {number} y_start
     * @param {number} y_step
     */
    append_heatmap_column(values, col_timestamp, y_start, y_step) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_append_heatmap_column(this.__wbg_ptr, ptr0, len0, col_timestamp, y_start, y_step);
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
        wasm.chartengine_append_kline(this.__wbg_ptr, ts, o, h, l, c, v);
    }
    /**
     * Append a single real timestamp (call after `append_kline` for Forex).
     * @param {number} real_ts
     */
    append_real_timestamp(real_ts) {
        wasm.chartengine_append_real_timestamp(this.__wbg_ptr, real_ts);
    }
    /**
     * Apply an incremental per-bucket update for one session. `buckets` is
     * `[p, b, s]*` flat-packed. Used for `cvd_session_update` after the
     * bridge has aggregated 1h source data into the user's chosen anchor.
     * @param {number} start
     * @param {number} end
     * @param {number} tick
     * @param {Float64Array} buckets
     */
    apply_cvd_profile_update(start, end, tick, buckets) {
        const ptr0 = passArrayF64ToWasm0(buckets, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_apply_cvd_profile_update(this.__wbg_ptr, start, end, tick, ptr0, len0);
    }
    cancel_brush() {
        wasm.chartengine_cancel_brush(this.__wbg_ptr);
    }
    cancel_elliott_manual() {
        wasm.chartengine_cancel_elliott_manual(this.__wbg_ptr);
    }
    cancel_path() {
        wasm.chartengine_cancel_path(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    chart_area_h() {
        const ret = wasm.chartengine_chart_area_h(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    chart_area_w() {
        const ret = wasm.chartengine_chart_area_w(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get chart area dimensions for custom clipping.
     * @returns {number}
     */
    chart_area_x() {
        const ret = wasm.chartengine_chart_area_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    chart_area_y() {
        const ret = wasm.chartengine_chart_area_y(this.__wbg_ptr);
        return ret;
    }
    clear_agg_liq() {
        wasm.chartengine_clear_agg_liq(this.__wbg_ptr);
    }
    clear_agg_liq_signals() {
        wasm.chartengine_clear_agg_liq_signals(this.__wbg_ptr);
    }
    clear_channel_preview() {
        wasm.chartengine_clear_channel_preview(this.__wbg_ptr);
    }
    clear_cvd_divergence() {
        wasm.chartengine_clear_cvd_divergence(this.__wbg_ptr);
    }
    /**
     * Clear OBs **and** the locally-computed gap cache. The next
     * `recompute_indicators()` pass will regenerate gaps from the
     * kline series, so this is mostly useful when wiping state on
     * symbol switch / disable.
     */
    clear_cvd_orderblock_all() {
        wasm.chartengine_clear_cvd_orderblock_all(this.__wbg_ptr);
    }
    clear_cvd_orderblock_obs() {
        wasm.chartengine_clear_cvd_orderblock_obs(this.__wbg_ptr);
    }
    clear_cvd_profile() {
        wasm.chartengine_clear_cvd_profile(this.__wbg_ptr);
    }
    clear_cvd_regime() {
        wasm.chartengine_clear_cvd_regime(this.__wbg_ptr);
    }
    clear_cvd_trade_signals() {
        wasm.chartengine_clear_cvd_trade_signals(this.__wbg_ptr);
    }
    clear_drawing_preview() {
        wasm.chartengine_clear_drawing_preview(this.__wbg_ptr);
    }
    clear_drawings() {
        wasm.chartengine_clear_drawings(this.__wbg_ptr);
    }
    clear_elliott_preview() {
        wasm.chartengine_clear_elliott_preview(this.__wbg_ptr);
    }
    clear_fib_ext_preview() {
        wasm.chartengine_clear_fib_ext_preview(this.__wbg_ptr);
    }
    clear_heatmap_prefetch_range() {
        wasm.chartengine_clear_heatmap_prefetch_range(this.__wbg_ptr);
    }
    clear_heatmap_walls() {
        wasm.chartengine_clear_heatmap_walls(this.__wbg_ptr);
    }
    clear_hover_price() {
        wasm.chartengine_clear_hover_price(this.__wbg_ptr);
    }
    clear_large_trades() {
        wasm.chartengine_clear_large_trades(this.__wbg_ptr);
    }
    clear_live_signals() {
        wasm.chartengine_clear_live_signals(this.__wbg_ptr);
    }
    clear_markers() {
        wasm.chartengine_clear_markers(this.__wbg_ptr);
    }
    clear_mrd_pullback_htf_klines() {
        wasm.chartengine_clear_mrd_pullback_htf_klines(this.__wbg_ptr);
    }
    clear_ob_flow() {
        wasm.chartengine_clear_ob_flow(this.__wbg_ptr);
    }
    clear_ob_micro() {
        wasm.chartengine_clear_ob_micro(this.__wbg_ptr);
    }
    clear_ob_signals() {
        wasm.chartengine_clear_ob_signals(this.__wbg_ptr);
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
        const ptr0 = passArrayF64ToWasm0(upper, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(lower, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_band(this.__wbg_ptr, ptr0, len0, ptr1, len1, r, g, b, a);
    }
    custom_begin() {
        wasm.chartengine_custom_begin(this.__wbg_ptr);
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
        wasm.chartengine_custom_circle_px(this.__wbg_ptr, cx, cy, radius, fr, fg, fb, fa, sr, sg, sb, sa, line_width);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    custom_clip_rect(x, y, w, h) {
        wasm.chartengine_custom_clip_rect(this.__wbg_ptr, x, y, w, h);
    }
    /**
     * @returns {number}
     */
    custom_command_count() {
        const ret = wasm.chartengine_custom_command_count(this.__wbg_ptr);
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
        wasm.chartengine_custom_dashed_hline(this.__wbg_ptr, price, r, g, b, a, line_width, dash_len, gap_len);
    }
    custom_end() {
        wasm.chartengine_custom_end(this.__wbg_ptr);
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
        wasm.chartengine_custom_fill_rect_px(this.__wbg_ptr, x, y, w, h, r, g, b, a);
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
        wasm.chartengine_custom_hline(this.__wbg_ptr, price, r, g, b, a, line_width);
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
        wasm.chartengine_custom_line_px(this.__wbg_ptr, x1, y1, x2, y2, r, g, b, a, line_width);
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
        wasm.chartengine_custom_marker(this.__wbg_ptr, index, price, r, g, b, a, radius);
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
        wasm.chartengine_custom_marker_down(this.__wbg_ptr, index, price, r, g, b, a, size);
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
        wasm.chartengine_custom_marker_up(this.__wbg_ptr, index, price, r, g, b, a, size);
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
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_price_label(this.__wbg_ptr, price, ptr0, len0, r, g, b, a, font_size);
    }
    custom_restore() {
        wasm.chartengine_custom_restore(this.__wbg_ptr);
    }
    /**
     * Save/Restore canvas state in custom buffer (for clipping etc.)
     */
    custom_save() {
        wasm.chartengine_custom_save(this.__wbg_ptr);
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
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_series_dashed_line(this.__wbg_ptr, ptr0, len0, r, g, b, a, line_width, dash_len, gap_len);
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
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_series_line(this.__wbg_ptr, ptr0, len0, r, g, b, a, line_width);
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
        wasm.chartengine_custom_stroke_rect_px(this.__wbg_ptr, x, y, w, h, r, g, b, a, line_width);
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
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_text(this.__wbg_ptr, index, price, ptr0, len0, r, g, b, a, font_size, align);
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
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_custom_text_px(this.__wbg_ptr, x, y, ptr0, len0, r, g, b, a, font_size, align);
    }
    /**
     * @returns {number}
     */
    cvd_divergence_count() {
        const ret = wasm.chartengine_cvd_divergence_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    cvd_divergence_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_cvd_divergence_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    cvd_orderblock_gap_count() {
        const ret = wasm.chartengine_cvd_orderblock_gap_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    cvd_orderblock_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_cvd_orderblock_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    cvd_orderblock_ob_count() {
        const ret = wasm.chartengine_cvd_orderblock_ob_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    cvd_profile_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_cvd_profile_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    cvd_regime_flip_count() {
        const ret = wasm.chartengine_cvd_regime_flip_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    cvd_regime_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_cvd_regime_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    cvd_trade_signal_count() {
        const ret = wasm.chartengine_cvd_trade_signal_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {string}
     */
    cvd_trade_signals_hit_test(sx, sy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_cvd_trade_signals_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    delta_histogram_enabled() {
        const ret = wasm.chartengine_delta_histogram_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    deselect_drawing() {
        wasm.chartengine_deselect_drawing(this.__wbg_ptr);
    }
    deselect_marker() {
        wasm.chartengine_deselect_marker(this.__wbg_ptr);
    }
    disable_agg_liq() {
        wasm.chartengine_disable_agg_liq(this.__wbg_ptr);
    }
    disable_cvd() {
        wasm.chartengine_disable_cvd(this.__wbg_ptr);
    }
    disable_cvd_divergence() {
        wasm.chartengine_disable_cvd_divergence(this.__wbg_ptr);
    }
    disable_cvd_orderblock() {
        wasm.chartengine_disable_cvd_orderblock(this.__wbg_ptr);
    }
    disable_cvd_profile() {
        wasm.chartengine_disable_cvd_profile(this.__wbg_ptr);
    }
    disable_cvd_regime() {
        wasm.chartengine_disable_cvd_regime(this.__wbg_ptr);
    }
    disable_cvd_trade_signals() {
        wasm.chartengine_disable_cvd_trade_signals(this.__wbg_ptr);
    }
    disable_delta_histogram() {
        wasm.chartengine_disable_delta_histogram(this.__wbg_ptr);
    }
    disable_ema_structure() {
        wasm.chartengine_disable_ema_structure(this.__wbg_ptr);
    }
    disable_forex_signals() {
        wasm.chartengine_disable_forex_signals(this.__wbg_ptr);
    }
    disable_funding_rate() {
        wasm.chartengine_disable_funding_rate(this.__wbg_ptr);
    }
    disable_large_trades() {
        wasm.chartengine_disable_large_trades(this.__wbg_ptr);
    }
    disable_liq_heatmap() {
        wasm.chartengine_disable_liq_heatmap(this.__wbg_ptr);
    }
    disable_live_signals() {
        wasm.chartengine_disable_live_signals(this.__wbg_ptr);
    }
    disable_mrd_pullback() {
        wasm.chartengine_disable_mrd_pullback(this.__wbg_ptr);
    }
    disable_ob_flow() {
        wasm.chartengine_disable_ob_flow(this.__wbg_ptr);
    }
    disable_ob_micro() {
        wasm.chartengine_disable_ob_micro(this.__wbg_ptr);
    }
    disable_ob_signals() {
        wasm.chartengine_disable_ob_signals(this.__wbg_ptr);
    }
    disable_oi() {
        wasm.chartengine_disable_oi(this.__wbg_ptr);
    }
    disable_rsi() {
        wasm.chartengine_disable_rsi(this.__wbg_ptr);
    }
    disable_smart_ranges() {
        wasm.chartengine_disable_smart_ranges(this.__wbg_ptr);
    }
    disable_stop_iceberg() {
        wasm.chartengine_disable_stop_iceberg(this.__wbg_ptr);
    }
    disable_tpo() {
        wasm.chartengine_disable_tpo(this.__wbg_ptr);
    }
    disable_volume() {
        wasm.chartengine_disable_volume(this.__wbg_ptr);
    }
    disable_vpin() {
        wasm.chartengine_disable_vpin(this.__wbg_ptr);
    }
    disable_vrvp() {
        wasm.chartengine_disable_vrvp(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    drawing_count() {
        const ret = wasm.chartengine_drawing_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    enable_agg_liq() {
        wasm.chartengine_enable_agg_liq(this.__wbg_ptr);
    }
    enable_cvd() {
        wasm.chartengine_enable_cvd(this.__wbg_ptr);
    }
    enable_cvd_divergence() {
        wasm.chartengine_enable_cvd_divergence(this.__wbg_ptr);
    }
    enable_cvd_orderblock() {
        wasm.chartengine_enable_cvd_orderblock(this.__wbg_ptr);
    }
    enable_cvd_profile() {
        wasm.chartengine_enable_cvd_profile(this.__wbg_ptr);
    }
    enable_cvd_regime() {
        wasm.chartengine_enable_cvd_regime(this.__wbg_ptr);
    }
    enable_cvd_trade_signals() {
        wasm.chartengine_enable_cvd_trade_signals(this.__wbg_ptr);
    }
    enable_delta_histogram() {
        wasm.chartengine_enable_delta_histogram(this.__wbg_ptr);
    }
    enable_ema_structure() {
        wasm.chartengine_enable_ema_structure(this.__wbg_ptr);
    }
    enable_forex_signals() {
        wasm.chartengine_enable_forex_signals(this.__wbg_ptr);
    }
    enable_funding_rate() {
        wasm.chartengine_enable_funding_rate(this.__wbg_ptr);
    }
    enable_large_trades() {
        wasm.chartengine_enable_large_trades(this.__wbg_ptr);
    }
    enable_liq_heatmap() {
        wasm.chartengine_enable_liq_heatmap(this.__wbg_ptr);
    }
    enable_live_signals() {
        wasm.chartengine_enable_live_signals(this.__wbg_ptr);
    }
    enable_mrd_pullback() {
        wasm.chartengine_enable_mrd_pullback(this.__wbg_ptr);
    }
    enable_ob_flow() {
        wasm.chartengine_enable_ob_flow(this.__wbg_ptr);
    }
    enable_ob_micro() {
        wasm.chartengine_enable_ob_micro(this.__wbg_ptr);
    }
    enable_ob_signals() {
        wasm.chartengine_enable_ob_signals(this.__wbg_ptr);
    }
    enable_oi() {
        wasm.chartengine_enable_oi(this.__wbg_ptr);
    }
    enable_rsi() {
        wasm.chartengine_enable_rsi(this.__wbg_ptr);
    }
    enable_smart_ranges() {
        wasm.chartengine_enable_smart_ranges(this.__wbg_ptr);
    }
    enable_stop_iceberg() {
        wasm.chartengine_enable_stop_iceberg(this.__wbg_ptr);
    }
    enable_tpo() {
        wasm.chartengine_enable_tpo(this.__wbg_ptr);
    }
    enable_volume() {
        wasm.chartengine_enable_volume(this.__wbg_ptr);
    }
    enable_vpin() {
        wasm.chartengine_enable_vpin(this.__wbg_ptr);
    }
    enable_vrvp() {
        wasm.chartengine_enable_vrvp(this.__wbg_ptr);
    }
    /**
     * @returns {string}
     */
    export_drawings_json() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_export_drawings_json(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    finish_brush() {
        const ret = wasm.chartengine_finish_brush(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Finish manual elliott. If < 6 points, predict remaining with Fibonacci.
     * @returns {number}
     */
    finish_elliott_manual() {
        const ret = wasm.chartengine_finish_elliott_manual(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    finish_path() {
        const ret = wasm.chartengine_finish_path(this.__wbg_ptr);
        return ret >>> 0;
    }
    fit_content() {
        wasm.chartengine_fit_content(this.__wbg_ptr);
    }
    /**
     * @param {number} bar_idx
     * @param {number} price
     * @param {number} volume
     * @param {boolean} is_buyer_maker
     */
    footprint_add_trade(bar_idx, price, volume, is_buyer_maker) {
        wasm.chartengine_footprint_add_trade(this.__wbg_ptr, bar_idx, price, volume, is_buyer_maker);
    }
    /**
     * @param {Float64Array} data
     */
    footprint_add_trade_batch(data) {
        const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_footprint_add_trade_batch(this.__wbg_ptr, ptr0, len0);
    }
    footprint_clear() {
        wasm.chartengine_footprint_clear(this.__wbg_ptr);
    }
    /**
     * @param {number} bar_idx
     */
    footprint_clear_bar(bar_idx) {
        wasm.chartengine_footprint_clear_bar(this.__wbg_ptr, bar_idx);
    }
    /**
     * @param {number} n
     */
    footprint_ensure_len(n) {
        wasm.chartengine_footprint_ensure_len(this.__wbg_ptr, n);
    }
    /**
     * @returns {number}
     */
    footprint_get_display_mode() {
        const ret = wasm.chartengine_footprint_get_display_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    footprint_get_show_profile() {
        const ret = wasm.chartengine_footprint_get_show_profile(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    footprint_get_show_signals() {
        const ret = wasm.chartengine_footprint_get_show_signals(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} count
     */
    footprint_prepend_empty(count) {
        wasm.chartengine_footprint_prepend_empty(this.__wbg_ptr, count);
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
            wasm.chartengine_footprint_profile_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
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
        const ptr0 = passArrayF64ToWasm0(prices, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(bid_vols, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(ask_vols, wasm.__wbindgen_export2);
        const len2 = WASM_VECTOR_LEN;
        wasm.chartengine_footprint_set_bar(this.__wbg_ptr, bar_idx, tick_size, ptr0, len0, ptr1, len1, ptr2, len2);
    }
    /**
     * 0 = BidAsk, 1 = Delta, 2 = Volume
     * @param {number} mode
     */
    footprint_set_display_mode(mode) {
        wasm.chartengine_footprint_set_display_mode(this.__wbg_ptr, mode);
    }
    /**
     * @param {boolean} show
     */
    footprint_set_show_profile(show) {
        wasm.chartengine_footprint_set_show_profile(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    footprint_set_show_signals(show) {
        wasm.chartengine_footprint_set_show_signals(this.__wbg_ptr, show);
    }
    /**
     * @returns {number}
     */
    footprint_signal_count() {
        const ret = wasm.chartengine_footprint_signal_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_agg_liq_mode() {
        const ret = wasm.chartengine_get_agg_liq_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_agg_liq_ratio() {
        const ret = wasm.chartengine_get_agg_liq_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_chart_type() {
        const ret = wasm.chartengine_get_chart_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_command_buffer_len() {
        const ret = wasm.chartengine_get_command_buffer_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_command_buffer_ptr() {
        const ret = wasm.chartengine_get_command_buffer_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_custom_buffer_len() {
        const ret = wasm.chartengine_get_custom_buffer_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_custom_buffer_ptr() {
        const ret = wasm.chartengine_get_custom_buffer_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_cvd_mode() {
        const ret = wasm.chartengine_get_cvd_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_cvd_profile_view_mode() {
        const ret = wasm.chartengine_get_cvd_profile_view_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_cvd_ratio() {
        const ret = wasm.chartengine_get_cvd_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get_cvd_show_delta() {
        const ret = wasm.chartengine_get_cvd_show_delta(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get_cvd_show_divergence() {
        const ret = wasm.chartengine_get_cvd_show_divergence(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get_cvd_show_signals() {
        const ret = wasm.chartengine_get_cvd_show_signals(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get_cvd_source() {
        const ret = wasm.chartengine_get_cvd_source(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} id
     * @returns {number}
     */
    get_drawing_color(id) {
        const ret = wasm.chartengine_get_drawing_color(this.__wbg_ptr, id);
        return ret >>> 0;
    }
    /**
     * @param {number} id
     * @returns {boolean}
     */
    get_drawing_dashed(id) {
        const ret = wasm.chartengine_get_drawing_dashed(this.__wbg_ptr, id);
        return ret !== 0;
    }
    /**
     * @param {number} id
     * @returns {boolean}
     */
    get_drawing_flip_left(id) {
        const ret = wasm.chartengine_get_drawing_flip_left(this.__wbg_ptr, id);
        return ret !== 0;
    }
    /**
     * @param {number} id
     * @returns {number}
     */
    get_drawing_font_size(id) {
        const ret = wasm.chartengine_get_drawing_font_size(this.__wbg_ptr, id);
        return ret;
    }
    /**
     * @param {number} id
     * @returns {boolean}
     */
    get_drawing_hide_label(id) {
        const ret = wasm.chartengine_get_drawing_hide_label(this.__wbg_ptr, id);
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
        const ret = wasm.chartengine_get_drawing_kind_id(this.__wbg_ptr, id);
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
            wasm.chartengine_get_drawing_text(retptr, this.__wbg_ptr, id);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} id
     * @returns {boolean}
     */
    get_drawing_text_wrap(id) {
        const ret = wasm.chartengine_get_drawing_text_wrap(this.__wbg_ptr, id);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get_font_size() {
        const ret = wasm.chartengine_get_font_size(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_forex_signals_count() {
        const ret = wasm.chartengine_get_forex_signals_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_fr_ratio() {
        const ret = wasm.chartengine_get_fr_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_data_max() {
        const ret = wasm.chartengine_get_heatmap_data_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_data_min() {
        const ret = wasm.chartengine_get_heatmap_data_min(this.__wbg_ptr);
        return ret;
    }
    /**
     * Return the timestamp of the last heatmap column.
     * @returns {number}
     */
    get_heatmap_last_timestamp() {
        const ret = wasm.chartengine_get_heatmap_last_timestamp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_prefetch_max() {
        const ret = wasm.chartengine_get_heatmap_prefetch_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_profile_brightness() {
        const ret = wasm.chartengine_get_heatmap_profile_brightness(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_heatmap_wall_count() {
        const ret = wasm.chartengine_get_heatmap_wall_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_heatmap_x_step() {
        const ret = wasm.chartengine_get_heatmap_x_step(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_iceberg_count() {
        const ret = wasm.chartengine_get_iceberg_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    get_kline_visible() {
        const ret = wasm.chartengine_get_kline_visible(this.__wbg_ptr);
        return ret !== 0;
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
            wasm.chartengine_get_last_candle_json(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get_last_close() {
        const ret = wasm.chartengine_get_last_close(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_cell_height() {
        const ret = wasm.chartengine_get_liq_heatmap_cell_height(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_filled_pct() {
        const ret = wasm.chartengine_get_liq_heatmap_filled_pct(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_max() {
        const ret = wasm.chartengine_get_liq_heatmap_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_min() {
        const ret = wasm.chartengine_get_liq_heatmap_min(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_liq_heatmap_seg_max() {
        const ret = wasm.chartengine_get_liq_heatmap_seg_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_live_signals_count() {
        const ret = wasm.chartengine_get_live_signals_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_live_signals_leverage() {
        const ret = wasm.chartengine_get_live_signals_leverage(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_lt_data_max_vol() {
        const ret = wasm.chartengine_get_lt_data_max_vol(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_lt_data_min_vol() {
        const ret = wasm.chartengine_get_lt_data_min_vol(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_obf_ratio() {
        const ret = wasm.chartengine_get_obf_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_oi_ratio() {
        const ret = wasm.chartengine_get_oi_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_rsi_ratio() {
        const ret = wasm.chartengine_get_rsi_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_selected_drawing() {
        const ret = wasm.chartengine_get_selected_drawing(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_selected_marker() {
        const ret = wasm.chartengine_get_selected_marker(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_sr_signals_count() {
        const ret = wasm.chartengine_get_sr_signals_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_stop_run_count() {
        const ret = wasm.chartengine_get_stop_run_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_theme() {
        const ret = wasm.chartengine_get_theme(this.__wbg_ptr);
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
            wasm.chartengine_get_tooltip_data(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get_tpo_period() {
        const ret = wasm.chartengine_get_tpo_period(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_volume_color_mode() {
        const ret = wasm.chartengine_get_volume_color_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_volume_ma_period() {
        const ret = wasm.chartengine_get_volume_ma_period(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    get_volume_show_ma() {
        const ret = wasm.chartengine_get_volume_show_ma(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get_volume_show_signals() {
        const ret = wasm.chartengine_get_volume_show_signals(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get_vpin_bucket_size() {
        const ret = wasm.chartengine_get_vpin_bucket_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_vpin_num_buckets() {
        const ret = wasm.chartengine_get_vpin_num_buckets(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_vpin_ratio() {
        const ret = wasm.chartengine_get_vpin_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_vpin_threshold() {
        const ret = wasm.chartengine_get_vpin_threshold(this.__wbg_ptr);
        return ret;
    }
    hide_crosshair() {
        wasm.chartengine_hide_crosshair(this.__wbg_ptr);
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_test_drawing(sx, sy) {
        const ret = wasm.chartengine_hit_test_drawing(this.__wbg_ptr, sx, sy);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_test_drawing_anchor(sx, sy) {
        const ret = wasm.chartengine_hit_test_drawing_anchor(this.__wbg_ptr, sx, sy);
        return ret;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_test_marker(sx, sy) {
        const ret = wasm.chartengine_hit_test_marker(this.__wbg_ptr, sx, sy);
        return ret >>> 0;
    }
    /**
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_zone(sx, sy) {
        const ret = wasm.chartengine_hit_zone(this.__wbg_ptr, sx, sy);
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
            wasm.chartengine_hover_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayI32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} json
     */
    import_drawings_json(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_import_drawings_json(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {boolean}
     */
    is_agg_liq_enabled() {
        const ret = wasm.chartengine_is_agg_liq_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_agg_liq_show_signals() {
        const ret = wasm.chartengine_is_agg_liq_show_signals(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_agg_liq_signals_on_chart() {
        const ret = wasm.chartengine_is_agg_liq_signals_on_chart(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_cvd_divergence_enabled() {
        const ret = wasm.chartengine_is_cvd_divergence_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_cvd_enabled() {
        const ret = wasm.chartengine_is_cvd_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_cvd_orderblock_enabled() {
        const ret = wasm.chartengine_is_cvd_orderblock_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_cvd_profile_enabled() {
        const ret = wasm.chartengine_is_cvd_profile_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_cvd_regime_enabled() {
        const ret = wasm.chartengine_is_cvd_regime_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_cvd_trade_signals_enabled() {
        const ret = wasm.chartengine_is_cvd_trade_signals_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_dirty() {
        const ret = wasm.chartengine_is_dirty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_ema_structure_enabled() {
        const ret = wasm.chartengine_is_ema_structure_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_forex_signals_enabled() {
        const ret = wasm.chartengine_is_forex_signals_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_funding_rate_enabled() {
        const ret = wasm.chartengine_is_funding_rate_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_heatmap_show_profile() {
        const ret = wasm.chartengine_is_heatmap_show_profile(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_large_trades_enabled() {
        const ret = wasm.chartengine_is_large_trades_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_liq_heatmap_enabled() {
        const ret = wasm.chartengine_is_liq_heatmap_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_liq_heatmap_filled_zones() {
        const ret = wasm.chartengine_is_liq_heatmap_filled_zones(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_liq_heatmap_predictions() {
        const ret = wasm.chartengine_is_liq_heatmap_predictions(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_liq_heatmap_profile() {
        const ret = wasm.chartengine_is_liq_heatmap_profile(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_live_signals_enabled() {
        const ret = wasm.chartengine_is_live_signals_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_mrd_pullback_enabled() {
        const ret = wasm.chartengine_is_mrd_pullback_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_ob_flow_enabled() {
        const ret = wasm.chartengine_is_ob_flow_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_ob_micro_enabled() {
        const ret = wasm.chartengine_is_ob_micro_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_ob_signals_enabled() {
        const ret = wasm.chartengine_is_ob_signals_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_oi_enabled() {
        const ret = wasm.chartengine_is_oi_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_rsi_enabled() {
        const ret = wasm.chartengine_is_rsi_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_rsi_show_on_chart() {
        const ret = wasm.chartengine_is_rsi_show_on_chart(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_rsi_show_traps() {
        const ret = wasm.chartengine_is_rsi_show_traps(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_smart_ranges_enabled() {
        const ret = wasm.chartengine_is_smart_ranges_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_stop_iceberg_enabled() {
        const ret = wasm.chartengine_is_stop_iceberg_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_tpo_enabled() {
        const ret = wasm.chartengine_is_tpo_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_tpo_signals() {
        const ret = wasm.chartengine_is_tpo_signals(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_volume_enabled() {
        const ret = wasm.chartengine_is_volume_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_vpin_enabled() {
        const ret = wasm.chartengine_is_vpin_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_vrvp_enabled() {
        const ret = wasm.chartengine_is_vrvp_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Float64Array}
     */
    kline_closes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_kline_closes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    kline_count() {
        const ret = wasm.chartengine_kline_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Float64Array}
     */
    kline_highs() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.chartengine_kline_highs(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export(r0, r1 * 8, 8);
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
            wasm.chartengine_kline_lows(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export(r0, r1 * 8, 8);
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
            wasm.chartengine_kline_opens(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export(r0, r1 * 8, 8);
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
            wasm.chartengine_kline_timestamps(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export(r0, r1 * 8, 8);
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
            wasm.chartengine_kline_volumes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export(r0, r1 * 8, 8);
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
            wasm.chartengine_liq_filled_zone_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
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
            wasm.chartengine_liq_heatmap_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
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
            wasm.chartengine_liq_predict_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
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
            wasm.chartengine_liq_zone_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
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
            wasm.chartengine_lt_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} dx
     * @param {number} dy
     */
    move_drawing(dx, dy) {
        wasm.chartengine_move_drawing(this.__wbg_ptr, dx, dy);
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        const ret = wasm.chartengine_new(width, height);
        this.__wbg_ptr = ret >>> 0;
        ChartEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} val
     * @returns {number}
     */
    ob_flow_to_screen_y(val) {
        const ret = wasm.chartengine_ob_flow_to_screen_y(this.__wbg_ptr, val);
        return ret;
    }
    /**
     * @param {number} val
     * @returns {number}
     */
    oi_to_screen_y(val) {
        const ret = wasm.chartengine_oi_to_screen_y(this.__wbg_ptr, val);
        return ret;
    }
    /**
     * Pre-allocate an empty session slot (mirrors `cvd_session_open`).
     * @param {number} start
     * @param {number} end
     * @param {number} tick
     */
    open_cvd_profile_session(start, end, tick) {
        wasm.chartengine_open_cvd_profile_session(this.__wbg_ptr, start, end, tick);
    }
    /**
     * @param {number} dx
     * @param {number} dy
     */
    pan(dx, dy) {
        wasm.chartengine_pan(this.__wbg_ptr, dx, dy);
    }
    /**
     * Pan the Y axis of a specific indicator sub-pane.
     * pane: 1=RSI, 2=OI, 3=FR, 4=CVD, 5=VPIN
     * @param {number} pane
     * @param {number} dy
     */
    pan_indicator_y(pane, dy) {
        wasm.chartengine_pan_indicator_y(this.__wbg_ptr, pane, dy);
    }
    /**
     * @param {number} dx
     */
    pan_x(dx) {
        wasm.chartengine_pan_x(this.__wbg_ptr, dx);
    }
    /**
     * @param {number} dy
     */
    pan_y(dy) {
        wasm.chartengine_pan_y(this.__wbg_ptr, dy);
    }
    /**
     * Remove the last kline (used by bar replay to step backward).
     * @returns {boolean}
     */
    pop_last_kline() {
        const ret = wasm.chartengine_pop_last_kline(this.__wbg_ptr);
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
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(open, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(high, wasm.__wbindgen_export2);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF64ToWasm0(low, wasm.__wbindgen_export2);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArrayF64ToWasm0(close, wasm.__wbindgen_export2);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArrayF64ToWasm0(volume, wasm.__wbindgen_export2);
        const len5 = WASM_VECTOR_LEN;
        wasm.chartengine_prepend_klines(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
    }
    /**
     * @param {number} ts
     * @param {number} long_usd
     * @param {number} short_usd
     * @param {number} long_qty
     * @param {number} short_qty
     * @param {number} count
     */
    push_agg_liq_bar(ts, long_usd, short_usd, long_qty, short_qty, count) {
        wasm.chartengine_push_agg_liq_bar(this.__wbg_ptr, ts, long_usd, short_usd, long_qty, short_qty, count);
    }
    /**
     * Push a single signal (deduped on ts + kind).
     * @param {number} ts
     * @param {number} kind
     * @param {number} side
     * @param {number} volume_usd
     * @param {number} ratio
     * @param {number} confidence
     */
    push_agg_liq_signal(ts, kind, side, volume_usd, ratio, confidence) {
        wasm.chartengine_push_agg_liq_signal(this.__wbg_ptr, ts, kind, side, volume_usd, ratio, confidence);
    }
    /**
     * @param {number} ts
     * @param {number} price
     * @param {number} vol_usd
     * @param {number} side_type
     */
    push_large_trade(ts, price, vol_usd, side_type) {
        wasm.chartengine_push_large_trade(this.__wbg_ptr, ts, price, vol_usd, side_type);
    }
    /**
     * @param {number} ts
     * @param {number} obi
     * @param {number} net_flow
     * @param {number} cum_delta
     */
    push_obf_sample(ts, obi, net_flow, cum_delta) {
        wasm.chartengine_push_obf_sample(this.__wbg_ptr, ts, obi, net_flow, cum_delta);
    }
    /**
     * @param {number} ts
     * @param {number} price
     * @param {number} atype
     * @param {number} severity
     * @param {boolean} is_bid
     */
    push_obs_alert(ts, price, atype, severity, is_bid) {
        wasm.chartengine_push_obs_alert(this.__wbg_ptr, ts, price, atype, severity, is_bid);
    }
    /**
     * @param {string} id
     * @returns {boolean}
     */
    remove_cvd_divergence(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.chartengine_remove_cvd_divergence(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @returns {boolean}
     */
    remove_cvd_orderblock_ob(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.chartengine_remove_cvd_orderblock_ob(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @returns {boolean}
     */
    remove_cvd_regime_flip(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.chartengine_remove_cvd_regime_flip(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {string} id
     * @returns {boolean}
     */
    remove_cvd_trade_signal(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.chartengine_remove_cvd_trade_signal(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * @param {number} id
     */
    remove_drawing(id) {
        wasm.chartengine_remove_drawing(this.__wbg_ptr, id);
    }
    /**
     * @param {number} id
     */
    remove_marker(id) {
        wasm.chartengine_remove_marker(this.__wbg_ptr, id);
    }
    /**
     * @returns {number}
     */
    render() {
        const ret = wasm.chartengine_render(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Replace one session entirely (mirrors `cvd_session_close`). The
     * `buckets` payload uses the same `[p, b, s]*` layout.
     * @param {number} start
     * @param {number} end
     * @param {boolean} closed
     * @param {number} tick
     * @param {Float64Array} buckets
     */
    replace_cvd_profile_session(start, end, closed, tick, buckets) {
        const ptr0 = passArrayF64ToWasm0(buckets, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_replace_cvd_profile_session(this.__wbg_ptr, start, end, closed, tick, ptr0, len0);
    }
    /**
     * Reset an indicator pane's Y axis back to auto-scale.
     * @param {number} pane
     */
    reset_indicator_y_auto(pane) {
        wasm.chartengine_reset_indicator_y_auto(this.__wbg_ptr, pane);
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        wasm.chartengine_resize(this.__wbg_ptr, width, height);
    }
    /**
     * @param {number} val
     * @returns {number}
     */
    rsi_to_screen_y(val) {
        const ret = wasm.chartengine_rsi_to_screen_y(this.__wbg_ptr, val);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_agg_liq_y(sy) {
        const ret = wasm.chartengine_screen_to_agg_liq_y(this.__wbg_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_cvd_y(sy) {
        const ret = wasm.chartengine_screen_to_cvd_y(this.__wbg_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_fr_y(sy) {
        const ret = wasm.chartengine_screen_to_fr_y(this.__wbg_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_ob_flow_y(sy) {
        const ret = wasm.chartengine_screen_to_ob_flow_y(this.__wbg_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_oi_y(sy) {
        const ret = wasm.chartengine_screen_to_oi_y(this.__wbg_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_rsi_y(sy) {
        const ret = wasm.chartengine_screen_to_rsi_y(this.__wbg_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_vpin_y(sy) {
        const ret = wasm.chartengine_screen_to_vpin_y(this.__wbg_ptr, sy);
        return ret;
    }
    /**
     * @param {number} sx
     * @returns {number}
     */
    screen_to_world_x(sx) {
        const ret = wasm.chartengine_screen_to_world_x(this.__wbg_ptr, sx);
        return ret;
    }
    /**
     * @param {number} sy
     * @returns {number}
     */
    screen_to_world_y(sy) {
        const ret = wasm.chartengine_screen_to_world_y(this.__wbg_ptr, sy);
        return ret;
    }
    /**
     * @param {number} id
     */
    select_drawing(id) {
        wasm.chartengine_select_drawing(this.__wbg_ptr, id);
    }
    /**
     * @param {number} id
     */
    select_marker(id) {
        wasm.chartengine_select_marker(this.__wbg_ptr, id);
    }
    /**
     * Bulk set data. `flat` is a packed array of 6-tuples:
     * [ts, longUsd, shortUsd, longQty, shortQty, count] per bar.
     * @param {Float64Array} flat
     */
    set_agg_liq_data(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_agg_liq_data(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Set hovered kline index for header display. Pass -1 to clear.
     * @param {number} idx
     */
    set_agg_liq_hover(idx) {
        wasm.chartengine_set_agg_liq_hover(this.__wbg_ptr, idx);
    }
    /**
     * mode: 0 = USD, 1 = Qty
     * @param {number} mode
     */
    set_agg_liq_mode(mode) {
        wasm.chartengine_set_agg_liq_mode(this.__wbg_ptr, mode);
    }
    /**
     * @param {number} ratio
     */
    set_agg_liq_ratio(ratio) {
        wasm.chartengine_set_agg_liq_ratio(this.__wbg_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_agg_liq_show_long(show) {
        wasm.chartengine_set_agg_liq_show_long(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_agg_liq_show_short(show) {
        wasm.chartengine_set_agg_liq_show_short(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_agg_liq_show_signals(show) {
        wasm.chartengine_set_agg_liq_show_signals(this.__wbg_ptr, show);
    }
    /**
     * Replace all signals. Each signal is 6 consecutive f64:
     * `[ts_secs, kind(0..5), side(0=neutral,1=long,2=short), volumeUsd, ratio, confidence(0..1)]`.
     * @param {Float64Array} flat
     */
    set_agg_liq_signals(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_agg_liq_signals(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} show
     */
    set_agg_liq_signals_on_chart(show) {
        wasm.chartengine_set_agg_liq_signals_on_chart(this.__wbg_ptr, show);
    }
    /**
     * Set chart background color
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_background_color(r, g, b) {
        wasm.chartengine_set_background_color(this.__wbg_ptr, r, g, b);
    }
    /**
     * @param {boolean} enabled
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_bg_gradient(enabled, r, g, b) {
        wasm.chartengine_set_bg_gradient(this.__wbg_ptr, enabled, r, g, b);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_candle_bear_border_color(r, g, b) {
        wasm.chartengine_set_candle_bear_border_color(this.__wbg_ptr, r, g, b);
    }
    /**
     * Set candle bear color (body + wick)
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_candle_bear_color(r, g, b) {
        wasm.chartengine_set_candle_bear_color(this.__wbg_ptr, r, g, b);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_candle_bear_wick_color(r, g, b) {
        wasm.chartengine_set_candle_bear_wick_color(this.__wbg_ptr, r, g, b);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_candle_bull_border_color(r, g, b) {
        wasm.chartengine_set_candle_bull_border_color(this.__wbg_ptr, r, g, b);
    }
    /**
     * Set candle bull color (body + wick)
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_candle_bull_color(r, g, b) {
        wasm.chartengine_set_candle_bull_color(this.__wbg_ptr, r, g, b);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    set_candle_bull_wick_color(r, g, b) {
        wasm.chartengine_set_candle_bull_wick_color(this.__wbg_ptr, r, g, b);
    }
    /**
     * @param {number} seconds
     */
    set_candle_interval(seconds) {
        wasm.chartengine_set_candle_interval(this.__wbg_ptr, seconds);
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
        wasm.chartengine_set_channel_preview(this.__wbg_ptr, x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane);
    }
    /**
     * @param {number} ct
     */
    set_chart_type(ct) {
        wasm.chartengine_set_chart_type(this.__wbg_ptr, ct);
    }
    /**
     * @param {number} sx
     * @param {number} sy
     */
    set_crosshair(sx, sy) {
        wasm.chartengine_set_crosshair(this.__wbg_ptr, sx, sy);
    }
    /**
     * Set crosshair line color + derive label colors
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     */
    set_crosshair_color(r, g, b, a) {
        wasm.chartengine_set_crosshair_color(this.__wbg_ptr, r, g, b, a);
    }
    /**
     * Set crosshair style: 0 = dashed, 1 = solid, 2 = dotted
     * @param {number} style
     */
    set_crosshair_style(style) {
        wasm.chartengine_set_crosshair_style(this.__wbg_ptr, style);
    }
    /**
     * Set crosshair line width
     * @param {number} w
     */
    set_crosshair_width(w) {
        wasm.chartengine_set_crosshair_width(this.__wbg_ptr, w);
    }
    /**
     * @param {Float64Array} taker_buy_vol
     * @param {Float64Array} total_vol
     */
    set_cvd_data(taker_buy_vol, total_vol) {
        const ptr0 = passArrayF64ToWasm0(taker_buy_vol, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(total_vol, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_cvd_data(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} min
     */
    set_cvd_divergence_min_strength(min) {
        wasm.chartengine_set_cvd_divergence_min_strength(this.__wbg_ptr, min);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_divergence_show_band(show) {
        wasm.chartengine_set_cvd_divergence_show_band(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_divergence_show_hidden(show) {
        wasm.chartengine_set_cvd_divergence_show_hidden(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_divergence_show_labels(show) {
        wasm.chartengine_set_cvd_divergence_show_labels(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_divergence_show_long(show) {
        wasm.chartengine_set_cvd_divergence_show_long(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_divergence_show_regular(show) {
        wasm.chartengine_set_cvd_divergence_show_regular(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_divergence_show_short(show) {
        wasm.chartengine_set_cvd_divergence_show_short(this.__wbg_ptr, show);
    }
    /**
     * @param {number} mode
     */
    set_cvd_mode(mode) {
        wasm.chartengine_set_cvd_mode(this.__wbg_ptr, mode);
    }
    /**
     * Breaker visual intensity: `0` = outline-only (default), `1` =
     * light body fill + slightly brighter border, `2` = bold fill
     * matching live-OB intensity. Out-of-range values clamp to `2`
     * so a forward-compat extra mode never silently drops to OFF.
     * @param {number} style
     */
    set_cvd_orderblock_breaker_style(style) {
        wasm.chartengine_set_cvd_orderblock_breaker_style(this.__wbg_ptr, style);
    }
    /**
     * `255` = show every direction; otherwise one of the `DIR_*` codes
     * (0=bull / 1=bear / 2=neutral).
     * @param {number} dir
     */
    set_cvd_orderblock_direction_filter(dir) {
        wasm.chartengine_set_cvd_orderblock_direction_filter(this.__wbg_ptr, dir);
    }
    /**
     * User multiplier on the OB / GAP label font size. Shared with
     * `set_cvd_profile_label_size_scale` in the FE settings panel —
     * the bridge layer fans the same value out to both indicators
     * so a single "Label Size" dropdown drives every CVD-stack
     * label uniformly. Clamped to `[0.5, 2.0]`.
     * @param {number} scale
     */
    set_cvd_orderblock_label_size_scale(scale) {
        wasm.chartengine_set_cvd_orderblock_label_size_scale(this.__wbg_ptr, scale);
    }
    /**
     * @param {number} min
     */
    set_cvd_orderblock_min_score(min) {
        wasm.chartengine_set_cvd_orderblock_min_score(this.__wbg_ptr, min);
    }
    /**
     * `255` = show every mitigation mode; `0` = wick only, `1` = close only.
     * @param {number} mode
     */
    set_cvd_orderblock_mitigation_filter(mode) {
        wasm.chartengine_set_cvd_orderblock_mitigation_filter(this.__wbg_ptr, mode);
    }
    /**
     * Render-band selector — `0`=Cluster, `1`=Avg (default), `2`=Candle.
     * Mitigation is mode-independent on the BE so flipping this is
     * purely cosmetic. Unknown values fall back to `Avg`.
     * @param {number} mode
     */
    set_cvd_orderblock_render_mode(mode) {
        wasm.chartengine_set_cvd_orderblock_render_mode(this.__wbg_ptr, mode);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_orderblock_show_filled_gaps(show) {
        wasm.chartengine_set_cvd_orderblock_show_filled_gaps(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_orderblock_show_gaps(show) {
        wasm.chartengine_set_cvd_orderblock_show_gaps(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_orderblock_show_labels(show) {
        wasm.chartengine_set_cvd_orderblock_show_labels(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_orderblock_show_mitigated(show) {
        wasm.chartengine_set_cvd_orderblock_show_mitigated(this.__wbg_ptr, show);
    }
    /**
     * Show OB boxes (active fills, breaker outlines, midlines, OB
     * labels)? Independent of [`set_cvd_orderblock_show_gaps`] so the
     * trader can show FVG voids without their parent OBs (or vice-
     * versa). The indicator must still be enabled (via
     * [`enable_cvd_orderblock`]) for either gate to matter — that
     * switch decides whether the BE feed is subscribed and the local
     * FVG compute runs at all; this gate only suppresses OB render
     * passes (Pass 2/3/3.5/4 + OB-label subloop + OB hit-test).
     * @param {boolean} show
     */
    set_cvd_orderblock_show_obs(show) {
        wasm.chartengine_set_cvd_orderblock_show_obs(this.__wbg_ptr, show);
    }
    /**
     * Pin per-bucket bar height in pixels. `0` = auto (derive from tick
     * density). `>0` = use this exact pixel height regardless of how many
     * ticks fit in the visible Y range — solves the "auto collapses to
     * 2 px" case for instruments with small ticks (e.g. BTC at 5 USD over
     * a 60k vertical span). Clamped to `[0, 30]`.
     * @param {number} px
     */
    set_cvd_profile_bar_height_px(px) {
        wasm.chartengine_set_cvd_profile_bar_height_px(this.__wbg_ptr, px);
    }
    /**
     * Pin per-session max bar width in pixels. `0` = auto (derive from
     * `ratio × column_width`). `>0` = exact pixel width; bars overflow
     * the session column boundary, useful when each daily column is just
     * ~30 px wide on multi-day views. Clamped to `[0, 400]`.
     * @param {number} px
     */
    set_cvd_profile_bar_max_width_px(px) {
        wasm.chartengine_set_cvd_profile_bar_max_width_px(this.__wbg_ptr, px);
    }
    /**
     * User multiplier for the volume label font size. `1.0` keeps the
     * density-aware auto-scaling; lower values shrink labels (good for
     * dense layouts), higher values enlarge them (good for high-DPI
     * screens or screenshots). Clamped to `[0.5, 2.0]`.
     * @param {number} scale
     */
    set_cvd_profile_label_size_scale(scale) {
        wasm.chartengine_set_cvd_profile_label_size_scale(this.__wbg_ptr, scale);
    }
    /**
     * Cap of how wide one session's bar may grow as a fraction of its
     * session column width. Clamped to `[0.20, 0.95]`.
     * @param {number} ratio
     */
    set_cvd_profile_max_bar_ratio(ratio) {
        wasm.chartengine_set_cvd_profile_max_bar_ratio(this.__wbg_ptr, ratio);
    }
    /**
     * Bulk replace all sessions. See `CvdProfile::replace_sessions_flat`
     * for the flat-packed layout. Sent on initial snapshot or full refresh.
     * @param {Float64Array} flat
     */
    set_cvd_profile_sessions(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_cvd_profile_sessions(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_profile_show_anchors(show) {
        wasm.chartengine_set_cvd_profile_show_anchors(this.__wbg_ptr, show);
    }
    /**
     * Toggle the optional **Delta POC** marker — the bucket with
     * the largest `|buy − sell|` (net order-flow imbalance).
     * Different concept from the canonical POC; off by default.
     * See `CvdProfile.show_delta_poc` for the rationale.
     * @param {boolean} show
     */
    set_cvd_profile_show_delta_poc(show) {
        wasm.chartengine_set_cvd_profile_show_delta_poc(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_profile_show_poc(show) {
        wasm.chartengine_set_cvd_profile_show_poc(this.__wbg_ptr, show);
    }
    /**
     * Toggle the **stable** session POC line. Independent from the
     * dynamic POC outline (`show_poc`) — the line is computed once
     * from raw session buckets and does not move when the user
     * zooms or pans the chart. See `CvdProfile.show_session_poc_line`
     * for the rationale.
     * @param {boolean} show
     */
    set_cvd_profile_show_session_poc_line(show) {
        wasm.chartengine_set_cvd_profile_show_session_poc_line(this.__wbg_ptr, show);
    }
    /**
     * Profile theme: `0` = auto (follow chart Theme background), `1` =
     * force dark, `2` = force light. Other values fall back to auto so
     * older saved settings keep working.
     * @param {number} mode
     */
    set_cvd_profile_theme_mode(mode) {
        wasm.chartengine_set_cvd_profile_theme_mode(this.__wbg_ptr, mode);
    }
    /**
     * Toggle the per-row tooltip on crosshair hover. Disabling also
     * short-circuits `cvd_profile_hit_test` in the crosshair JSON
     * builder so we don't pay the per-bucket scan on every move.
     * Doesn't touch `enabled` (the indicator keeps rendering).
     * @param {boolean} enabled
     */
    set_cvd_profile_tooltip_enabled(enabled) {
        wasm.chartengine_set_cvd_profile_tooltip_enabled(this.__wbg_ptr, enabled);
    }
    /**
     * Toggle quote-asset (USD) display for profile labels. Bar shapes
     * stay proportional — only the formatted numbers change.
     * @param {boolean} in_quote
     */
    set_cvd_profile_value_in_quote(in_quote) {
        wasm.chartengine_set_cvd_profile_value_in_quote(this.__wbg_ptr, in_quote);
    }
    /**
     * 0 = signed CVD, 1 = total volume, 2 = split (sells left / buys right).
     * @param {number} mode
     */
    set_cvd_profile_view_mode(mode) {
        wasm.chartengine_set_cvd_profile_view_mode(this.__wbg_ptr, mode);
    }
    /**
     * @param {number} ratio
     */
    set_cvd_ratio(ratio) {
        wasm.chartengine_set_cvd_ratio(this.__wbg_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_regime_show_flip_lines(show) {
        wasm.chartengine_set_cvd_regime_show_flip_lines(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_regime_show_ribbon(show) {
        wasm.chartengine_set_cvd_regime_show_ribbon(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_regime_show_wash(show) {
        wasm.chartengine_set_cvd_regime_show_wash(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_show_delta(show) {
        wasm.chartengine_set_cvd_show_delta(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_show_divergence(show) {
        wasm.chartengine_set_cvd_show_divergence(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_show_signals(show) {
        wasm.chartengine_set_cvd_show_signals(this.__wbg_ptr, show);
    }
    /**
     * @param {number} mode
     */
    set_cvd_source(mode) {
        wasm.chartengine_set_cvd_source(this.__wbg_ptr, mode);
    }
    /**
     * @param {Float64Array} taker_buy_vol
     * @param {Float64Array} total_vol
     */
    set_cvd_spot_data(taker_buy_vol, total_vol) {
        const ptr0 = passArrayF64ToWasm0(taker_buy_vol, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(total_vol, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_cvd_spot_data(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} min
     */
    set_cvd_trade_signals_min_confidence(min) {
        wasm.chartengine_set_cvd_trade_signals_min_confidence(this.__wbg_ptr, min);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_absorption_resolution(show) {
        wasm.chartengine_set_cvd_trade_signals_show_absorption_resolution(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_breakout(show) {
        wasm.chartengine_set_cvd_trade_signals_show_breakout(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_delta_trap(show) {
        wasm.chartengine_set_cvd_trade_signals_show_delta_trap(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_divergence(show) {
        wasm.chartengine_set_cvd_trade_signals_show_divergence(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_labels(show) {
        wasm.chartengine_set_cvd_trade_signals_show_labels(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_levels(show) {
        wasm.chartengine_set_cvd_trade_signals_show_levels(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_long(show) {
        wasm.chartengine_set_cvd_trade_signals_show_long(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_rejection(show) {
        wasm.chartengine_set_cvd_trade_signals_show_rejection(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_cvd_trade_signals_show_short(show) {
        wasm.chartengine_set_cvd_trade_signals_show_short(this.__wbg_ptr, show);
    }
    /**
     * @param {number} id
     * @param {boolean} dashed
     */
    set_drawing_dashed(id, dashed) {
        wasm.chartengine_set_drawing_dashed(this.__wbg_ptr, id, dashed);
    }
    /**
     * @param {number} id
     * @param {boolean} flip
     */
    set_drawing_flip_left(id, flip) {
        wasm.chartengine_set_drawing_flip_left(this.__wbg_ptr, id, flip);
    }
    /**
     * @param {number} id
     * @param {number} font_size
     */
    set_drawing_font_size(id, font_size) {
        wasm.chartengine_set_drawing_font_size(this.__wbg_ptr, id, font_size);
    }
    /**
     * @param {number} id
     * @param {boolean} hide
     */
    set_drawing_hide_label(id, hide) {
        wasm.chartengine_set_drawing_hide_label(this.__wbg_ptr, id, hide);
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
        wasm.chartengine_set_drawing_preview(this.__wbg_ptr, kind, x1, y1, x2, y2, r, g, b, line_width, dashed, pane);
    }
    /**
     * @param {number} id
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     */
    set_drawing_style(id, r, g, b, line_width) {
        wasm.chartengine_set_drawing_style(this.__wbg_ptr, id, r, g, b, line_width);
    }
    /**
     * @param {number} id
     * @param {string} text
     */
    set_drawing_text(id, text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_drawing_text(this.__wbg_ptr, id, ptr0, len0);
    }
    /**
     * @param {number} id
     * @param {boolean} wrap
     */
    set_drawing_text_wrap(id, wrap) {
        wasm.chartengine_set_drawing_text_wrap(this.__wbg_ptr, id, wrap);
    }
    /**
     * Toggle rendering of all user drawings and in-progress drawing previews.
     * Drawings and their state remain in memory — only the render pass is
     * skipped, so toggling back on restores them immediately. When hiding,
     * any active selection is cleared so the edit popup doesn't linger
     * anchored to an invisible drawing.
     * @param {boolean} v
     */
    set_drawings_visible(v) {
        wasm.chartengine_set_drawings_visible(this.__wbg_ptr, v);
    }
    /**
     * @param {number} wx
     * @param {number} wy
     */
    set_elliott_manual_cursor(wx, wy) {
        wasm.chartengine_set_elliott_manual_cursor(this.__wbg_ptr, wx, wy);
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
        wasm.chartengine_set_elliott_preview(this.__wbg_ptr, x, y, r, g, b, lw, pane);
    }
    /**
     * @param {number} len
     */
    set_es_ema1_len(len) {
        wasm.chartengine_set_es_ema1_len(this.__wbg_ptr, len);
    }
    /**
     * @param {number} len
     */
    set_es_ema2_len(len) {
        wasm.chartengine_set_es_ema2_len(this.__wbg_ptr, len);
    }
    /**
     * @param {boolean} show
     */
    set_es_show_bos(show) {
        wasm.chartengine_set_es_show_bos(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_es_show_ema1(show) {
        wasm.chartengine_set_es_show_ema1(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_es_show_ema2(show) {
        wasm.chartengine_set_es_show_ema2(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_es_show_wma(show) {
        wasm.chartengine_set_es_show_wma(this.__wbg_ptr, show);
    }
    /**
     * @param {number} len
     */
    set_es_swing_len(len) {
        wasm.chartengine_set_es_swing_len(this.__wbg_ptr, len);
    }
    /**
     * @param {number} len
     */
    set_es_wma_len(len) {
        wasm.chartengine_set_es_wma_len(this.__wbg_ptr, len);
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
        wasm.chartengine_set_fib_ext_preview(this.__wbg_ptr, x1, y1, x2, y2, x3, y3, r, g, b, line_width, _dashed, pane);
    }
    /**
     * Set font size for axis labels and general text
     * @param {number} size
     */
    set_font_size(size) {
        wasm.chartengine_set_font_size(this.__wbg_ptr, size);
    }
    /**
     * @param {number} tick
     */
    set_footprint_tick_size(tick) {
        wasm.chartengine_set_footprint_tick_size(this.__wbg_ptr, tick);
    }
    /**
     * @param {number} mode
     */
    set_forex_signals_mode(mode) {
        wasm.chartengine_set_forex_signals_mode(this.__wbg_ptr, mode);
    }
    /**
     * @param {boolean} is_btc_5m
     */
    set_forex_signals_setup(is_btc_5m) {
        wasm.chartengine_set_forex_signals_setup(this.__wbg_ptr, is_btc_5m);
    }
    /**
     * @param {boolean} show
     */
    set_forex_signals_show_stats(show) {
        wasm.chartengine_set_forex_signals_show_stats(this.__wbg_ptr, show);
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} values
     */
    set_fr_agg_data(timestamps, values) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_fr_agg_data(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} values
     */
    set_fr_binance_data(timestamps, values) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_fr_binance_data(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} ratio
     */
    set_fr_ratio(ratio) {
        wasm.chartengine_set_fr_ratio(this.__wbg_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_fr_show_agg(show) {
        wasm.chartengine_set_fr_show_agg(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_fr_show_sma(show) {
        wasm.chartengine_set_fr_show_sma(this.__wbg_ptr, show);
    }
    /**
     * Set grid line color
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     */
    set_grid_color(r, g, b, a) {
        wasm.chartengine_set_grid_color(this.__wbg_ptr, r, g, b, a);
    }
    /**
     * @param {boolean} v
     */
    set_grid_h_visible(v) {
        wasm.chartengine_set_grid_h_visible(this.__wbg_ptr, v);
    }
    /**
     * @param {boolean} v
     */
    set_grid_v_visible(v) {
        wasm.chartengine_set_grid_v_visible(this.__wbg_ptr, v);
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
        const ptr0 = passArrayF64ToWasm0(matrix, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_heatmap(this.__wbg_ptr, ptr0, len0, rows, cols, x_start, x_step, y_start, y_step);
    }
    /**
     * @param {number} scheme
     */
    set_heatmap_color_scheme(scheme) {
        wasm.chartengine_set_heatmap_color_scheme(this.__wbg_ptr, scheme);
    }
    /**
     * Store the server-reported total volume max so that progressive chunk
     * loading produces stable heatmap colours from the first rendered chunk.
     * Does NOT mark dirty — this only affects future normalization, not current pixels.
     * @param {number} max
     */
    set_heatmap_prefetch_range(max) {
        wasm.chartengine_set_heatmap_prefetch_range(this.__wbg_ptr, max);
    }
    /**
     * Brightness multiplier for the heatmap depth profile bars. Typical
     * presets: 0.6 dim / 1.0 normal / 1.4 bright / 1.8 vivid. Clamped
     * into a safe range inside the renderer.
     * @param {number} mul
     */
    set_heatmap_profile_brightness(mul) {
        wasm.chartengine_set_heatmap_profile_brightness(this.__wbg_ptr, mul);
    }
    /**
     * @param {number} min
     * @param {number} max
     */
    set_heatmap_range(min, max) {
        wasm.chartengine_set_heatmap_range(this.__wbg_ptr, min, max);
    }
    /**
     * @param {boolean} show
     */
    set_heatmap_show_profile(show) {
        wasm.chartengine_set_heatmap_show_profile(this.__wbg_ptr, show);
    }
    /**
     * Set heatmap wall data from flat array. Stride is auto-detected:
     *   - 11 (legacy)
     *   - 14 (enriched-v1, deprecated): legacy + swingQualified + swingFillProb + swingOutcome
     *   - 15 (enriched-v2, current):    legacy + swingQualified + swingFillProb
     *                                   + swingFillBucket(0/1/2) + swingOutcome
     * See HeatmapProfileWalls::set_from_flat docs for full layouts.
     * @param {Float64Array} flat
     */
    set_heatmap_walls(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_heatmap_walls(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} price
     */
    set_hover_price(price) {
        wasm.chartengine_set_hover_price(this.__wbg_ptr, price);
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
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(prices, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(visible_sizes, wasm.__wbindgen_export2);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF64ToWasm0(hidden_sizes, wasm.__wbindgen_export2);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArray8ToWasm0(is_bids, wasm.__wbindgen_export2);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArray32ToWasm0(refill_counts, wasm.__wbindgen_export2);
        const len5 = WASM_VECTOR_LEN;
        wasm.chartengine_set_iceberg_events(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
    }
    /**
     * Toggle rendering of all indicator layers (on-chart overlays and
     * indicator sub-panes: RSI, OI, CVD, VPIN, OB flow, Agg-Liq, etc.).
     * Indicator data and toggles are preserved; only the render calls are
     * gated. Base chart (candles/renko/footprint, volume, axes, grid, price
     * line, crosshair, orderbook heatmap) continues to render.
     * @param {boolean} v
     */
    set_indicators_visible(v) {
        wasm.chartengine_set_indicators_visible(this.__wbg_ptr, v);
    }
    /**
     * Toggle rendering of the kline base chart (candlesticks / footprint
     * cells / renko bricks — whichever `chart_type` is active). Volume
     * pane, indicators, drawings, axes, grid, crosshair and orderbook
     * heatmap all keep rendering. Use this when the user wants to focus
     * on indicator overlays / heatmap / orderbook flow without the OHLC
     * noise underneath. Streaming data is untouched, so toggling back
     * on restores the chart instantly without a re-fetch.
     * @param {boolean} v
     */
    set_kline_visible(v) {
        wasm.chartengine_set_kline_visible(this.__wbg_ptr, v);
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
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(open, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(high, wasm.__wbindgen_export2);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF64ToWasm0(low, wasm.__wbindgen_export2);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArrayF64ToWasm0(close, wasm.__wbindgen_export2);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArrayF64ToWasm0(volume, wasm.__wbindgen_export2);
        const len5 = WASM_VECTOR_LEN;
        wasm.chartengine_set_klines(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
    }
    /**
     * @param {Float64Array} flat
     */
    set_large_trades_data(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_large_trades_data(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Set license state from JS bridge. Token must match hash to prevent direct bypass.
     * state: 0 = licensed, 1 = trial, 2 = expired
     * @param {number} state
     * @param {number} days
     * @param {number} token
     */
    set_license_state(state, days, token) {
        wasm.chartengine_set_license_state(this.__wbg_ptr, state, days, token);
    }
    /**
     * @param {number} mult
     */
    set_liq_heatmap_cell_height(mult) {
        wasm.chartengine_set_liq_heatmap_cell_height(this.__wbg_ptr, mult);
    }
    /**
     * @param {number} pct
     */
    set_liq_heatmap_filled_pct(pct) {
        wasm.chartengine_set_liq_heatmap_filled_pct(this.__wbg_ptr, pct);
    }
    /**
     * @param {boolean} show
     */
    set_liq_heatmap_filled_zones(show) {
        wasm.chartengine_set_liq_heatmap_filled_zones(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_liq_heatmap_predictions(show) {
        wasm.chartengine_set_liq_heatmap_predictions(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_liq_heatmap_profile(show) {
        wasm.chartengine_set_liq_heatmap_profile(this.__wbg_ptr, show);
    }
    /**
     * @param {number} min
     * @param {number} max
     */
    set_liq_heatmap_range(min, max) {
        wasm.chartengine_set_liq_heatmap_range(this.__wbg_ptr, min, max);
    }
    /**
     * @param {Float64Array} flat
     */
    set_live_signals_data(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_live_signals_data(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} leverage
     */
    set_live_signals_leverage(leverage) {
        wasm.chartengine_set_live_signals_leverage(this.__wbg_ptr, leverage);
    }
    /**
     * @param {boolean} loading
     */
    set_live_signals_loading(loading) {
        wasm.chartengine_set_live_signals_loading(this.__wbg_ptr, loading);
    }
    /**
     * @param {number} pip_value
     */
    set_live_signals_pip_value(pip_value) {
        wasm.chartengine_set_live_signals_pip_value(this.__wbg_ptr, pip_value);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_entry(show) {
        wasm.chartengine_set_live_signals_show_entry(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_labels(show) {
        wasm.chartengine_set_live_signals_show_labels(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_max_profit(show) {
        wasm.chartengine_set_live_signals_show_max_profit(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_tp_sl(show) {
        wasm.chartengine_set_live_signals_show_tp_sl(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_live_signals_show_zones(show) {
        wasm.chartengine_set_live_signals_show_zones(this.__wbg_ptr, show);
    }
    /**
     * @param {number} size
     */
    set_live_signals_text_size(size) {
        wasm.chartengine_set_live_signals_text_size(this.__wbg_ptr, size);
    }
    /**
     * @param {boolean} is_trial
     */
    set_live_signals_trial(is_trial) {
        wasm.chartengine_set_live_signals_trial(this.__wbg_ptr, is_trial);
    }
    /**
     * @param {number} scale
     */
    set_lt_bubble_scale(scale) {
        wasm.chartengine_set_lt_bubble_scale(this.__wbg_ptr, scale);
    }
    /**
     * @param {number} min
     * @param {number} max
     */
    set_lt_volume_filter(min, max) {
        wasm.chartengine_set_lt_volume_filter(this.__wbg_ptr, min, max);
    }
    /**
     * 0 None, 1 BUY, 2 SELL, 3 Both
     * @param {number} mode
     */
    set_mrd_pullback_entry_mode(mode) {
        wasm.chartengine_set_mrd_pullback_entry_mode(this.__wbg_ptr, mode);
    }
    /**
     * Replace the HTF (higher-timeframe) klines used by the HTF advanced
     * signal pipeline.  Arrays must be the same length.  Call when the user
     * switches chart timeframe, symbol, or the HTF preset.
     * @param {Float64Array} timestamps
     * @param {Float64Array} open
     * @param {Float64Array} high
     * @param {Float64Array} low
     * @param {Float64Array} close
     * @param {Float64Array} volume
     */
    set_mrd_pullback_htf_klines(timestamps, open, high, low, close, volume) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(open, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(high, wasm.__wbindgen_export2);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF64ToWasm0(low, wasm.__wbindgen_export2);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArrayF64ToWasm0(close, wasm.__wbindgen_export2);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArrayF64ToWasm0(volume, wasm.__wbindgen_export2);
        const len5 = WASM_VECTOR_LEN;
        wasm.chartengine_set_mrd_pullback_htf_klines(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
    }
    /**
     * @param {boolean} show
     */
    set_mrd_pullback_show_hidden_div(show) {
        wasm.chartengine_set_mrd_pullback_show_hidden_div(this.__wbg_ptr, show);
    }
    /**
     * 0 None, 1 S/R Volume
     * @param {number} mode
     */
    set_mrd_pullback_sr_mode(mode) {
        wasm.chartengine_set_mrd_pullback_sr_mode(this.__wbg_ptr, mode);
    }
    /**
     * 0 Tiny, 1 Small, 2 Normal, 3 Large
     * @param {number} size
     */
    set_mrd_pullback_text_size(size) {
        wasm.chartengine_set_mrd_pullback_text_size(this.__wbg_ptr, size);
    }
    /**
     * 0 Current timeframe, 1..=9 HTF presets.  JS owns the interval mapping
     * and pushes HTF klines via `set_mrd_pullback_htf_klines`.
     * @param {number} mode
     */
    set_mrd_pullback_tf_mode(mode) {
        wasm.chartengine_set_mrd_pullback_tf_mode(this.__wbg_ptr, mode);
    }
    /**
     * 0 None, 1 Position (double-Supertrend)
     * @param {number} mode
     */
    set_mrd_pullback_trend_mode(mode) {
        wasm.chartengine_set_mrd_pullback_trend_mode(this.__wbg_ptr, mode);
    }
    /**
     * @param {Float64Array} flat
     */
    set_obf_data(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_obf_data(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} ratio
     */
    set_obf_ratio(ratio) {
        wasm.chartengine_set_obf_ratio(this.__wbg_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_obf_show_cum_delta(show) {
        wasm.chartengine_set_obf_show_cum_delta(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_obf_show_net_flow(show) {
        wasm.chartengine_set_obf_show_net_flow(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_obf_show_obi(show) {
        wasm.chartengine_set_obf_show_obi(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} top_right
     */
    set_obm_anchor_top_right(top_right) {
        wasm.chartengine_set_obm_anchor_top_right(this.__wbg_ptr, top_right);
    }
    /**
     * @param {number} absorption_bid
     * @param {number} absorption_ask
     * @param {number} spoof_score
     * @param {number} vpin
     * @param {number} bid_pressure
     * @param {number} ask_pressure
     * @param {number} trade_imbalance
     * @param {number} spread_z1m
     * @param {number} buy_volume
     * @param {number} sell_volume
     * @param {number} trade_rate
     * @param {number} large_buys
     * @param {number} large_sells
     */
    set_obm_data(absorption_bid, absorption_ask, spoof_score, vpin, bid_pressure, ask_pressure, trade_imbalance, spread_z1m, buy_volume, sell_volume, trade_rate, large_buys, large_sells) {
        wasm.chartengine_set_obm_data(this.__wbg_ptr, absorption_bid, absorption_ask, spoof_score, vpin, bid_pressure, ask_pressure, trade_imbalance, spread_z1m, buy_volume, sell_volume, trade_rate, large_buys, large_sells);
    }
    /**
     * @param {number} price
     */
    set_obs_com(price) {
        wasm.chartengine_set_obs_com(this.__wbg_ptr, price);
    }
    /**
     * @param {Float64Array} bid_gaps
     * @param {Float64Array} ask_gaps
     */
    set_obs_gaps(bid_gaps, ask_gaps) {
        const ptr0 = passArrayF64ToWasm0(bid_gaps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(ask_gaps, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_obs_gaps(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {boolean} show
     */
    set_obs_show_alerts(show) {
        wasm.chartengine_set_obs_show_alerts(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_obs_show_com(show) {
        wasm.chartengine_set_obs_show_com(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_obs_show_gaps(show) {
        wasm.chartengine_set_obs_show_gaps(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_obs_show_walls(show) {
        wasm.chartengine_set_obs_show_walls(this.__wbg_ptr, show);
    }
    /**
     * @param {Float64Array} bid_walls
     * @param {Float64Array} ask_walls
     */
    set_obs_walls(bid_walls, ask_walls) {
        const ptr0 = passArrayF64ToWasm0(bid_walls, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(ask_walls, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_obs_walls(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {Float64Array} values
     */
    set_oi_data(values) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_oi_data(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {Float64Array} timestamps
     * @param {Float64Array} values
     */
    set_oi_data_ts(timestamps, values) {
        const ptr0 = passArrayF64ToWasm0(timestamps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_oi_data_ts(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} mode
     */
    set_oi_display_mode(mode) {
        wasm.chartengine_set_oi_display_mode(this.__wbg_ptr, mode);
    }
    /**
     * @param {number} ratio
     */
    set_oi_ratio(ratio) {
        wasm.chartengine_set_oi_ratio(this.__wbg_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_oi_show_on_chart(show) {
        wasm.chartengine_set_oi_show_on_chart(this.__wbg_ptr, show);
    }
    /**
     * @param {number} wx
     * @param {number} wy
     */
    set_path_cursor(wx, wy) {
        wasm.chartengine_set_path_cursor(this.__wbg_ptr, wx, wy);
    }
    /**
     * @param {number} decimals
     */
    set_price_precision(decimals) {
        wasm.chartengine_set_price_precision(this.__wbg_ptr, decimals);
    }
    /**
     * Store wall-clock timestamps for Forex gap-free rendering.
     * Must be called after `set_klines` with the same length.
     * @param {Float64Array} real_ts
     */
    set_real_timestamps(real_ts) {
        const ptr0 = passArrayF64ToWasm0(real_ts, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_set_real_timestamps(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} hovered
     */
    set_replay_hovered(hovered) {
        wasm.chartengine_set_replay_hovered(this.__wbg_ptr, hovered);
    }
    /**
     * @param {number} screen_x
     */
    set_replay_preview(screen_x) {
        wasm.chartengine_set_replay_preview(this.__wbg_ptr, screen_x);
    }
    /**
     * @param {boolean} active
     * @param {number} current
     * @param {number} total
     */
    set_replay_state(active, current, total) {
        wasm.chartengine_set_replay_state(this.__wbg_ptr, active, current, total);
    }
    /**
     * @param {number} period
     */
    set_rsi_period(period) {
        wasm.chartengine_set_rsi_period(this.__wbg_ptr, period);
    }
    /**
     * @param {number} ratio
     */
    set_rsi_ratio(ratio) {
        wasm.chartengine_set_rsi_ratio(this.__wbg_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_divergence(show) {
        wasm.chartengine_set_rsi_show_divergence(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_ema(show) {
        wasm.chartengine_set_rsi_show_ema(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_levels(show) {
        wasm.chartengine_set_rsi_show_levels(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_on_chart(show) {
        wasm.chartengine_set_rsi_show_on_chart(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_signals(show) {
        wasm.chartengine_set_rsi_show_signals(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_traps(show) {
        wasm.chartengine_set_rsi_show_traps(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_rsi_show_wma(show) {
        wasm.chartengine_set_rsi_show_wma(this.__wbg_ptr, show);
    }
    /**
     * @param {number} val
     */
    set_rsi_smoothing(val) {
        wasm.chartengine_set_rsi_smoothing(this.__wbg_ptr, val);
    }
    /**
     * @param {boolean} show
     */
    set_si_show_icebergs(show) {
        wasm.chartengine_set_si_show_icebergs(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_si_show_stops(show) {
        wasm.chartengine_set_si_show_stops(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_si_show_zones(show) {
        wasm.chartengine_set_si_show_zones(this.__wbg_ptr, show);
    }
    /**
     * @param {number} extend
     */
    set_sr_fvg_extend(extend) {
        wasm.chartengine_set_sr_fvg_extend(this.__wbg_ptr, extend);
    }
    /**
     * @param {boolean} show
     */
    set_sr_fvg_htf(show) {
        wasm.chartengine_set_sr_fvg_htf(this.__wbg_ptr, show);
    }
    /**
     * @param {number} mode
     */
    set_sr_fvg_mitigation(mode) {
        wasm.chartengine_set_sr_fvg_mitigation(this.__wbg_ptr, mode);
    }
    /**
     * @param {number} theme
     */
    set_sr_fvg_theme(theme) {
        wasm.chartengine_set_sr_fvg_theme(this.__wbg_ptr, theme);
    }
    /**
     * @param {number} minutes
     */
    set_sr_htf_minutes(minutes) {
        wasm.chartengine_set_sr_htf_minutes(this.__wbg_ptr, minutes);
    }
    /**
     * @param {number} mode
     */
    set_sr_mitigation(mode) {
        wasm.chartengine_set_sr_mitigation(this.__wbg_ptr, mode);
    }
    /**
     * @param {number} count
     */
    set_sr_ob_last(count) {
        wasm.chartengine_set_sr_ob_last(this.__wbg_ptr, count);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_breakers(show) {
        wasm.chartengine_set_sr_show_breakers(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_fvg(show) {
        wasm.chartengine_set_sr_show_fvg(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_fvg_signals(show) {
        wasm.chartengine_set_sr_show_fvg_signals(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_htf_ob(show) {
        wasm.chartengine_set_sr_show_htf_ob(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_metrics(show) {
        wasm.chartengine_set_sr_show_metrics(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_ob(show) {
        wasm.chartengine_set_sr_show_ob(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_ob_activity(show) {
        wasm.chartengine_set_sr_show_ob_activity(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_ob_signals(show) {
        wasm.chartengine_set_sr_show_ob_signals(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_predict(show) {
        wasm.chartengine_set_sr_show_predict(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_sr_show_smart_rev(show) {
        wasm.chartengine_set_sr_show_smart_rev(this.__wbg_ptr, show);
    }
    /**
     * @param {number} minutes
     */
    set_sr_smart_rev_htf(minutes) {
        wasm.chartengine_set_sr_smart_rev_htf(this.__wbg_ptr, minutes);
    }
    /**
     * @param {number} pos
     */
    set_sr_stats_position(pos) {
        wasm.chartengine_set_sr_stats_position(this.__wbg_ptr, pos);
    }
    /**
     * @param {number} stats_type
     */
    set_sr_stats_type(stats_type) {
        wasm.chartengine_set_sr_stats_type(this.__wbg_ptr, stats_type);
    }
    /**
     * @param {number} size
     */
    set_sr_text_size(size) {
        wasm.chartengine_set_sr_text_size(this.__wbg_ptr, size);
    }
    /**
     * Switch theme: 0 = dark, 1 = light
     * @param {number} id
     */
    set_theme(id) {
        wasm.chartengine_set_theme(this.__wbg_ptr, id);
    }
    /**
     * @param {boolean} enabled
     */
    set_touch_mode(enabled) {
        wasm.chartengine_set_touch_mode(this.__wbg_ptr, enabled);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_ib(show) {
        wasm.chartengine_set_tpo_ib(this.__wbg_ptr, show);
    }
    /**
     * @param {number} minutes
     */
    set_tpo_ib_minutes(minutes) {
        wasm.chartengine_set_tpo_ib_minutes(this.__wbg_ptr, minutes);
    }
    /**
     * @param {number} minutes
     */
    set_tpo_letter_minutes(minutes) {
        wasm.chartengine_set_tpo_letter_minutes(this.__wbg_ptr, minutes);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_naked_poc(show) {
        wasm.chartengine_set_tpo_naked_poc(this.__wbg_ptr, show);
    }
    /**
     * @param {number} minutes
     */
    set_tpo_period(minutes) {
        wasm.chartengine_set_tpo_period(this.__wbg_ptr, minutes);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_poc_line(show) {
        wasm.chartengine_set_tpo_poc_line(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_profile_shape(show) {
        wasm.chartengine_set_tpo_profile_shape(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_signals(show) {
        wasm.chartengine_set_tpo_signals(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_single_prints(show) {
        wasm.chartengine_set_tpo_single_prints(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_tpo_va_lines(show) {
        wasm.chartengine_set_tpo_va_lines(this.__wbg_ptr, show);
    }
    /**
     * @param {number} mode
     */
    set_volume_color_mode(mode) {
        wasm.chartengine_set_volume_color_mode(this.__wbg_ptr, mode);
    }
    /**
     * @param {number} period
     */
    set_volume_ma_period(period) {
        wasm.chartengine_set_volume_ma_period(this.__wbg_ptr, period);
    }
    /**
     * @param {boolean} show
     */
    set_volume_show_ma(show) {
        wasm.chartengine_set_volume_show_ma(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_volume_show_signals(show) {
        wasm.chartengine_set_volume_show_signals(this.__wbg_ptr, show);
    }
    /**
     * @param {number} size
     */
    set_vpin_bucket_size(size) {
        wasm.chartengine_set_vpin_bucket_size(this.__wbg_ptr, size);
    }
    /**
     * @param {Float64Array} taker_buy_vol
     * @param {Float64Array} total_vol
     */
    set_vpin_data(taker_buy_vol, total_vol) {
        const ptr0 = passArrayF64ToWasm0(taker_buy_vol, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(total_vol, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_vpin_data(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} count
     */
    set_vpin_num_buckets(count) {
        wasm.chartengine_set_vpin_num_buckets(this.__wbg_ptr, count);
    }
    /**
     * @param {number} ratio
     */
    set_vpin_ratio(ratio) {
        wasm.chartengine_set_vpin_ratio(this.__wbg_ptr, ratio);
    }
    /**
     * @param {boolean} show
     */
    set_vpin_show_sma(show) {
        wasm.chartengine_set_vpin_show_sma(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_vpin_show_zones(show) {
        wasm.chartengine_set_vpin_show_zones(this.__wbg_ptr, show);
    }
    /**
     * @param {number} threshold
     */
    set_vpin_threshold(threshold) {
        wasm.chartengine_set_vpin_threshold(this.__wbg_ptr, threshold);
    }
    /**
     * Provide real per-bar taker-buy / total-volume data for VRVP. When this
     * data is set VRVP splits buy vs sell using the actual exchange ratio
     * instead of estimating direction from candle close vs open. Index-aligned
     * with `KlineData`. Same arrays used by CVD / VPIN can be reused.
     * @param {Float64Array} taker_buy_vol
     * @param {Float64Array} total_vol
     */
    set_vrvp_data(taker_buy_vol, total_vol) {
        const ptr0 = passArrayF64ToWasm0(taker_buy_vol, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(total_vol, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_set_vrvp_data(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {boolean} show
     */
    set_vrvp_poc_line(show) {
        wasm.chartengine_set_vrvp_poc_line(this.__wbg_ptr, show);
    }
    /**
     * @param {number} n_candles
     */
    show_latest(n_candles) {
        wasm.chartengine_show_latest(this.__wbg_ptr, n_candles);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} line_width
     * @param {number} pane
     */
    start_brush(r, g, b, line_width, pane) {
        wasm.chartengine_start_brush(this.__wbg_ptr, r, g, b, line_width, pane);
    }
    /**
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} lw
     * @param {number} pane
     */
    start_elliott_manual(r, g, b, lw, pane) {
        wasm.chartengine_start_elliott_manual(this.__wbg_ptr, r, g, b, lw, pane);
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
        wasm.chartengine_start_path(this.__wbg_ptr, r, g, b, line_width, dashed, pane);
    }
    /**
     * @param {number} anchor
     * @param {number} wx
     * @param {number} wy
     */
    update_drawing_anchor(anchor, wx, wy) {
        wasm.chartengine_update_drawing_anchor(this.__wbg_ptr, anchor, wx, wy);
    }
    /**
     * @param {number} col
     * @param {Float64Array} values
     */
    update_heatmap_column(col, values) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_update_heatmap_column(this.__wbg_ptr, col, ptr0, len0);
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
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_update_heatmap_column_at(this.__wbg_ptr, ptr0, len0, timestamp, y_start, y_step);
    }
    /**
     * Overwrite the last column of the heatmap (forming candle update).
     * @param {Float64Array} values
     * @param {number} y_start
     * @param {number} y_step
     */
    update_last_heatmap_column(values, y_start, y_step) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_update_last_heatmap_column(this.__wbg_ptr, ptr0, len0, y_start, y_step);
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
        wasm.chartengine_update_last_kline(this.__wbg_ptr, ts, o, h, l, c, v);
    }
    /**
     * Incremental HTF tick: replace the in-progress HTF bar.  Called from
     * the kline websocket handler when a new HTF tick arrives.
     * @param {number} ts
     * @param {number} o
     * @param {number} h
     * @param {number} l
     * @param {number} c
     * @param {number} v
     */
    update_mrd_pullback_last_htf_kline(ts, o, h, l, c, v) {
        wasm.chartengine_update_mrd_pullback_last_htf_kline(this.__wbg_ptr, ts, o, h, l, c, v);
    }
    /**
     * @param {string} id
     * @param {number} kind
     * @param {number} direction
     * @param {number} from_sec
     * @param {number} price_from
     * @param {number} to_sec
     * @param {number} price_to
     * @param {number} cvd_from
     * @param {number} cvd_to
     * @param {number} strength
     * @param {number} valid_until_sec
     */
    upsert_cvd_divergence(id, kind, direction, from_sec, price_from, to_sec, price_to, cvd_from, cvd_to, strength, valid_until_sec) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_upsert_cvd_divergence(this.__wbg_ptr, ptr0, len0, kind, direction, from_sec, price_from, to_sec, price_to, cvd_from, cvd_to, strength, valid_until_sec);
    }
    /**
     * Insert or replace one OB. The BE sends the full record on both
     * `cvd_ob_new` and `cvd_ob_break` (the difference is the per-mode
     * mitigation flags), so the bridge calls this for both events.
     * `cvd_ob_break` may fire **twice** per OB under rev 3 — once when
     * the wick rule trips and once when the close rule confirms — and
     * each event re-pushes the full record so the latest values
     * always overwrite.
     * @param {string} id
     * @param {number} direction
     * @param {number} source_kind
     * @param {number} session_res_ms
     * @param {number} session_start_sec
     * @param {number} price_top
     * @param {number} price_btm
     * @param {number} price_avg
     * @param {number} tick
     * @param {number} candle_hi
     * @param {number} candle_lo
     * @param {number} candle_start_sec
     * @param {number} avg_top
     * @param {number} avg_btm
     * @param {number} opened_at_sec
     * @param {number} extend_until_sec
     * @param {number} total_vol
     * @param {number} buy_vol
     * @param {number} sell_vol
     * @param {number} delta
     * @param {number} buy_share
     * @param {number} sell_share
     * @param {number} delta_pct
     * @param {number} buckets
     * @param {number} score
     * @param {number} test_count
     * @param {boolean} confirmed
     * @param {number} range_pos
     * @param {boolean} healthy
     * @param {boolean} mitigated_wick
     * @param {boolean} mitigated_close
     * @param {number} mitigated_wick_at_sec
     * @param {number} mitigated_close_at_sec
     * @param {number} created_at_sec
     * @param {number} updated_at_sec
     */
    upsert_cvd_orderblock_ob(id, direction, source_kind, session_res_ms, session_start_sec, price_top, price_btm, price_avg, tick, candle_hi, candle_lo, candle_start_sec, avg_top, avg_btm, opened_at_sec, extend_until_sec, total_vol, buy_vol, sell_vol, delta, buy_share, sell_share, delta_pct, buckets, score, test_count, confirmed, range_pos, healthy, mitigated_wick, mitigated_close, mitigated_wick_at_sec, mitigated_close_at_sec, created_at_sec, updated_at_sec) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_upsert_cvd_orderblock_ob(this.__wbg_ptr, ptr0, len0, direction, source_kind, session_res_ms, session_start_sec, price_top, price_btm, price_avg, tick, candle_hi, candle_lo, candle_start_sec, avg_top, avg_btm, opened_at_sec, extend_until_sec, total_vol, buy_vol, sell_vol, delta, buy_share, sell_share, delta_pct, buckets, score, test_count, confirmed, range_pos, healthy, mitigated_wick, mitigated_close, mitigated_wick_at_sec, mitigated_close_at_sec, created_at_sec, updated_at_sec);
    }
    /**
     * @param {string} id
     * @param {number} window_end_sec
     * @param {number} window_start_sec
     * @param {number} from_bias
     * @param {number} to_bias
     * @param {number} bias_share
     * @param {number} window_bars
     * @param {number} valid_until_sec
     */
    upsert_cvd_regime_flip(id, window_end_sec, window_start_sec, from_bias, to_bias, bias_share, window_bars, valid_until_sec) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.chartengine_upsert_cvd_regime_flip(this.__wbg_ptr, ptr0, len0, window_end_sec, window_start_sec, from_bias, to_bias, bias_share, window_bars, valid_until_sec);
    }
    /**
     * @param {string} id
     * @param {number} direction
     * @param {number} trigger
     * @param {number} candle_start_sec
     * @param {number} candle_high
     * @param {number} candle_low
     * @param {number} entry
     * @param {number} stop
     * @param {number} target1
     * @param {number} target2
     * @param {number} rr_t1
     * @param {number} rr_t2
     * @param {number} confidence
     * @param {number} bias4h
     * @param {number} confluence_count
     * @param {number} valid_until_sec
     * @param {number} primary_zone_lo
     * @param {number} primary_zone_hi
     * @param {number} primary_zone_score
     * @param {number} primary_anchor_ms
     * @param {string} reason
     */
    upsert_cvd_trade_signal(id, direction, trigger, candle_start_sec, candle_high, candle_low, entry, stop, target1, target2, rr_t1, rr_t2, confidence, bias4h, confluence_count, valid_until_sec, primary_zone_lo, primary_zone_hi, primary_zone_score, primary_anchor_ms, reason) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(reason, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        wasm.chartengine_upsert_cvd_trade_signal(this.__wbg_ptr, ptr0, len0, direction, trigger, candle_start_sec, candle_high, candle_low, entry, stop, target1, target2, rr_t1, rr_t2, confidence, bias4h, confluence_count, valid_until_sec, primary_zone_lo, primary_zone_hi, primary_zone_score, primary_anchor_ms, ptr1, len1);
    }
    /**
     * @param {number} val
     * @returns {number}
     */
    vpin_to_screen_y(val) {
        const ret = wasm.chartengine_vpin_to_screen_y(this.__wbg_ptr, val);
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
            wasm.chartengine_vrvp_hit_test(retptr, this.__wbg_ptr, sx, sy);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} wx
     * @returns {number}
     */
    world_to_screen_x(wx) {
        const ret = wasm.chartengine_world_to_screen_x(this.__wbg_ptr, wx);
        return ret;
    }
    /**
     * @param {number} wy
     * @returns {number}
     */
    world_to_screen_y(wy) {
        const ret = wasm.chartengine_world_to_screen_y(this.__wbg_ptr, wy);
        return ret;
    }
    /**
     * @param {number} screen_x
     * @param {number} screen_y
     * @param {number} factor
     */
    zoom(screen_x, screen_y, factor) {
        wasm.chartengine_zoom(this.__wbg_ptr, screen_x, screen_y, factor);
    }
    /**
     * Zoom the Y axis of a specific indicator sub-pane.
     * @param {number} pane
     * @param {number} screen_y
     * @param {number} factor
     */
    zoom_indicator_y(pane, screen_y, factor) {
        wasm.chartengine_zoom_indicator_y(this.__wbg_ptr, pane, screen_y, factor);
    }
    /**
     * @param {number} screen_x
     * @param {number} factor
     */
    zoom_x(screen_x, factor) {
        wasm.chartengine_zoom_x(this.__wbg_ptr, screen_x, factor);
    }
    /**
     * @param {number} screen_y
     * @param {number} factor
     */
    zoom_y(screen_y, factor) {
        wasm.chartengine_zoom_y(this.__wbg_ptr, screen_y, factor);
    }
}
if (Symbol.dispose) ChartEngine.prototype[Symbol.dispose] = ChartEngine.prototype.free;

export class OrderbookEngine {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OrderbookEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_orderbookengine_free(ptr, 0);
    }
    center_on_mid() {
        wasm.orderbookengine_center_on_mid(this.__wbg_ptr);
    }
    clear() {
        wasm.orderbookengine_clear(this.__wbg_ptr);
    }
    clear_hover() {
        wasm.orderbookengine_clear_hover(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    get_command_buffer_len() {
        const ret = wasm.orderbookengine_get_command_buffer_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_command_buffer_ptr() {
        const ret = wasm.orderbookengine_get_command_buffer_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_hover_price() {
        const ret = wasm.orderbookengine_get_hover_price(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_hover_qty() {
        const ret = wasm.orderbookengine_get_hover_qty(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_hover_side() {
        const ret = wasm.orderbookengine_get_hover_side(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_theme() {
        const ret = wasm.orderbookengine_get_theme(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_dirty() {
        const ret = wasm.orderbookengine_is_dirty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        const ret = wasm.orderbookengine_new(width, height);
        this.__wbg_ptr = ret >>> 0;
        OrderbookEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} dp
     */
    pan_y(dp) {
        wasm.orderbookengine_pan_y(this.__wbg_ptr, dp);
    }
    /**
     * @param {Float64Array} bids
     * @param {Float64Array} asks
     * @param {number} mid
     */
    push_heatmap_col(bids, asks, mid) {
        const ptr0 = passArrayF64ToWasm0(bids, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(asks, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.orderbookengine_push_heatmap_col(this.__wbg_ptr, ptr0, len0, ptr1, len1, mid);
    }
    /**
     * @param {Float64Array} bids
     * @param {Float64Array} asks
     * @param {number} mid
     */
    push_snapshot(bids, asks, mid) {
        const ptr0 = passArrayF64ToWasm0(bids, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(asks, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.orderbookengine_push_snapshot(this.__wbg_ptr, ptr0, len0, ptr1, len1, mid);
    }
    /**
     * @returns {number}
     */
    render() {
        const ret = wasm.orderbookengine_render(this.__wbg_ptr);
        return ret >>> 0;
    }
    reset_ring() {
        wasm.orderbookengine_reset_ring(this.__wbg_ptr);
    }
    /**
     * @param {number} w
     * @param {number} h
     */
    resize(w, h) {
        wasm.orderbookengine_resize(this.__wbg_ptr, w, h);
    }
    /**
     * @param {boolean} a
     */
    set_auto_center(a) {
        wasm.orderbookengine_set_auto_center(this.__wbg_ptr, a);
    }
    /**
     * @param {Float64Array} bids
     * @param {Float64Array} asks
     * @param {number} mid
     */
    set_depth_book(bids, asks, mid) {
        const ptr0 = passArrayF64ToWasm0(bids, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(asks, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.orderbookengine_set_depth_book(this.__wbg_ptr, ptr0, len0, ptr1, len1, mid);
    }
    /**
     * @param {number} n
     */
    set_exchange_count(n) {
        wasm.orderbookengine_set_exchange_count(this.__wbg_ptr, n);
    }
    /**
     * @param {string} labels_csv
     */
    set_exchange_labels(labels_csv) {
        const ptr0 = passStringToWasm0(labels_csv, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.orderbookengine_set_exchange_labels(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} mul
     */
    set_heatmap_alpha_mul(mul) {
        wasm.orderbookengine_set_heatmap_alpha_mul(this.__wbg_ptr, mul);
    }
    /**
     * @param {number} n
     */
    set_heatmap_cols(n) {
        wasm.orderbookengine_set_heatmap_cols(this.__wbg_ptr, n);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    set_hover(x, y) {
        wasm.orderbookengine_set_hover(this.__wbg_ptr, x, y);
    }
    /**
     * @param {number} y
     */
    set_hover_y(y) {
        wasm.orderbookengine_set_hover_y(this.__wbg_ptr, y);
    }
    /**
     * @param {number} d
     */
    set_price_precision(d) {
        wasm.orderbookengine_set_price_precision(this.__wbg_ptr, d);
    }
    /**
     * @param {number} c
     * @param {number} r
     */
    set_ring_capacity(c, r) {
        wasm.orderbookengine_set_ring_capacity(this.__wbg_ptr, c, r);
    }
    /**
     * @param {boolean} show
     */
    set_show_cumulative(show) {
        wasm.orderbookengine_set_show_cumulative(this.__wbg_ptr, show);
    }
    /**
     * @param {boolean} show
     */
    set_show_signal_overlays(show) {
        wasm.orderbookengine_set_show_signal_overlays(this.__wbg_ptr, show);
    }
    /**
     * @param {number} bid
     * @param {number} ask
     */
    set_signal_absorption(bid, ask) {
        wasm.orderbookengine_set_signal_absorption(this.__wbg_ptr, bid, ask);
    }
    /**
     * @param {number} net_flow
     * @param {number} cum_delta
     */
    set_signal_flow(net_flow, cum_delta) {
        wasm.orderbookengine_set_signal_flow(this.__wbg_ptr, net_flow, cum_delta);
    }
    /**
     * Gaps: interleaved [lo, hi, lo, hi, ...]
     * @param {Float64Array} bid_gaps
     * @param {Float64Array} ask_gaps
     */
    set_signal_gaps(bid_gaps, ask_gaps) {
        const ptr0 = passArrayF64ToWasm0(bid_gaps, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(ask_gaps, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.orderbookengine_set_signal_gaps(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * @param {number} obi
     * @param {number} bid_p
     * @param {number} ask_p
     */
    set_signal_obi(obi, bid_p, ask_p) {
        wasm.orderbookengine_set_signal_obi(this.__wbg_ptr, obi, bid_p, ask_p);
    }
    /**
     * @param {number} score
     */
    set_signal_spoof(score) {
        wasm.orderbookengine_set_signal_spoof(this.__wbg_ptr, score);
    }
    /**
     * Walls: interleaved [price, qty, price, qty, ...]
     * @param {Float64Array} bid_walls
     * @param {Float64Array} ask_walls
     */
    set_signal_walls(bid_walls, ask_walls) {
        const ptr0 = passArrayF64ToWasm0(bid_walls, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(ask_walls, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.orderbookengine_set_signal_walls(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * When the trading pair changes, clear depth/heatmap buffers so grouping (tick) applies to
     * fresh prices. Otherwise `set_tick_size` is a no-op if tick is unchanged (same e.g. 0.5).
     * @param {string} s
     */
    set_symbol(s) {
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.orderbookengine_set_symbol(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} id
     */
    set_theme(id) {
        wasm.orderbookengine_set_theme(this.__wbg_ptr, id);
    }
    /**
     * @param {number} t
     */
    set_tick_size(t) {
        wasm.orderbookengine_set_tick_size(this.__wbg_ptr, t);
    }
    /**
     * @param {number} t
     */
    set_visible_ticks(t) {
        wasm.orderbookengine_set_visible_ticks(this.__wbg_ptr, t);
    }
    /**
     * @param {number} f
     * @param {number} ay
     */
    zoom_y(f, ay) {
        wasm.orderbookengine_zoom_y(this.__wbg_ptr, f, ay);
    }
}
if (Symbol.dispose) OrderbookEngine.prototype[Symbol.dispose] = OrderbookEngine.prototype.free;

export class TickEngine {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TickEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tickengine_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    chart_height_px() {
        const ret = wasm.tickengine_chart_height_px(this.__wbg_ptr);
        return ret;
    }
    /**
     * Top-left corner of the chart-body rectangle (CSS px). Useful for
     * interactive overlays the parent might want to draw outside the
     * canvas (e.g. floating tooltips).
     * @returns {number}
     */
    chart_left_px() {
        const ret = wasm.tickengine_chart_left_px(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    chart_top_px() {
        const ret = wasm.tickengine_chart_top_px(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    chart_width_px() {
        const ret = wasm.tickengine_chart_width_px(this.__wbg_ptr);
        return ret;
    }
    clear() {
        wasm.tickengine_clear(this.__wbg_ptr);
    }
    clear_hover() {
        wasm.tickengine_clear_hover(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    get_command_buffer_len() {
        const ret = wasm.tickengine_get_command_buffer_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_command_buffer_ptr() {
        const ret = wasm.tickengine_get_command_buffer_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Latest mid price (for JS to sync trade panel / bridge state).
     * @returns {number}
     */
    get_last_mid() {
        const ret = wasm.tickengine_get_last_mid(this.__wbg_ptr);
        return ret;
    }
    /**
     * Hit-test a screen pixel and return a zone code so the bridge can
     * route gestures without duplicating layout knowledge.
     * Matches `ChartEngine::hit_zone` codes used in `eventMouse.js`:
     *   • 0   = chart body (Main)
     *   • 2   = X axis (bottom)
     *   • 3   = Y axis (right)
     *   • 255 = outside / not over canvas
     * @param {number} sx
     * @param {number} sy
     * @returns {number}
     */
    hit_zone(sx, sy) {
        const ret = wasm.tickengine_hit_zone(this.__wbg_ptr, sx, sy);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    is_dirty() {
        const ret = wasm.tickengine_is_dirty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        const ret = wasm.tickengine_new(width, height);
        this.__wbg_ptr = ret >>> 0;
        TickEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Drag-pan the time axis by `dx_px` screen pixels.
     *
     * Sign convention:
     *   • `dx_px > 0` (drag right-to-left in screen coords →) = look
     *     INTO the past; `right_offset_ms` increases.
     *   • `dx_px < 0` (drag left-to-right ←) = look TOWARD or PAST live;
     *     `right_offset_ms` decreases. Going negative is allowed up to
     *     `MAX_FUTURE_FRAC × span` so the user can drag the live tip
     *     INTO the chart and leave empty space on the right — the
     *     standard "free pan" gesture in TradingView / Bookmap /
     *     flowsurface. New depth + trades keep flowing in; the live
     *     tip is then visible mid-chart instead of pinned to the right
     *     edge.
     *
     * Bounds:
     *   • upper: `lookback_ms − span` (don't show before our oldest data)
     *   • lower: `−MAX_FUTURE_FRAC × span` (free-pan future buffer)
     * @param {number} dx_px
     */
    pan_x(dx_px) {
        wasm.tickengine_pan_x(this.__wbg_ptr, dx_px);
    }
    /**
     * @param {number} dy_px
     */
    pan_y(dy_px) {
        wasm.tickengine_pan_y(this.__wbg_ptr, dy_px);
    }
    /**
     * Push an aggregated orderbook snapshot for the current wall-clock ms.
     * `bids`/`asks` are interleaved [price, qty, price, qty, ...].
     * @param {number} t_ms
     * @param {Float64Array} bids
     * @param {Float64Array} asks
     * @param {number} mid
     */
    push_book(t_ms, bids, asks, mid) {
        const ptr0 = passArrayF64ToWasm0(bids, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(asks, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.tickengine_push_book(this.__wbg_ptr, t_ms, ptr0, len0, ptr1, len1, mid);
    }
    /**
     * Push a single trade. `side`: 0 = buy aggressor, 1 = sell aggressor.
     * @param {number} t_ms
     * @param {number} price
     * @param {number} qty
     * @param {number} side
     */
    push_trade(t_ms, price, qty, side) {
        wasm.tickengine_push_trade(this.__wbg_ptr, t_ms, price, qty, side);
    }
    /**
     * Batch trades to amortise WASM call overhead.
     * `flat`: [t_ms, price, qty, side, t_ms, price, qty, side, ...].
     * @param {Float64Array} flat
     */
    push_trades_batch(flat) {
        const ptr0 = passArrayF64ToWasm0(flat, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        wasm.tickengine_push_trades_batch(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {number}
     */
    render() {
        const ret = wasm.tickengine_render(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Re-anchor everything to "live + default span + auto-scale Y" —
     * equivalent to the Flowsurface `R` keystroke / double-click on axis.
     */
    reset_view() {
        wasm.tickengine_reset_view(this.__wbg_ptr);
    }
    /**
     * Re-engage Y auto-scale (centers the latest mid in the screen).
     * Called by the JS bridge on Y-axis double-click — same gesture
     * flowsurface uses (`AxisScaleClicked::Y` in `chart.rs:296`).
     */
    reset_y_auto() {
        wasm.tickengine_reset_y_auto(this.__wbg_ptr);
    }
    /**
     * @param {number} w
     * @param {number} h
     */
    resize(w, h) {
        wasm.tickengine_resize(this.__wbg_ptr, w, h);
    }
    /**
     * @param {boolean} v
     */
    set_auto_scale_y(v) {
        wasm.tickengine_set_auto_scale_y(this.__wbg_ptr, v);
    }
    /**
     * Force the chart to track / un-track the live tip.
     *
     * `true`: snap `right_offset_ms` to 0 (right edge glued to live)
     *         AND clear any free-pan future buffer the user may have
     *         dragged in.
     * `false`: leave the current right-offset alone — the caller is
     *          opting out of auto-scroll without changing the visible
     *          window.
     * @param {boolean} v
     */
    set_follow_live(v) {
        wasm.tickengine_set_follow_live(this.__wbg_ptr, v);
    }
    /**
     * Set the heatmap intensity window — equivalent to the dual-handle
     * slider on the orderbook chart. `min_pct` and `max_pct` are
     * fractions of `book.smooth_max()`. Values are clamped so that
     * `0 ≤ min ≤ 0.99` and `min + 0.01 ≤ max ≤ 1` to keep the
     * renderer's divide-by-(max-min) numerically stable.
     * @param {number} min_pct
     * @param {number} max_pct
     */
    set_heatmap_intensity(min_pct, max_pct) {
        wasm.tickengine_set_heatmap_intensity(this.__wbg_ptr, min_pct, max_pct);
    }
    /**
     * Pick one of 5 built-in heatmap colour presets (indices 0..=4).
     * Out-of-range values silently fall back to 0 so the JS bridge can't
     * crash the engine by passing a stale config.
     * @param {number} idx
     */
    set_heatmap_palette(idx) {
        wasm.tickengine_set_heatmap_palette(this.__wbg_ptr, idx);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    set_hover(x, y) {
        wasm.tickengine_set_hover(this.__wbg_ptr, x, y);
    }
    /**
     * Toggle 3-D bubble rendering for large trades. When false, ALL
     * trades render as flat alpha-blended circles (cheaper, flatter
     * look). When true, trades whose radius exceeds the renderer's
     * `LARGE_BUBBLE_RADIUS_PX` switch to the glossy `Bubble3D` command.
     * @param {boolean} enabled
     */
    set_large_trade_3d(enabled) {
        wasm.tickengine_set_large_trade_3d(this.__wbg_ptr, enabled);
    }
    /**
     * Uniformly scale the trade-bubble size across the trade-tape pass.
     * Affects `MIN_TRADE_RADIUS`, `MAX_TRADE_RADIUS`, the LARGE-bubble
     * cutoff, and the volume-label radius threshold — everything moves
     * together so the relative classification ("when does a print get
     * a 3-D bubble + volume label?") is preserved at any scale.
     * Clamped to `[0.5, 2.5]` to keep the largest trades within the
     * chart's vertical column at default zoom.
     * @param {number} scale
     */
    set_large_trade_scale(scale) {
        wasm.tickengine_set_large_trade_scale(this.__wbg_ptr, scale);
    }
    /**
     * Reconfigure lookback + cell width.
     *
     * `lookback_ms` is the maximum amount of history the user may
     * scroll back through. `cell_ms` controls trade-tape bucket width
     * AND is forwarded to the book as the run-extension `aggr_time`.
     * The book itself doesn't pre-allocate (it's a BTree) — this call
     * only resizes the tape ring + nudges the visible span if the
     * previous span exceeded the new lookback.
     *
     * **Stream-speed change semantics** (flowsurface `set_basis` parity,
     * `flowsurface-main 3/src/chart/heatmap.rs:294`):
     * when `cell_ms` actually changes we must wipe the tape AND the
     * book runs because every existing OrderRun was built with the
     * PREVIOUS aggr-time tolerance — keeping them around mixes runs
     * of incompatible scales and produces ghost streaks at the
     * transition boundary. We also snap the viewport back to "live +
     * auto-Y" so the user immediately sees fresh data flowing in
     * rather than empty space at their old zoom level. The book and
     * tape repopulate from the next live snapshot/tick — typically
     * within one frame on Binance's ~100 ms cadence.
     * @param {number} lookback_ms
     * @param {number} cell_ms
     */
    set_lookback(lookback_ms, cell_ms) {
        wasm.tickengine_set_lookback(this.__wbg_ptr, lookback_ms, cell_ms);
    }
    /**
     * @param {number} decimals
     */
    set_price_precision(decimals) {
        wasm.tickengine_set_price_precision(this.__wbg_ptr, decimals);
    }
    /**
     * @param {boolean} v
     */
    set_show_book_heatmap(v) {
        wasm.tickengine_set_show_book_heatmap(this.__wbg_ptr, v);
    }
    /**
     * @param {boolean} v
     */
    set_show_grid(v) {
        wasm.tickengine_set_show_grid(this.__wbg_ptr, v);
    }
    /**
     * @param {boolean} v
     */
    set_show_latest_profile(v) {
        wasm.tickengine_set_show_latest_profile(this.__wbg_ptr, v);
    }
    /**
     * @param {boolean} v
     */
    set_show_trade_tape(v) {
        wasm.tickengine_set_show_trade_tape(this.__wbg_ptr, v);
    }
    /**
     * Show / hide the volume strip at the bottom of the chart. The
     * strip overlays the chart area (does NOT shrink it) so toggling
     * preserves the user's price viewport. Mirrors flowsurface's
     * `HeatmapIndicator::Volume` study.
     * @param {boolean} v
     */
    set_show_volume(v) {
        wasm.tickengine_set_show_volume(this.__wbg_ptr, v);
    }
    /**
     * @param {boolean} v
     */
    set_show_vwap(v) {
        wasm.tickengine_set_show_vwap(this.__wbg_ptr, v);
    }
    /**
     * @param {number} id
     */
    set_theme(id) {
        wasm.tickengine_set_theme(this.__wbg_ptr, id);
    }
    /**
     * @param {number} tick
     */
    set_tick_size(tick) {
        wasm.tickengine_set_tick_size(this.__wbg_ptr, tick);
    }
    /**
     * Height of the bottom time axis in CSS px. Used by the bridge to
     * detect "drag started inside the x-axis" → zoom X instead of pan.
     * @returns {number}
     */
    xaxis_height_px() {
        const ret = wasm.tickengine_xaxis_height_px(this.__wbg_ptr);
        return ret;
    }
    /**
     * Width of the right-side price axis in CSS px. Used by the bridge
     * to detect "drag started inside the y-axis" → zoom Y instead of pan.
     * @returns {number}
     */
    yaxis_width_px() {
        const ret = wasm.tickengine_yaxis_width_px(this.__wbg_ptr);
        return ret;
    }
    /**
     * Uniform zoom around a cursor pixel — the canonical "scroll-to-zoom"
     * gesture (matches `ChartEngine::zoom` in `engine/viewport_ops.rs:7`).
     * Both the world-time AND world-price under `(screen_x, screen_y)`
     * stay anchored across the zoom.
     * @param {number} screen_x
     * @param {number} screen_y
     * @param {number} factor
     */
    zoom(screen_x, screen_y, factor) {
        wasm.tickengine_zoom(this.__wbg_ptr, screen_x, screen_y, factor);
    }
    /**
     * Zoom the time axis around an anchor in screen-pixel space.
     *
     * **Argument order matches `ChartEngine::zoom_x` (`(screen_x, factor)`)**
     * — see `engine/viewport_ops.rs:15`. JS bridges across all engines
     * (candle, orderbook, tick) therefore call zoom in the same shape.
     *
     * `factor < 1.0` zooms IN  (cells widen, less time visible).
     * `factor > 1.0` zooms OUT (cells narrow, more time visible).
     * `screen_x` is the cursor's x in chart-area coordinates — the world
     * time at that pixel stays fixed across the zoom, exactly like
     * Flowsurface (`Message::XScaling` in `chart.rs:345`).
     *
     * Span clamped to `[4 × cell_ms, lookback_ms]`.
     * @param {number} screen_x
     * @param {number} factor
     */
    zoom_x(screen_x, factor) {
        wasm.tickengine_zoom_x(this.__wbg_ptr, screen_x, factor);
    }
    /**
     * Zoom the price axis around an anchor pixel, clamping the visible
     * price band so each tick row stays in `[MIN_ROW_PX, MAX_ROW_PX]`
     * screen pixels — same envelope flowsurface enforces with
     * `cell_height ∈ [1, 10]` (`heatmap.rs:37-38`).
     *
     * **Argument order matches `ChartEngine::zoom_y` (`(screen_y, factor)`)**
     * so the JS bridges can be written uniformly across all engines —
     * see `engine/viewport_ops.rs:23`.
     *
     * `factor < 1.0` zooms IN  (rows grow taller, fewer ticks visible).
     * `factor > 1.0` zooms OUT (rows shrink, more ticks visible).
     * `screen_y` is the cursor's chart-area y; the world price under
     * that pixel stays anchored across the zoom.
     * @param {number} screen_y
     * @param {number} factor
     */
    zoom_y(screen_y, factor) {
        wasm.tickengine_zoom_y(this.__wbg_ptr, screen_y, factor);
    }
}
if (Symbol.dispose) TickEngine.prototype[Symbol.dispose] = TickEngine.prototype.free;

export function wasm_init() {
    wasm.wasm_init();
}

/**
 * @returns {any}
 */
export function wasm_memory() {
    const ret = wasm.wasm_memory();
    return takeObject(ret);
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_memory_edb3f01e3930bbf6: function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        },
        __wbg___wbindgen_throw_6ddd609b62940d55: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_export(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return addHeapObject(ret);
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = getObject(arg1).stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
    };
    return {
        __proto__: null,
        "./chart_engine_bg.js": import0,
    };
}

const ChartEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chartengine_free(ptr >>> 0, 1));
const OrderbookEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_orderbookengine_free(ptr >>> 0, 1));
const TickEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tickengine_free(ptr >>> 0, 1));

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
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedInt32ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
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

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
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
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
