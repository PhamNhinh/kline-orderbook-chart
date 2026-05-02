/* tslint:disable */
/* eslint-disable */

export class ChartEngine {
    free(): void;
    [Symbol.dispose](): void;
    add_anchored_vwap(anchor_x: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): number;
    add_arrow(x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, line_width: number, dashed: boolean, pane: number): number;
    add_arrow_marker_down(x: number, y: number, r: number, g: number, b: number, _font_size: number, pane: number): number;
    add_arrow_marker_up(x: number, y: number, r: number, g: number, b: number, _font_size: number, pane: number): number;
    add_brush_point(wx: number, wy: number): void;
    add_circle(cx: number, cy: number, ex: number, ey: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): number;
    /**
     * Adds an Elliott Impulse Wave (1-2-3-4-5) drawing.
     */
    add_elliott_impulse(click_x: number, click_y: number, r: number, g: number, b: number, _font_size: number, pane: number): number;
    /**
     * Add a point. Returns true when all 6 points collected (auto-finish).
     */
    add_elliott_manual_point(wx: number, wy: number): boolean;
    add_fib_extension(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): number;
    add_fib_retracement(x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, line_width: number, dashed: boolean, pane: number): number;
    add_horizontal_line(x: number, price: number, r: number, g: number, b: number, line_width: number, dashed: boolean, pane: number): number;
    add_long_position(x1: number, entry: number, x2: number, tp: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): number;
    add_marker(timestamp: number, price: number, is_bid: boolean): void;
    add_parallel_channel(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): number;
    add_path_point(wx: number, wy: number): void;
    add_price_label(x: number, y: number, r: number, g: number, b: number, font_size: number, pane: number): number;
    add_price_range(x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, line_width: number, dashed: boolean, pane: number): number;
    add_short_position(x1: number, entry: number, x2: number, tp: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): number;
    add_text_note(x: number, y: number, r: number, g: number, b: number, font_size: number, pane: number): number;
    add_trendline(x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, line_width: number, dashed: boolean, pane: number): number;
    /**
     * Return the hovered bar as a JSON string (or empty when out of range).
     */
    agg_liq_bar_json(idx: number): string;
    agg_liq_to_screen_y(val: number): number;
    /**
     * Append a brand-new column (new candle) to the heatmap.
     */
    append_heatmap_column(values: Float64Array, col_timestamp: number, y_start: number, y_step: number): void;
    append_kline(ts: number, o: number, h: number, l: number, c: number, v: number): void;
    /**
     * Append a single real timestamp (call after `append_kline` for Forex).
     */
    append_real_timestamp(real_ts: number): void;
    /**
     * Apply an incremental per-bucket update for one session. `buckets` is
     * `[p, b, s]*` flat-packed. Used for `cvd_session_update` after the
     * bridge has aggregated 1h source data into the user's chosen anchor.
     */
    apply_cvd_profile_update(start: number, end: number, tick: number, buckets: Float64Array): void;
    cancel_brush(): void;
    cancel_elliott_manual(): void;
    cancel_path(): void;
    chart_area_h(): number;
    chart_area_w(): number;
    /**
     * Get chart area dimensions for custom clipping.
     */
    chart_area_x(): number;
    chart_area_y(): number;
    clear_agg_liq(): void;
    clear_agg_liq_signals(): void;
    clear_channel_preview(): void;
    clear_cvd_divergence(): void;
    /**
     * Clear OBs **and** the locally-computed gap cache. The next
     * `recompute_indicators()` pass will regenerate gaps from the
     * kline series, so this is mostly useful when wiping state on
     * symbol switch / disable.
     */
    clear_cvd_orderblock_all(): void;
    clear_cvd_orderblock_obs(): void;
    clear_cvd_profile(): void;
    clear_cvd_regime(): void;
    clear_cvd_trade_signals(): void;
    clear_drawing_preview(): void;
    clear_drawings(): void;
    clear_elliott_preview(): void;
    clear_fib_ext_preview(): void;
    clear_heatmap_prefetch_range(): void;
    clear_heatmap_walls(): void;
    clear_hover_price(): void;
    clear_large_trades(): void;
    clear_live_signals(): void;
    clear_markers(): void;
    clear_mrd_pullback_htf_klines(): void;
    clear_ob_flow(): void;
    clear_ob_micro(): void;
    clear_ob_signals(): void;
    /**
     * Draw a filled band between two series (e.g. Bollinger Bands).
     * Upper and lower are value arrays aligned to kline timestamps.
     */
    custom_band(upper: Float64Array, lower: Float64Array, r: number, g: number, b: number, a: number): void;
    custom_begin(): void;
    /**
     * Draw a circle in screen coordinates.
     */
    custom_circle_px(cx: number, cy: number, radius: number, fr: number, fg: number, fb: number, fa: number, sr: number, sg: number, sb: number, sa: number, line_width: number): void;
    custom_clip_rect(x: number, y: number, w: number, h: number): void;
    custom_command_count(): number;
    /**
     * Draw a dashed horizontal line at a price level.
     */
    custom_dashed_hline(price: number, r: number, g: number, b: number, a: number, line_width: number, dash_len: number, gap_len: number): void;
    custom_end(): void;
    /**
     * Draw a filled rect in screen coordinates.
     */
    custom_fill_rect_px(x: number, y: number, w: number, h: number, r: number, g: number, b: number, a: number): void;
    /**
     * Draw a horizontal line at a price level across the full chart width.
     */
    custom_hline(price: number, r: number, g: number, b: number, a: number, line_width: number): void;
    /**
     * Draw a line in screen coordinates.
     */
    custom_line_px(x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, a: number, line_width: number): void;
    /**
     * Draw a marker (circle) at a specific candle index and price.
     */
    custom_marker(index: number, price: number, r: number, g: number, b: number, a: number, radius: number): void;
    /**
     * Draw a down-triangle marker at a candle index.
     */
    custom_marker_down(index: number, price: number, r: number, g: number, b: number, a: number, size: number): void;
    /**
     * Draw an up-triangle marker at a candle index.
     */
    custom_marker_up(index: number, price: number, r: number, g: number, b: number, a: number, size: number): void;
    /**
     * Draw text at a world-coordinate price level (at the right edge).
     */
    custom_price_label(price: number, text: string, r: number, g: number, b: number, a: number, font_size: number): void;
    custom_restore(): void;
    /**
     * Save/Restore canvas state in custom buffer (for clipping etc.)
     */
    custom_save(): void;
    /**
     * Draw a dashed data series line. Same as series_line but with dash pattern.
     */
    custom_series_dashed_line(values: Float64Array, r: number, g: number, b: number, a: number, line_width: number, dash_len: number, gap_len: number): void;
    /**
     * Draw a data series as a polyline. `values` is aligned to kline timestamps.
     * NaN values create gaps. Converts world→screen automatically.
     */
    custom_series_line(values: Float64Array, r: number, g: number, b: number, a: number, line_width: number): void;
    /**
     * Draw a stroked rect in screen coordinates.
     */
    custom_stroke_rect_px(x: number, y: number, w: number, h: number, r: number, g: number, b: number, a: number, line_width: number): void;
    /**
     * Draw text at a candle index and price.
     */
    custom_text(index: number, price: number, text: string, r: number, g: number, b: number, a: number, font_size: number, align: number): void;
    /**
     * Draw text in screen coordinates.
     */
    custom_text_px(x: number, y: number, text: string, r: number, g: number, b: number, a: number, font_size: number, align: number): void;
    cvd_divergence_count(): number;
    cvd_divergence_hit_test(sx: number, sy: number): string;
    cvd_orderblock_gap_count(): number;
    cvd_orderblock_hit_test(sx: number, sy: number): string;
    cvd_orderblock_ob_count(): number;
    cvd_profile_hit_test(sx: number, sy: number): string;
    cvd_regime_flip_count(): number;
    cvd_regime_hit_test(sx: number, sy: number): string;
    cvd_trade_signal_count(): number;
    cvd_trade_signals_hit_test(sx: number, sy: number): string;
    delta_histogram_enabled(): boolean;
    deselect_drawing(): void;
    deselect_marker(): void;
    disable_agg_liq(): void;
    disable_cvd(): void;
    disable_cvd_divergence(): void;
    disable_cvd_orderblock(): void;
    disable_cvd_profile(): void;
    disable_cvd_regime(): void;
    disable_cvd_trade_signals(): void;
    disable_delta_histogram(): void;
    disable_ema_structure(): void;
    disable_forex_signals(): void;
    disable_funding_rate(): void;
    disable_large_trades(): void;
    disable_liq_heatmap(): void;
    disable_live_signals(): void;
    disable_mrd_pullback(): void;
    disable_ob_flow(): void;
    disable_ob_micro(): void;
    disable_ob_signals(): void;
    disable_oi(): void;
    disable_rsi(): void;
    disable_smart_ranges(): void;
    disable_stop_iceberg(): void;
    disable_tpo(): void;
    disable_volume(): void;
    disable_vpin(): void;
    disable_vrvp(): void;
    drawing_count(): number;
    enable_agg_liq(): void;
    enable_cvd(): void;
    enable_cvd_divergence(): void;
    enable_cvd_orderblock(): void;
    enable_cvd_profile(): void;
    enable_cvd_regime(): void;
    enable_cvd_trade_signals(): void;
    enable_delta_histogram(): void;
    enable_ema_structure(): void;
    enable_forex_signals(): void;
    enable_funding_rate(): void;
    enable_large_trades(): void;
    enable_liq_heatmap(): void;
    enable_live_signals(): void;
    enable_mrd_pullback(): void;
    enable_ob_flow(): void;
    enable_ob_micro(): void;
    enable_ob_signals(): void;
    enable_oi(): void;
    enable_rsi(): void;
    enable_smart_ranges(): void;
    enable_stop_iceberg(): void;
    enable_tpo(): void;
    enable_volume(): void;
    enable_vpin(): void;
    enable_vrvp(): void;
    export_drawings_json(): string;
    finish_brush(): number;
    /**
     * Finish manual elliott. If < 6 points, predict remaining with Fibonacci.
     */
    finish_elliott_manual(): number;
    finish_path(): number;
    fit_content(): void;
    footprint_add_trade(bar_idx: number, price: number, volume: number, is_buyer_maker: boolean): void;
    footprint_add_trade_batch(data: Float64Array): void;
    footprint_clear(): void;
    footprint_clear_bar(bar_idx: number): void;
    footprint_ensure_len(n: number): void;
    footprint_get_display_mode(): number;
    footprint_get_show_profile(): boolean;
    footprint_get_show_signals(): boolean;
    footprint_prepend_empty(count: number): void;
    footprint_profile_hit_test(sx: number, sy: number): string;
    footprint_set_bar(bar_idx: number, tick_size: number, prices: Float64Array, bid_vols: Float64Array, ask_vols: Float64Array): void;
    /**
     * 0 = BidAsk, 1 = Delta, 2 = Volume
     */
    footprint_set_display_mode(mode: number): void;
    footprint_set_show_profile(show: boolean): void;
    footprint_set_show_signals(show: boolean): void;
    footprint_signal_count(): number;
    get_agg_liq_mode(): number;
    get_agg_liq_ratio(): number;
    get_chart_type(): number;
    get_command_buffer_len(): number;
    get_command_buffer_ptr(): number;
    get_custom_buffer_len(): number;
    get_custom_buffer_ptr(): number;
    get_cvd_mode(): number;
    get_cvd_profile_view_mode(): number;
    get_cvd_ratio(): number;
    get_cvd_show_delta(): boolean;
    get_cvd_show_divergence(): boolean;
    get_cvd_show_signals(): boolean;
    get_cvd_source(): number;
    get_drawing_color(id: number): number;
    get_drawing_dashed(id: number): boolean;
    get_drawing_flip_left(id: number): boolean;
    get_drawing_font_size(id: number): number;
    get_drawing_hide_label(id: number): boolean;
    /**
     * Returns a u8 identifying the drawing kind: 0=Trendline, 1=Arrow, 2=HLine,
     * 3=PriceRange, 4=FibRetrace, 5=Position, 6=AnchoredVwap, 7=PriceLabel,
     * 8=Brush, 9=Circle, 10=ArrowUp, 11=ArrowDown, 12=TextNote, 13=Channel,
     * 14=FibExtension, 15=Path, 16=ElliottImpulse, 255=unknown
     */
    get_drawing_kind_id(id: number): number;
    get_drawing_text(id: number): string;
    get_drawing_text_wrap(id: number): boolean;
    get_font_size(): number;
    get_forex_signals_count(): number;
    get_fr_ratio(): number;
    get_heatmap_data_max(): number;
    get_heatmap_data_min(): number;
    /**
     * Return the timestamp of the last heatmap column.
     */
    get_heatmap_last_timestamp(): number;
    get_heatmap_prefetch_max(): number;
    get_heatmap_profile_brightness(): number;
    get_heatmap_wall_count(): number;
    get_heatmap_x_step(): number;
    get_iceberg_count(): number;
    get_kline_visible(): boolean;
    /**
     * Returns JSON with the last candle's OHLCV + change info.
     * Used by the chart legend to show current price when no crosshair hover.
     */
    get_last_candle_json(): string;
    get_last_close(): number;
    get_liq_heatmap_cell_height(): number;
    get_liq_heatmap_filled_pct(): number;
    get_liq_heatmap_max(): number;
    get_liq_heatmap_min(): number;
    get_liq_heatmap_seg_max(): number;
    get_live_signals_count(): number;
    get_live_signals_leverage(): number;
    get_lt_data_max_vol(): number;
    get_lt_data_min_vol(): number;
    get_obf_ratio(): number;
    get_oi_ratio(): number;
    get_rsi_ratio(): number;
    get_selected_drawing(): number;
    get_selected_marker(): number;
    get_sr_signals_count(): number;
    get_stop_run_count(): number;
    get_theme(): number;
    get_tooltip_data(): string;
    get_tpo_period(): number;
    get_volume_color_mode(): number;
    get_volume_ma_period(): number;
    get_volume_show_ma(): boolean;
    get_volume_show_signals(): boolean;
    get_vpin_bucket_size(): number;
    get_vpin_num_buckets(): number;
    get_vpin_ratio(): number;
    get_vpin_threshold(): number;
    hide_crosshair(): void;
    hit_test_drawing(sx: number, sy: number): number;
    hit_test_drawing_anchor(sx: number, sy: number): number;
    hit_test_marker(sx: number, sy: number): number;
    hit_zone(sx: number, sy: number): number;
    /**
     * Batch hover hit-test: returns [zone, selected_drawing, anchor_hit, drawing_hit, marker_hit]
     * as a packed Int32Array. One WASM boundary crossing instead of 5-10 separate calls.
     */
    hover_hit_test(sx: number, sy: number): Int32Array;
    import_drawings_json(json: string): void;
    is_agg_liq_enabled(): boolean;
    is_agg_liq_show_signals(): boolean;
    is_agg_liq_signals_on_chart(): boolean;
    is_cvd_divergence_enabled(): boolean;
    is_cvd_enabled(): boolean;
    is_cvd_orderblock_enabled(): boolean;
    is_cvd_profile_enabled(): boolean;
    is_cvd_regime_enabled(): boolean;
    is_cvd_trade_signals_enabled(): boolean;
    is_dirty(): boolean;
    is_ema_structure_enabled(): boolean;
    is_forex_signals_enabled(): boolean;
    is_funding_rate_enabled(): boolean;
    is_heatmap_show_profile(): boolean;
    is_large_trades_enabled(): boolean;
    is_liq_heatmap_enabled(): boolean;
    is_liq_heatmap_filled_zones(): boolean;
    is_liq_heatmap_predictions(): boolean;
    is_liq_heatmap_profile(): boolean;
    is_live_signals_enabled(): boolean;
    is_mrd_pullback_enabled(): boolean;
    is_ob_flow_enabled(): boolean;
    is_ob_micro_enabled(): boolean;
    is_ob_signals_enabled(): boolean;
    is_oi_enabled(): boolean;
    is_rsi_enabled(): boolean;
    is_rsi_show_on_chart(): boolean;
    is_rsi_show_traps(): boolean;
    is_smart_ranges_enabled(): boolean;
    is_stop_iceberg_enabled(): boolean;
    is_tpo_enabled(): boolean;
    is_tpo_signals(): boolean;
    is_volume_enabled(): boolean;
    is_vpin_enabled(): boolean;
    is_vrvp_enabled(): boolean;
    kline_closes(): Float64Array;
    kline_count(): number;
    kline_highs(): Float64Array;
    kline_lows(): Float64Array;
    kline_opens(): Float64Array;
    kline_timestamps(): Float64Array;
    kline_volumes(): Float64Array;
    liq_filled_zone_hit_test(sx: number, sy: number): string;
    liq_heatmap_hit_test(sx: number, sy: number): string;
    liq_predict_hit_test(sx: number, sy: number): string;
    liq_zone_hit_test(sx: number, sy: number): string;
    lt_hit_test(sx: number, sy: number): string;
    move_drawing(dx: number, dy: number): void;
    constructor(width: number, height: number);
    ob_flow_to_screen_y(val: number): number;
    oi_to_screen_y(val: number): number;
    /**
     * Pre-allocate an empty session slot (mirrors `cvd_session_open`).
     */
    open_cvd_profile_session(start: number, end: number, tick: number): void;
    pan(dx: number, dy: number): void;
    /**
     * Pan the Y axis of a specific indicator sub-pane.
     * pane: 1=RSI, 2=OI, 3=FR, 4=CVD, 5=VPIN
     */
    pan_indicator_y(pane: number, dy: number): void;
    pan_x(dx: number): void;
    pan_y(dy: number): void;
    /**
     * Remove the last kline (used by bar replay to step backward).
     */
    pop_last_kline(): boolean;
    prepend_klines(timestamps: Float64Array, open: Float64Array, high: Float64Array, low: Float64Array, close: Float64Array, volume: Float64Array): void;
    push_agg_liq_bar(ts: number, long_usd: number, short_usd: number, long_qty: number, short_qty: number, count: number): void;
    /**
     * Push a single signal (deduped on ts + kind).
     */
    push_agg_liq_signal(ts: number, kind: number, side: number, volume_usd: number, ratio: number, confidence: number): void;
    push_large_trade(ts: number, price: number, vol_usd: number, side_type: number): void;
    push_obf_sample(ts: number, obi: number, net_flow: number, cum_delta: number): void;
    push_obs_alert(ts: number, price: number, atype: number, severity: number, is_bid: boolean): void;
    remove_cvd_divergence(id: string): boolean;
    remove_cvd_orderblock_ob(id: string): boolean;
    remove_cvd_regime_flip(id: string): boolean;
    remove_cvd_trade_signal(id: string): boolean;
    remove_drawing(id: number): void;
    remove_marker(id: number): void;
    render(): number;
    /**
     * Replace one session entirely (mirrors `cvd_session_close`). The
     * `buckets` payload uses the same `[p, b, s]*` layout.
     */
    replace_cvd_profile_session(start: number, end: number, closed: boolean, tick: number, buckets: Float64Array): void;
    /**
     * Reset an indicator pane's Y axis back to auto-scale.
     */
    reset_indicator_y_auto(pane: number): void;
    resize(width: number, height: number): void;
    rsi_to_screen_y(val: number): number;
    screen_to_agg_liq_y(sy: number): number;
    screen_to_cvd_y(sy: number): number;
    screen_to_fr_y(sy: number): number;
    screen_to_ob_flow_y(sy: number): number;
    screen_to_oi_y(sy: number): number;
    screen_to_rsi_y(sy: number): number;
    screen_to_vpin_y(sy: number): number;
    screen_to_world_x(sx: number): number;
    screen_to_world_y(sy: number): number;
    select_drawing(id: number): void;
    select_marker(id: number): void;
    /**
     * Bulk set data. `flat` is a packed array of 6-tuples:
     * [ts, longUsd, shortUsd, longQty, shortQty, count] per bar.
     */
    set_agg_liq_data(flat: Float64Array): void;
    /**
     * Set hovered kline index for header display. Pass -1 to clear.
     */
    set_agg_liq_hover(idx: number): void;
    /**
     * mode: 0 = USD, 1 = Qty
     */
    set_agg_liq_mode(mode: number): void;
    set_agg_liq_ratio(ratio: number): void;
    set_agg_liq_show_long(show: boolean): void;
    set_agg_liq_show_short(show: boolean): void;
    set_agg_liq_show_signals(show: boolean): void;
    /**
     * Replace all signals. Each signal is 6 consecutive f64:
     * `[ts_secs, kind(0..5), side(0=neutral,1=long,2=short), volumeUsd, ratio, confidence(0..1)]`.
     */
    set_agg_liq_signals(flat: Float64Array): void;
    set_agg_liq_signals_on_chart(show: boolean): void;
    /**
     * Set chart background color
     */
    set_background_color(r: number, g: number, b: number): void;
    set_bg_gradient(enabled: boolean, r: number, g: number, b: number): void;
    set_candle_bear_border_color(r: number, g: number, b: number): void;
    /**
     * Set candle bear color (body + wick)
     */
    set_candle_bear_color(r: number, g: number, b: number): void;
    set_candle_bear_wick_color(r: number, g: number, b: number): void;
    set_candle_bull_border_color(r: number, g: number, b: number): void;
    /**
     * Set candle bull color (body + wick)
     */
    set_candle_bull_color(r: number, g: number, b: number): void;
    set_candle_bull_wick_color(r: number, g: number, b: number): void;
    set_candle_interval(seconds: number): void;
    set_channel_preview(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): void;
    set_chart_type(ct: number): void;
    set_crosshair(sx: number, sy: number): void;
    /**
     * Set crosshair line color + derive label colors
     */
    set_crosshair_color(r: number, g: number, b: number, a: number): void;
    /**
     * Set crosshair style: 0 = dashed, 1 = solid, 2 = dotted
     */
    set_crosshair_style(style: number): void;
    /**
     * Set crosshair line width
     */
    set_crosshair_width(w: number): void;
    set_cvd_data(taker_buy_vol: Float64Array, total_vol: Float64Array): void;
    set_cvd_divergence_min_strength(min: number): void;
    set_cvd_divergence_show_band(show: boolean): void;
    set_cvd_divergence_show_hidden(show: boolean): void;
    set_cvd_divergence_show_labels(show: boolean): void;
    set_cvd_divergence_show_long(show: boolean): void;
    set_cvd_divergence_show_regular(show: boolean): void;
    set_cvd_divergence_show_short(show: boolean): void;
    set_cvd_mode(mode: number): void;
    /**
     * Breaker visual intensity: `0` = outline-only (default), `1` =
     * light body fill + slightly brighter border, `2` = bold fill
     * matching live-OB intensity. Out-of-range values clamp to `2`
     * so a forward-compat extra mode never silently drops to OFF.
     */
    set_cvd_orderblock_breaker_style(style: number): void;
    /**
     * `255` = show every direction; otherwise one of the `DIR_*` codes
     * (0=bull / 1=bear / 2=neutral).
     */
    set_cvd_orderblock_direction_filter(dir: number): void;
    /**
     * User multiplier on the OB / GAP label font size. Shared with
     * `set_cvd_profile_label_size_scale` in the FE settings panel —
     * the bridge layer fans the same value out to both indicators
     * so a single "Label Size" dropdown drives every CVD-stack
     * label uniformly. Clamped to `[0.5, 2.0]`.
     */
    set_cvd_orderblock_label_size_scale(scale: number): void;
    set_cvd_orderblock_min_score(min: number): void;
    /**
     * `255` = show every mitigation mode; `0` = wick only, `1` = close only.
     */
    set_cvd_orderblock_mitigation_filter(mode: number): void;
    /**
     * Render-band selector — `0`=Cluster, `1`=Avg (default), `2`=Candle.
     * Mitigation is mode-independent on the BE so flipping this is
     * purely cosmetic. Unknown values fall back to `Avg`.
     */
    set_cvd_orderblock_render_mode(mode: number): void;
    set_cvd_orderblock_show_filled_gaps(show: boolean): void;
    set_cvd_orderblock_show_gaps(show: boolean): void;
    set_cvd_orderblock_show_labels(show: boolean): void;
    set_cvd_orderblock_show_mitigated(show: boolean): void;
    /**
     * Show OB boxes (active fills, breaker outlines, midlines, OB
     * labels)? Independent of [`set_cvd_orderblock_show_gaps`] so the
     * trader can show FVG voids without their parent OBs (or vice-
     * versa). The indicator must still be enabled (via
     * [`enable_cvd_orderblock`]) for either gate to matter — that
     * switch decides whether the BE feed is subscribed and the local
     * FVG compute runs at all; this gate only suppresses OB render
     * passes (Pass 2/3/3.5/4 + OB-label subloop + OB hit-test).
     */
    set_cvd_orderblock_show_obs(show: boolean): void;
    /**
     * Pin per-bucket bar height in pixels. `0` = auto (derive from tick
     * density). `>0` = use this exact pixel height regardless of how many
     * ticks fit in the visible Y range — solves the "auto collapses to
     * 2 px" case for instruments with small ticks (e.g. BTC at 5 USD over
     * a 60k vertical span). Clamped to `[0, 30]`.
     */
    set_cvd_profile_bar_height_px(px: number): void;
    /**
     * Pin per-session max bar width in pixels. `0` = auto (derive from
     * `ratio × column_width`). `>0` = exact pixel width; bars overflow
     * the session column boundary, useful when each daily column is just
     * ~30 px wide on multi-day views. Clamped to `[0, 400]`.
     */
    set_cvd_profile_bar_max_width_px(px: number): void;
    /**
     * User multiplier for the volume label font size. `1.0` keeps the
     * density-aware auto-scaling; lower values shrink labels (good for
     * dense layouts), higher values enlarge them (good for high-DPI
     * screens or screenshots). Clamped to `[0.5, 2.0]`.
     */
    set_cvd_profile_label_size_scale(scale: number): void;
    /**
     * Cap of how wide one session's bar may grow as a fraction of its
     * session column width. Clamped to `[0.20, 0.95]`.
     */
    set_cvd_profile_max_bar_ratio(ratio: number): void;
    /**
     * Bulk replace all sessions. See `CvdProfile::replace_sessions_flat`
     * for the flat-packed layout. Sent on initial snapshot or full refresh.
     */
    set_cvd_profile_sessions(flat: Float64Array): void;
    set_cvd_profile_show_anchors(show: boolean): void;
    /**
     * Toggle the optional **Delta POC** marker — the bucket with
     * the largest `|buy − sell|` (net order-flow imbalance).
     * Different concept from the canonical POC; off by default.
     * See `CvdProfile.show_delta_poc` for the rationale.
     */
    set_cvd_profile_show_delta_poc(show: boolean): void;
    set_cvd_profile_show_poc(show: boolean): void;
    /**
     * Toggle the **stable** session POC line. Independent from the
     * dynamic POC outline (`show_poc`) — the line is computed once
     * from raw session buckets and does not move when the user
     * zooms or pans the chart. See `CvdProfile.show_session_poc_line`
     * for the rationale.
     */
    set_cvd_profile_show_session_poc_line(show: boolean): void;
    /**
     * Profile theme: `0` = auto (follow chart Theme background), `1` =
     * force dark, `2` = force light. Other values fall back to auto so
     * older saved settings keep working.
     */
    set_cvd_profile_theme_mode(mode: number): void;
    /**
     * Toggle the per-row tooltip on crosshair hover. Disabling also
     * short-circuits `cvd_profile_hit_test` in the crosshair JSON
     * builder so we don't pay the per-bucket scan on every move.
     * Doesn't touch `enabled` (the indicator keeps rendering).
     */
    set_cvd_profile_tooltip_enabled(enabled: boolean): void;
    /**
     * Toggle quote-asset (USD) display for profile labels. Bar shapes
     * stay proportional — only the formatted numbers change.
     */
    set_cvd_profile_value_in_quote(in_quote: boolean): void;
    /**
     * 0 = signed CVD, 1 = total volume, 2 = split (sells left / buys right).
     */
    set_cvd_profile_view_mode(mode: number): void;
    set_cvd_ratio(ratio: number): void;
    set_cvd_regime_show_flip_lines(show: boolean): void;
    set_cvd_regime_show_ribbon(show: boolean): void;
    set_cvd_regime_show_wash(show: boolean): void;
    set_cvd_show_delta(show: boolean): void;
    set_cvd_show_divergence(show: boolean): void;
    set_cvd_show_signals(show: boolean): void;
    set_cvd_source(mode: number): void;
    set_cvd_spot_data(taker_buy_vol: Float64Array, total_vol: Float64Array): void;
    set_cvd_trade_signals_min_confidence(min: number): void;
    set_cvd_trade_signals_show_absorption_resolution(show: boolean): void;
    set_cvd_trade_signals_show_breakout(show: boolean): void;
    set_cvd_trade_signals_show_delta_trap(show: boolean): void;
    set_cvd_trade_signals_show_divergence(show: boolean): void;
    set_cvd_trade_signals_show_labels(show: boolean): void;
    set_cvd_trade_signals_show_levels(show: boolean): void;
    set_cvd_trade_signals_show_long(show: boolean): void;
    set_cvd_trade_signals_show_rejection(show: boolean): void;
    set_cvd_trade_signals_show_short(show: boolean): void;
    set_drawing_dashed(id: number, dashed: boolean): void;
    set_drawing_flip_left(id: number, flip: boolean): void;
    set_drawing_font_size(id: number, font_size: number): void;
    set_drawing_hide_label(id: number, hide: boolean): void;
    set_drawing_preview(kind: number, x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, line_width: number, dashed: boolean, pane: number): void;
    set_drawing_style(id: number, r: number, g: number, b: number, line_width: number): void;
    set_drawing_text(id: number, text: string): void;
    set_drawing_text_wrap(id: number, wrap: boolean): void;
    /**
     * Toggle rendering of all user drawings and in-progress drawing previews.
     * Drawings and their state remain in memory — only the render pass is
     * skipped, so toggling back on restores them immediately. When hiding,
     * any active selection is cleared so the edit popup doesn't linger
     * anchored to an invisible drawing.
     */
    set_drawings_visible(v: boolean): void;
    set_elliott_manual_cursor(wx: number, wy: number): void;
    /**
     * Compute and store the Elliott Wave preview for the given cursor position.
     * Called on every mouse-move while the elliott tool is active.
     */
    set_elliott_preview(x: number, y: number, r: number, g: number, b: number, lw: number, pane: number): void;
    set_es_ema1_len(len: number): void;
    set_es_ema2_len(len: number): void;
    set_es_show_bos(show: boolean): void;
    set_es_show_ema1(show: boolean): void;
    set_es_show_ema2(show: boolean): void;
    set_es_show_wma(show: boolean): void;
    set_es_swing_len(len: number): void;
    set_es_wma_len(len: number): void;
    set_fib_ext_preview(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): void;
    /**
     * Set font size for axis labels and general text
     */
    set_font_size(size: number): void;
    set_footprint_tick_size(tick: number): void;
    set_forex_signals_mode(mode: number): void;
    set_forex_signals_setup(is_btc_5m: boolean): void;
    set_forex_signals_show_stats(show: boolean): void;
    set_fr_agg_data(timestamps: Float64Array, values: Float64Array): void;
    set_fr_binance_data(timestamps: Float64Array, values: Float64Array): void;
    set_fr_ratio(ratio: number): void;
    set_fr_show_agg(show: boolean): void;
    set_fr_show_sma(show: boolean): void;
    /**
     * Set grid line color
     */
    set_grid_color(r: number, g: number, b: number, a: number): void;
    set_grid_h_visible(v: boolean): void;
    set_grid_v_visible(v: boolean): void;
    set_heatmap(matrix: Float64Array, rows: number, cols: number, x_start: number, x_step: number, y_start: number, y_step: number): void;
    set_heatmap_color_scheme(scheme: number): void;
    /**
     * Store the server-reported total volume max so that progressive chunk
     * loading produces stable heatmap colours from the first rendered chunk.
     * Does NOT mark dirty — this only affects future normalization, not current pixels.
     */
    set_heatmap_prefetch_range(max: number): void;
    /**
     * Brightness multiplier for the heatmap depth profile bars. Typical
     * presets: 0.6 dim / 1.0 normal / 1.4 bright / 1.8 vivid. Clamped
     * into a safe range inside the renderer.
     */
    set_heatmap_profile_brightness(mul: number): void;
    set_heatmap_range(min: number, max: number): void;
    set_heatmap_show_profile(show: boolean): void;
    /**
     * Set heatmap wall data from flat array. Stride is auto-detected:
     *   - 11 (legacy)
     *   - 14 (enriched-v1, deprecated): legacy + swingQualified + swingFillProb + swingOutcome
     *   - 15 (enriched-v2, current):    legacy + swingQualified + swingFillProb
     *                                   + swingFillBucket(0/1/2) + swingOutcome
     * See HeatmapProfileWalls::set_from_flat docs for full layouts.
     */
    set_heatmap_walls(flat: Float64Array): void;
    set_hover_price(price: number): void;
    set_iceberg_events(timestamps: Float64Array, prices: Float64Array, visible_sizes: Float64Array, hidden_sizes: Float64Array, is_bids: Uint8Array, refill_counts: Uint32Array): void;
    /**
     * Toggle rendering of all indicator layers (on-chart overlays and
     * indicator sub-panes: RSI, OI, CVD, VPIN, OB flow, Agg-Liq, etc.).
     * Indicator data and toggles are preserved; only the render calls are
     * gated. Base chart (candles/renko/footprint, volume, axes, grid, price
     * line, crosshair, orderbook heatmap) continues to render.
     */
    set_indicators_visible(v: boolean): void;
    /**
     * Toggle rendering of the kline base chart (candlesticks / footprint
     * cells / renko bricks — whichever `chart_type` is active). Volume
     * pane, indicators, drawings, axes, grid, crosshair and orderbook
     * heatmap all keep rendering. Use this when the user wants to focus
     * on indicator overlays / heatmap / orderbook flow without the OHLC
     * noise underneath. Streaming data is untouched, so toggling back
     * on restores the chart instantly without a re-fetch.
     */
    set_kline_visible(v: boolean): void;
    set_klines(timestamps: Float64Array, open: Float64Array, high: Float64Array, low: Float64Array, close: Float64Array, volume: Float64Array): void;
    set_large_trades_data(flat: Float64Array): void;
    /**
     * Set license state from JS bridge. Token must match hash to prevent direct bypass.
     * state: 0 = licensed, 1 = trial, 2 = expired
     */
    set_license_state(state: number, days: number, token: number): void;
    set_liq_heatmap_cell_height(mult: number): void;
    set_liq_heatmap_filled_pct(pct: number): void;
    set_liq_heatmap_filled_zones(show: boolean): void;
    set_liq_heatmap_predictions(show: boolean): void;
    set_liq_heatmap_profile(show: boolean): void;
    set_liq_heatmap_range(min: number, max: number): void;
    set_live_signals_data(flat: Float64Array): void;
    set_live_signals_leverage(leverage: number): void;
    set_live_signals_loading(loading: boolean): void;
    set_live_signals_pip_value(pip_value: number): void;
    set_live_signals_show_entry(show: boolean): void;
    set_live_signals_show_labels(show: boolean): void;
    set_live_signals_show_max_profit(show: boolean): void;
    set_live_signals_show_tp_sl(show: boolean): void;
    set_live_signals_show_zones(show: boolean): void;
    set_live_signals_text_size(size: number): void;
    set_live_signals_trial(is_trial: boolean): void;
    set_lt_bubble_scale(scale: number): void;
    set_lt_volume_filter(min: number, max: number): void;
    /**
     * 0 None, 1 BUY, 2 SELL, 3 Both
     */
    set_mrd_pullback_entry_mode(mode: number): void;
    /**
     * Replace the HTF (higher-timeframe) klines used by the HTF advanced
     * signal pipeline.  Arrays must be the same length.  Call when the user
     * switches chart timeframe, symbol, or the HTF preset.
     */
    set_mrd_pullback_htf_klines(timestamps: Float64Array, open: Float64Array, high: Float64Array, low: Float64Array, close: Float64Array, volume: Float64Array): void;
    set_mrd_pullback_show_hidden_div(show: boolean): void;
    /**
     * 0 None, 1 S/R Volume
     */
    set_mrd_pullback_sr_mode(mode: number): void;
    /**
     * 0 Tiny, 1 Small, 2 Normal, 3 Large
     */
    set_mrd_pullback_text_size(size: number): void;
    /**
     * 0 Current timeframe, 1..=9 HTF presets.  JS owns the interval mapping
     * and pushes HTF klines via `set_mrd_pullback_htf_klines`.
     */
    set_mrd_pullback_tf_mode(mode: number): void;
    /**
     * 0 None, 1 Position (double-Supertrend)
     */
    set_mrd_pullback_trend_mode(mode: number): void;
    set_obf_data(flat: Float64Array): void;
    set_obf_ratio(ratio: number): void;
    set_obf_show_cum_delta(show: boolean): void;
    set_obf_show_net_flow(show: boolean): void;
    set_obf_show_obi(show: boolean): void;
    set_obm_anchor_top_right(top_right: boolean): void;
    set_obm_data(absorption_bid: number, absorption_ask: number, spoof_score: number, vpin: number, bid_pressure: number, ask_pressure: number, trade_imbalance: number, spread_z1m: number, buy_volume: number, sell_volume: number, trade_rate: number, large_buys: number, large_sells: number): void;
    set_obs_com(price: number): void;
    set_obs_gaps(bid_gaps: Float64Array, ask_gaps: Float64Array): void;
    set_obs_show_alerts(show: boolean): void;
    set_obs_show_com(show: boolean): void;
    set_obs_show_gaps(show: boolean): void;
    set_obs_show_walls(show: boolean): void;
    set_obs_walls(bid_walls: Float64Array, ask_walls: Float64Array): void;
    set_oi_data(values: Float64Array): void;
    set_oi_data_ts(timestamps: Float64Array, values: Float64Array): void;
    set_oi_display_mode(mode: number): void;
    set_oi_ratio(ratio: number): void;
    set_oi_show_on_chart(show: boolean): void;
    set_path_cursor(wx: number, wy: number): void;
    set_price_precision(decimals: number): void;
    /**
     * Store wall-clock timestamps for Forex gap-free rendering.
     * Must be called after `set_klines` with the same length.
     */
    set_real_timestamps(real_ts: Float64Array): void;
    set_replay_hovered(hovered: boolean): void;
    set_replay_preview(screen_x: number): void;
    set_replay_state(active: boolean, current: number, total: number): void;
    set_rsi_period(period: number): void;
    set_rsi_ratio(ratio: number): void;
    set_rsi_show_divergence(show: boolean): void;
    set_rsi_show_ema(show: boolean): void;
    set_rsi_show_levels(show: boolean): void;
    set_rsi_show_on_chart(show: boolean): void;
    set_rsi_show_signals(show: boolean): void;
    set_rsi_show_traps(show: boolean): void;
    set_rsi_show_wma(show: boolean): void;
    set_rsi_smoothing(val: number): void;
    set_si_show_icebergs(show: boolean): void;
    set_si_show_stops(show: boolean): void;
    set_si_show_zones(show: boolean): void;
    set_sr_fvg_extend(extend: number): void;
    set_sr_fvg_htf(show: boolean): void;
    set_sr_fvg_mitigation(mode: number): void;
    set_sr_fvg_theme(theme: number): void;
    set_sr_htf_minutes(minutes: number): void;
    set_sr_mitigation(mode: number): void;
    set_sr_ob_last(count: number): void;
    set_sr_show_breakers(show: boolean): void;
    set_sr_show_fvg(show: boolean): void;
    set_sr_show_fvg_signals(show: boolean): void;
    set_sr_show_htf_ob(show: boolean): void;
    set_sr_show_metrics(show: boolean): void;
    set_sr_show_ob(show: boolean): void;
    set_sr_show_ob_activity(show: boolean): void;
    set_sr_show_ob_signals(show: boolean): void;
    set_sr_show_predict(show: boolean): void;
    set_sr_show_smart_rev(show: boolean): void;
    set_sr_smart_rev_htf(minutes: number): void;
    set_sr_stats_position(pos: number): void;
    set_sr_stats_type(stats_type: number): void;
    set_sr_text_size(size: number): void;
    /**
     * Switch theme: 0 = dark, 1 = light
     */
    set_theme(id: number): void;
    set_touch_mode(enabled: boolean): void;
    set_tpo_ib(show: boolean): void;
    set_tpo_ib_minutes(minutes: number): void;
    set_tpo_letter_minutes(minutes: number): void;
    set_tpo_naked_poc(show: boolean): void;
    set_tpo_period(minutes: number): void;
    set_tpo_poc_line(show: boolean): void;
    set_tpo_profile_shape(show: boolean): void;
    set_tpo_signals(show: boolean): void;
    set_tpo_single_prints(show: boolean): void;
    set_tpo_va_lines(show: boolean): void;
    set_volume_color_mode(mode: number): void;
    set_volume_ma_period(period: number): void;
    set_volume_show_ma(show: boolean): void;
    set_volume_show_signals(show: boolean): void;
    set_vpin_bucket_size(size: number): void;
    set_vpin_data(taker_buy_vol: Float64Array, total_vol: Float64Array): void;
    set_vpin_num_buckets(count: number): void;
    set_vpin_ratio(ratio: number): void;
    set_vpin_show_sma(show: boolean): void;
    set_vpin_show_zones(show: boolean): void;
    set_vpin_threshold(threshold: number): void;
    /**
     * Provide real per-bar taker-buy / total-volume data for VRVP. When this
     * data is set VRVP splits buy vs sell using the actual exchange ratio
     * instead of estimating direction from candle close vs open. Index-aligned
     * with `KlineData`. Same arrays used by CVD / VPIN can be reused.
     */
    set_vrvp_data(taker_buy_vol: Float64Array, total_vol: Float64Array): void;
    set_vrvp_poc_line(show: boolean): void;
    show_latest(n_candles: number): void;
    start_brush(r: number, g: number, b: number, line_width: number, pane: number): void;
    start_elliott_manual(r: number, g: number, b: number, lw: number, pane: number): void;
    start_path(r: number, g: number, b: number, line_width: number, dashed: boolean, pane: number): void;
    update_drawing_anchor(anchor: number, wx: number, wy: number): void;
    update_heatmap_column(col: number, values: Float64Array): void;
    /**
     * Update (or append) the column whose world-x matches `timestamp`.
     * If the timestamp falls within the existing grid, that column is
     * overwritten. If it is past the end, `append_column` handles
     * gap-filling automatically.
     */
    update_heatmap_column_at(values: Float64Array, timestamp: number, y_start: number, y_step: number): void;
    /**
     * Overwrite the last column of the heatmap (forming candle update).
     */
    update_last_heatmap_column(values: Float64Array, y_start: number, y_step: number): void;
    update_last_kline(ts: number, o: number, h: number, l: number, c: number, v: number): void;
    /**
     * Incremental HTF tick: replace the in-progress HTF bar.  Called from
     * the kline websocket handler when a new HTF tick arrives.
     */
    update_mrd_pullback_last_htf_kline(ts: number, o: number, h: number, l: number, c: number, v: number): void;
    upsert_cvd_divergence(id: string, kind: number, direction: number, from_sec: number, price_from: number, to_sec: number, price_to: number, cvd_from: number, cvd_to: number, strength: number, valid_until_sec: number): void;
    /**
     * Insert or replace one OB. The BE sends the full record on both
     * `cvd_ob_new` and `cvd_ob_break` (the difference is the per-mode
     * mitigation flags), so the bridge calls this for both events.
     * `cvd_ob_break` may fire **twice** per OB under rev 3 — once when
     * the wick rule trips and once when the close rule confirms — and
     * each event re-pushes the full record so the latest values
     * always overwrite.
     */
    upsert_cvd_orderblock_ob(id: string, direction: number, source_kind: number, session_res_ms: number, session_start_sec: number, price_top: number, price_btm: number, price_avg: number, tick: number, candle_hi: number, candle_lo: number, candle_start_sec: number, avg_top: number, avg_btm: number, opened_at_sec: number, extend_until_sec: number, total_vol: number, buy_vol: number, sell_vol: number, delta: number, buy_share: number, sell_share: number, delta_pct: number, buckets: number, score: number, test_count: number, confirmed: boolean, range_pos: number, healthy: boolean, mitigated_wick: boolean, mitigated_close: boolean, mitigated_wick_at_sec: number, mitigated_close_at_sec: number, created_at_sec: number, updated_at_sec: number): void;
    upsert_cvd_regime_flip(id: string, window_end_sec: number, window_start_sec: number, from_bias: number, to_bias: number, bias_share: number, window_bars: number, valid_until_sec: number): void;
    upsert_cvd_trade_signal(id: string, direction: number, trigger: number, candle_start_sec: number, candle_high: number, candle_low: number, entry: number, stop: number, target1: number, target2: number, rr_t1: number, rr_t2: number, confidence: number, bias4h: number, confluence_count: number, valid_until_sec: number, primary_zone_lo: number, primary_zone_hi: number, primary_zone_score: number, primary_anchor_ms: number, reason: string): void;
    vpin_to_screen_y(val: number): number;
    vrvp_hit_test(sx: number, sy: number): string;
    world_to_screen_x(wx: number): number;
    world_to_screen_y(wy: number): number;
    zoom(screen_x: number, screen_y: number, factor: number): void;
    /**
     * Zoom the Y axis of a specific indicator sub-pane.
     */
    zoom_indicator_y(pane: number, screen_y: number, factor: number): void;
    zoom_x(screen_x: number, factor: number): void;
    zoom_y(screen_y: number, factor: number): void;
}

export class OrderbookEngine {
    free(): void;
    [Symbol.dispose](): void;
    center_on_mid(): void;
    clear(): void;
    clear_hover(): void;
    get_command_buffer_len(): number;
    get_command_buffer_ptr(): number;
    get_hover_price(): number;
    get_hover_qty(): number;
    get_hover_side(): number;
    get_theme(): number;
    is_dirty(): boolean;
    constructor(width: number, height: number);
    pan_y(dp: number): void;
    push_heatmap_col(bids: Float64Array, asks: Float64Array, mid: number): void;
    push_snapshot(bids: Float64Array, asks: Float64Array, mid: number): void;
    render(): number;
    reset_ring(): void;
    resize(w: number, h: number): void;
    set_auto_center(a: boolean): void;
    set_depth_book(bids: Float64Array, asks: Float64Array, mid: number): void;
    set_exchange_count(n: number): void;
    set_exchange_labels(labels_csv: string): void;
    set_heatmap_alpha_mul(mul: number): void;
    set_heatmap_cols(n: number): void;
    set_hover(x: number, y: number): void;
    set_hover_y(y: number): void;
    set_price_precision(d: number): void;
    set_ring_capacity(c: number, r: number): void;
    set_show_cumulative(show: boolean): void;
    set_show_signal_overlays(show: boolean): void;
    set_signal_absorption(bid: number, ask: number): void;
    set_signal_flow(net_flow: number, cum_delta: number): void;
    /**
     * Gaps: interleaved [lo, hi, lo, hi, ...]
     */
    set_signal_gaps(bid_gaps: Float64Array, ask_gaps: Float64Array): void;
    set_signal_obi(obi: number, bid_p: number, ask_p: number): void;
    set_signal_spoof(score: number): void;
    /**
     * Walls: interleaved [price, qty, price, qty, ...]
     */
    set_signal_walls(bid_walls: Float64Array, ask_walls: Float64Array): void;
    /**
     * When the trading pair changes, clear depth/heatmap buffers so grouping (tick) applies to
     * fresh prices. Otherwise `set_tick_size` is a no-op if tick is unchanged (same e.g. 0.5).
     */
    set_symbol(s: string): void;
    set_theme(id: number): void;
    set_tick_size(t: number): void;
    set_visible_ticks(t: number): void;
    zoom_y(f: number, ay: number): void;
}

export class TickEngine {
    free(): void;
    [Symbol.dispose](): void;
    chart_height_px(): number;
    /**
     * Top-left corner of the chart-body rectangle (CSS px). Useful for
     * interactive overlays the parent might want to draw outside the
     * canvas (e.g. floating tooltips).
     */
    chart_left_px(): number;
    chart_top_px(): number;
    chart_width_px(): number;
    clear(): void;
    clear_hover(): void;
    get_command_buffer_len(): number;
    get_command_buffer_ptr(): number;
    /**
     * Latest mid price (for JS to sync trade panel / bridge state).
     */
    get_last_mid(): number;
    /**
     * Hit-test a screen pixel and return a zone code so the bridge can
     * route gestures without duplicating layout knowledge.
     * Matches `ChartEngine::hit_zone` codes used in `eventMouse.js`:
     *   • 0   = chart body (Main)
     *   • 2   = X axis (bottom)
     *   • 3   = Y axis (right)
     *   • 255 = outside / not over canvas
     */
    hit_zone(sx: number, sy: number): number;
    is_dirty(): boolean;
    constructor(width: number, height: number);
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
     */
    pan_x(dx_px: number): void;
    pan_y(dy_px: number): void;
    /**
     * Push an aggregated orderbook snapshot for the current wall-clock ms.
     * `bids`/`asks` are interleaved [price, qty, price, qty, ...].
     */
    push_book(t_ms: number, bids: Float64Array, asks: Float64Array, mid: number): void;
    /**
     * Push a single trade. `side`: 0 = buy aggressor, 1 = sell aggressor.
     */
    push_trade(t_ms: number, price: number, qty: number, side: number): void;
    /**
     * Batch trades to amortise WASM call overhead.
     * `flat`: [t_ms, price, qty, side, t_ms, price, qty, side, ...].
     */
    push_trades_batch(flat: Float64Array): void;
    render(): number;
    /**
     * Re-anchor everything to "live + default span + auto-scale Y" —
     * equivalent to the Flowsurface `R` keystroke / double-click on axis.
     */
    reset_view(): void;
    /**
     * Re-engage Y auto-scale (centers the latest mid in the screen).
     * Called by the JS bridge on Y-axis double-click — same gesture
     * flowsurface uses (`AxisScaleClicked::Y` in `chart.rs:296`).
     */
    reset_y_auto(): void;
    resize(w: number, h: number): void;
    set_auto_scale_y(v: boolean): void;
    /**
     * Force the chart to track / un-track the live tip.
     *
     * `true`: snap `right_offset_ms` to 0 (right edge glued to live)
     *         AND clear any free-pan future buffer the user may have
     *         dragged in.
     * `false`: leave the current right-offset alone — the caller is
     *          opting out of auto-scroll without changing the visible
     *          window.
     */
    set_follow_live(v: boolean): void;
    /**
     * Set the heatmap intensity window — equivalent to the dual-handle
     * slider on the orderbook chart. `min_pct` and `max_pct` are
     * fractions of `book.smooth_max()`. Values are clamped so that
     * `0 ≤ min ≤ 0.99` and `min + 0.01 ≤ max ≤ 1` to keep the
     * renderer's divide-by-(max-min) numerically stable.
     */
    set_heatmap_intensity(min_pct: number, max_pct: number): void;
    /**
     * Pick one of 5 built-in heatmap colour presets (indices 0..=4).
     * Out-of-range values silently fall back to 0 so the JS bridge can't
     * crash the engine by passing a stale config.
     */
    set_heatmap_palette(idx: number): void;
    set_hover(x: number, y: number): void;
    /**
     * Toggle 3-D bubble rendering for large trades. When false, ALL
     * trades render as flat alpha-blended circles (cheaper, flatter
     * look). When true, trades whose radius exceeds the renderer's
     * `LARGE_BUBBLE_RADIUS_PX` switch to the glossy `Bubble3D` command.
     */
    set_large_trade_3d(enabled: boolean): void;
    /**
     * Uniformly scale the trade-bubble size across the trade-tape pass.
     * Affects `MIN_TRADE_RADIUS`, `MAX_TRADE_RADIUS`, the LARGE-bubble
     * cutoff, and the volume-label radius threshold — everything moves
     * together so the relative classification ("when does a print get
     * a 3-D bubble + volume label?") is preserved at any scale.
     * Clamped to `[0.5, 2.5]` to keep the largest trades within the
     * chart's vertical column at default zoom.
     */
    set_large_trade_scale(scale: number): void;
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
     */
    set_lookback(lookback_ms: number, cell_ms: number): void;
    set_price_precision(decimals: number): void;
    set_show_book_heatmap(v: boolean): void;
    set_show_grid(v: boolean): void;
    set_show_latest_profile(v: boolean): void;
    set_show_trade_tape(v: boolean): void;
    /**
     * Show / hide the volume strip at the bottom of the chart. The
     * strip overlays the chart area (does NOT shrink it) so toggling
     * preserves the user's price viewport. Mirrors flowsurface's
     * `HeatmapIndicator::Volume` study.
     */
    set_show_volume(v: boolean): void;
    set_show_vwap(v: boolean): void;
    set_theme(id: number): void;
    set_tick_size(tick: number): void;
    /**
     * Height of the bottom time axis in CSS px. Used by the bridge to
     * detect "drag started inside the x-axis" → zoom X instead of pan.
     */
    xaxis_height_px(): number;
    /**
     * Width of the right-side price axis in CSS px. Used by the bridge
     * to detect "drag started inside the y-axis" → zoom Y instead of pan.
     */
    yaxis_width_px(): number;
    /**
     * Uniform zoom around a cursor pixel — the canonical "scroll-to-zoom"
     * gesture (matches `ChartEngine::zoom` in `engine/viewport_ops.rs:7`).
     * Both the world-time AND world-price under `(screen_x, screen_y)`
     * stay anchored across the zoom.
     */
    zoom(screen_x: number, screen_y: number, factor: number): void;
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
     */
    zoom_x(screen_x: number, factor: number): void;
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
     */
    zoom_y(screen_y: number, factor: number): void;
}

export function wasm_init(): void;

export function wasm_memory(): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_chartengine_free: (a: number, b: number) => void;
    readonly __wbg_orderbookengine_free: (a: number, b: number) => void;
    readonly __wbg_tickengine_free: (a: number, b: number) => void;
    readonly chartengine_add_anchored_vwap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly chartengine_add_arrow: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
    readonly chartengine_add_arrow_marker_down: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly chartengine_add_arrow_marker_up: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly chartengine_add_brush_point: (a: number, b: number, c: number) => void;
    readonly chartengine_add_circle: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
    readonly chartengine_add_elliott_impulse: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly chartengine_add_elliott_manual_point: (a: number, b: number, c: number) => number;
    readonly chartengine_add_fib_extension: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => number;
    readonly chartengine_add_fib_retracement: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
    readonly chartengine_add_horizontal_line: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
    readonly chartengine_add_long_position: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
    readonly chartengine_add_marker: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_add_parallel_channel: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => number;
    readonly chartengine_add_path_point: (a: number, b: number, c: number) => void;
    readonly chartengine_add_price_label: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly chartengine_add_price_range: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
    readonly chartengine_add_short_position: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
    readonly chartengine_add_text_note: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly chartengine_add_trendline: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
    readonly chartengine_agg_liq_bar_json: (a: number, b: number, c: number) => void;
    readonly chartengine_agg_liq_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_append_heatmap_column: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_append_kline: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_append_real_timestamp: (a: number, b: number) => void;
    readonly chartengine_apply_cvd_profile_update: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_cancel_brush: (a: number) => void;
    readonly chartengine_cancel_elliott_manual: (a: number) => void;
    readonly chartengine_cancel_path: (a: number) => void;
    readonly chartengine_chart_area_h: (a: number) => number;
    readonly chartengine_chart_area_w: (a: number) => number;
    readonly chartengine_chart_area_x: (a: number) => number;
    readonly chartengine_chart_area_y: (a: number) => number;
    readonly chartengine_clear_agg_liq: (a: number) => void;
    readonly chartengine_clear_agg_liq_signals: (a: number) => void;
    readonly chartengine_clear_channel_preview: (a: number) => void;
    readonly chartengine_clear_cvd_divergence: (a: number) => void;
    readonly chartengine_clear_cvd_orderblock_all: (a: number) => void;
    readonly chartengine_clear_cvd_orderblock_obs: (a: number) => void;
    readonly chartengine_clear_cvd_profile: (a: number) => void;
    readonly chartengine_clear_cvd_regime: (a: number) => void;
    readonly chartengine_clear_cvd_trade_signals: (a: number) => void;
    readonly chartengine_clear_drawing_preview: (a: number) => void;
    readonly chartengine_clear_drawings: (a: number) => void;
    readonly chartengine_clear_elliott_preview: (a: number) => void;
    readonly chartengine_clear_fib_ext_preview: (a: number) => void;
    readonly chartengine_clear_heatmap_prefetch_range: (a: number) => void;
    readonly chartengine_clear_heatmap_walls: (a: number) => void;
    readonly chartengine_clear_hover_price: (a: number) => void;
    readonly chartengine_clear_large_trades: (a: number) => void;
    readonly chartengine_clear_live_signals: (a: number) => void;
    readonly chartengine_clear_markers: (a: number) => void;
    readonly chartengine_clear_mrd_pullback_htf_klines: (a: number) => void;
    readonly chartengine_clear_ob_flow: (a: number) => void;
    readonly chartengine_clear_ob_micro: (a: number) => void;
    readonly chartengine_clear_ob_signals: (a: number) => void;
    readonly chartengine_custom_band: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
    readonly chartengine_custom_begin: (a: number) => void;
    readonly chartengine_custom_circle_px: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_custom_clip_rect: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_custom_command_count: (a: number) => number;
    readonly chartengine_custom_dashed_hline: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
    readonly chartengine_custom_end: (a: number) => void;
    readonly chartengine_custom_fill_rect_px: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
    readonly chartengine_custom_hline: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_custom_line_px: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
    readonly chartengine_custom_marker: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
    readonly chartengine_custom_marker_down: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
    readonly chartengine_custom_marker_up: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
    readonly chartengine_custom_price_label: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
    readonly chartengine_custom_restore: (a: number) => void;
    readonly chartengine_custom_save: (a: number) => void;
    readonly chartengine_custom_series_dashed_line: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
    readonly chartengine_custom_series_line: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
    readonly chartengine_custom_stroke_rect_px: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
    readonly chartengine_custom_text: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
    readonly chartengine_custom_text_px: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
    readonly chartengine_cvd_divergence_count: (a: number) => number;
    readonly chartengine_cvd_divergence_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_cvd_orderblock_gap_count: (a: number) => number;
    readonly chartengine_cvd_orderblock_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_cvd_orderblock_ob_count: (a: number) => number;
    readonly chartengine_cvd_profile_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_cvd_regime_flip_count: (a: number) => number;
    readonly chartengine_cvd_regime_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_cvd_trade_signal_count: (a: number) => number;
    readonly chartengine_cvd_trade_signals_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_delta_histogram_enabled: (a: number) => number;
    readonly chartengine_deselect_drawing: (a: number) => void;
    readonly chartengine_deselect_marker: (a: number) => void;
    readonly chartengine_disable_agg_liq: (a: number) => void;
    readonly chartengine_disable_cvd: (a: number) => void;
    readonly chartengine_disable_cvd_divergence: (a: number) => void;
    readonly chartengine_disable_cvd_orderblock: (a: number) => void;
    readonly chartengine_disable_cvd_profile: (a: number) => void;
    readonly chartengine_disable_cvd_regime: (a: number) => void;
    readonly chartengine_disable_cvd_trade_signals: (a: number) => void;
    readonly chartengine_disable_delta_histogram: (a: number) => void;
    readonly chartengine_disable_ema_structure: (a: number) => void;
    readonly chartengine_disable_forex_signals: (a: number) => void;
    readonly chartengine_disable_funding_rate: (a: number) => void;
    readonly chartengine_disable_large_trades: (a: number) => void;
    readonly chartengine_disable_liq_heatmap: (a: number) => void;
    readonly chartengine_disable_live_signals: (a: number) => void;
    readonly chartengine_disable_mrd_pullback: (a: number) => void;
    readonly chartengine_disable_ob_flow: (a: number) => void;
    readonly chartengine_disable_ob_micro: (a: number) => void;
    readonly chartengine_disable_ob_signals: (a: number) => void;
    readonly chartengine_disable_oi: (a: number) => void;
    readonly chartengine_disable_rsi: (a: number) => void;
    readonly chartengine_disable_smart_ranges: (a: number) => void;
    readonly chartengine_disable_stop_iceberg: (a: number) => void;
    readonly chartengine_disable_tpo: (a: number) => void;
    readonly chartengine_disable_volume: (a: number) => void;
    readonly chartengine_disable_vpin: (a: number) => void;
    readonly chartengine_disable_vrvp: (a: number) => void;
    readonly chartengine_drawing_count: (a: number) => number;
    readonly chartengine_enable_agg_liq: (a: number) => void;
    readonly chartengine_enable_cvd: (a: number) => void;
    readonly chartengine_enable_cvd_divergence: (a: number) => void;
    readonly chartengine_enable_cvd_orderblock: (a: number) => void;
    readonly chartengine_enable_cvd_profile: (a: number) => void;
    readonly chartengine_enable_cvd_regime: (a: number) => void;
    readonly chartengine_enable_cvd_trade_signals: (a: number) => void;
    readonly chartengine_enable_delta_histogram: (a: number) => void;
    readonly chartengine_enable_ema_structure: (a: number) => void;
    readonly chartengine_enable_forex_signals: (a: number) => void;
    readonly chartengine_enable_funding_rate: (a: number) => void;
    readonly chartengine_enable_large_trades: (a: number) => void;
    readonly chartengine_enable_liq_heatmap: (a: number) => void;
    readonly chartengine_enable_live_signals: (a: number) => void;
    readonly chartengine_enable_mrd_pullback: (a: number) => void;
    readonly chartengine_enable_ob_flow: (a: number) => void;
    readonly chartengine_enable_ob_micro: (a: number) => void;
    readonly chartengine_enable_ob_signals: (a: number) => void;
    readonly chartengine_enable_oi: (a: number) => void;
    readonly chartengine_enable_rsi: (a: number) => void;
    readonly chartengine_enable_smart_ranges: (a: number) => void;
    readonly chartengine_enable_stop_iceberg: (a: number) => void;
    readonly chartengine_enable_tpo: (a: number) => void;
    readonly chartengine_enable_volume: (a: number) => void;
    readonly chartengine_enable_vpin: (a: number) => void;
    readonly chartengine_enable_vrvp: (a: number) => void;
    readonly chartengine_export_drawings_json: (a: number, b: number) => void;
    readonly chartengine_finish_brush: (a: number) => number;
    readonly chartengine_finish_elliott_manual: (a: number) => number;
    readonly chartengine_finish_path: (a: number) => number;
    readonly chartengine_fit_content: (a: number) => void;
    readonly chartengine_footprint_add_trade: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_footprint_add_trade_batch: (a: number, b: number, c: number) => void;
    readonly chartengine_footprint_clear: (a: number) => void;
    readonly chartengine_footprint_clear_bar: (a: number, b: number) => void;
    readonly chartengine_footprint_ensure_len: (a: number, b: number) => void;
    readonly chartengine_footprint_get_display_mode: (a: number) => number;
    readonly chartengine_footprint_get_show_profile: (a: number) => number;
    readonly chartengine_footprint_get_show_signals: (a: number) => number;
    readonly chartengine_footprint_prepend_empty: (a: number, b: number) => void;
    readonly chartengine_footprint_profile_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_footprint_set_bar: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
    readonly chartengine_footprint_set_display_mode: (a: number, b: number) => void;
    readonly chartengine_footprint_set_show_profile: (a: number, b: number) => void;
    readonly chartengine_footprint_set_show_signals: (a: number, b: number) => void;
    readonly chartengine_footprint_signal_count: (a: number) => number;
    readonly chartengine_get_agg_liq_mode: (a: number) => number;
    readonly chartengine_get_agg_liq_ratio: (a: number) => number;
    readonly chartengine_get_chart_type: (a: number) => number;
    readonly chartengine_get_command_buffer_len: (a: number) => number;
    readonly chartengine_get_command_buffer_ptr: (a: number) => number;
    readonly chartengine_get_custom_buffer_len: (a: number) => number;
    readonly chartengine_get_custom_buffer_ptr: (a: number) => number;
    readonly chartengine_get_cvd_mode: (a: number) => number;
    readonly chartengine_get_cvd_profile_view_mode: (a: number) => number;
    readonly chartengine_get_cvd_ratio: (a: number) => number;
    readonly chartengine_get_cvd_show_delta: (a: number) => number;
    readonly chartengine_get_cvd_show_divergence: (a: number) => number;
    readonly chartengine_get_cvd_show_signals: (a: number) => number;
    readonly chartengine_get_cvd_source: (a: number) => number;
    readonly chartengine_get_drawing_color: (a: number, b: number) => number;
    readonly chartengine_get_drawing_dashed: (a: number, b: number) => number;
    readonly chartengine_get_drawing_flip_left: (a: number, b: number) => number;
    readonly chartengine_get_drawing_font_size: (a: number, b: number) => number;
    readonly chartengine_get_drawing_hide_label: (a: number, b: number) => number;
    readonly chartengine_get_drawing_kind_id: (a: number, b: number) => number;
    readonly chartengine_get_drawing_text: (a: number, b: number, c: number) => void;
    readonly chartengine_get_drawing_text_wrap: (a: number, b: number) => number;
    readonly chartengine_get_font_size: (a: number) => number;
    readonly chartengine_get_forex_signals_count: (a: number) => number;
    readonly chartengine_get_fr_ratio: (a: number) => number;
    readonly chartengine_get_heatmap_data_max: (a: number) => number;
    readonly chartengine_get_heatmap_data_min: (a: number) => number;
    readonly chartengine_get_heatmap_last_timestamp: (a: number) => number;
    readonly chartengine_get_heatmap_prefetch_max: (a: number) => number;
    readonly chartengine_get_heatmap_profile_brightness: (a: number) => number;
    readonly chartengine_get_heatmap_wall_count: (a: number) => number;
    readonly chartengine_get_heatmap_x_step: (a: number) => number;
    readonly chartengine_get_iceberg_count: (a: number) => number;
    readonly chartengine_get_kline_visible: (a: number) => number;
    readonly chartengine_get_last_candle_json: (a: number, b: number) => void;
    readonly chartengine_get_last_close: (a: number) => number;
    readonly chartengine_get_liq_heatmap_cell_height: (a: number) => number;
    readonly chartengine_get_liq_heatmap_filled_pct: (a: number) => number;
    readonly chartengine_get_liq_heatmap_max: (a: number) => number;
    readonly chartengine_get_liq_heatmap_min: (a: number) => number;
    readonly chartengine_get_liq_heatmap_seg_max: (a: number) => number;
    readonly chartengine_get_live_signals_count: (a: number) => number;
    readonly chartengine_get_live_signals_leverage: (a: number) => number;
    readonly chartengine_get_lt_data_max_vol: (a: number) => number;
    readonly chartengine_get_lt_data_min_vol: (a: number) => number;
    readonly chartengine_get_obf_ratio: (a: number) => number;
    readonly chartengine_get_oi_ratio: (a: number) => number;
    readonly chartengine_get_rsi_ratio: (a: number) => number;
    readonly chartengine_get_selected_drawing: (a: number) => number;
    readonly chartengine_get_selected_marker: (a: number) => number;
    readonly chartengine_get_sr_signals_count: (a: number) => number;
    readonly chartengine_get_stop_run_count: (a: number) => number;
    readonly chartengine_get_theme: (a: number) => number;
    readonly chartengine_get_tooltip_data: (a: number, b: number) => void;
    readonly chartengine_get_tpo_period: (a: number) => number;
    readonly chartengine_get_volume_color_mode: (a: number) => number;
    readonly chartengine_get_volume_ma_period: (a: number) => number;
    readonly chartengine_get_volume_show_ma: (a: number) => number;
    readonly chartengine_get_volume_show_signals: (a: number) => number;
    readonly chartengine_get_vpin_bucket_size: (a: number) => number;
    readonly chartengine_get_vpin_num_buckets: (a: number) => number;
    readonly chartengine_get_vpin_ratio: (a: number) => number;
    readonly chartengine_get_vpin_threshold: (a: number) => number;
    readonly chartengine_hide_crosshair: (a: number) => void;
    readonly chartengine_hit_test_drawing: (a: number, b: number, c: number) => number;
    readonly chartengine_hit_test_drawing_anchor: (a: number, b: number, c: number) => number;
    readonly chartengine_hit_test_marker: (a: number, b: number, c: number) => number;
    readonly chartengine_hit_zone: (a: number, b: number, c: number) => number;
    readonly chartengine_hover_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_import_drawings_json: (a: number, b: number, c: number) => void;
    readonly chartengine_is_agg_liq_enabled: (a: number) => number;
    readonly chartengine_is_agg_liq_show_signals: (a: number) => number;
    readonly chartengine_is_agg_liq_signals_on_chart: (a: number) => number;
    readonly chartengine_is_cvd_divergence_enabled: (a: number) => number;
    readonly chartengine_is_cvd_enabled: (a: number) => number;
    readonly chartengine_is_cvd_orderblock_enabled: (a: number) => number;
    readonly chartengine_is_cvd_profile_enabled: (a: number) => number;
    readonly chartengine_is_cvd_regime_enabled: (a: number) => number;
    readonly chartengine_is_cvd_trade_signals_enabled: (a: number) => number;
    readonly chartengine_is_dirty: (a: number) => number;
    readonly chartengine_is_ema_structure_enabled: (a: number) => number;
    readonly chartengine_is_forex_signals_enabled: (a: number) => number;
    readonly chartengine_is_funding_rate_enabled: (a: number) => number;
    readonly chartengine_is_heatmap_show_profile: (a: number) => number;
    readonly chartengine_is_large_trades_enabled: (a: number) => number;
    readonly chartengine_is_liq_heatmap_enabled: (a: number) => number;
    readonly chartengine_is_liq_heatmap_filled_zones: (a: number) => number;
    readonly chartengine_is_liq_heatmap_predictions: (a: number) => number;
    readonly chartengine_is_liq_heatmap_profile: (a: number) => number;
    readonly chartengine_is_live_signals_enabled: (a: number) => number;
    readonly chartengine_is_mrd_pullback_enabled: (a: number) => number;
    readonly chartengine_is_ob_flow_enabled: (a: number) => number;
    readonly chartengine_is_ob_micro_enabled: (a: number) => number;
    readonly chartengine_is_ob_signals_enabled: (a: number) => number;
    readonly chartengine_is_oi_enabled: (a: number) => number;
    readonly chartengine_is_rsi_enabled: (a: number) => number;
    readonly chartengine_is_rsi_show_on_chart: (a: number) => number;
    readonly chartengine_is_rsi_show_traps: (a: number) => number;
    readonly chartengine_is_smart_ranges_enabled: (a: number) => number;
    readonly chartengine_is_stop_iceberg_enabled: (a: number) => number;
    readonly chartengine_is_tpo_enabled: (a: number) => number;
    readonly chartengine_is_tpo_signals: (a: number) => number;
    readonly chartengine_is_volume_enabled: (a: number) => number;
    readonly chartengine_is_vpin_enabled: (a: number) => number;
    readonly chartengine_is_vrvp_enabled: (a: number) => number;
    readonly chartengine_kline_closes: (a: number, b: number) => void;
    readonly chartengine_kline_count: (a: number) => number;
    readonly chartengine_kline_highs: (a: number, b: number) => void;
    readonly chartengine_kline_lows: (a: number, b: number) => void;
    readonly chartengine_kline_opens: (a: number, b: number) => void;
    readonly chartengine_kline_timestamps: (a: number, b: number) => void;
    readonly chartengine_kline_volumes: (a: number, b: number) => void;
    readonly chartengine_liq_filled_zone_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_liq_heatmap_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_liq_predict_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_liq_zone_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_lt_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_move_drawing: (a: number, b: number, c: number) => void;
    readonly chartengine_new: (a: number, b: number) => number;
    readonly chartengine_ob_flow_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_oi_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_open_cvd_profile_session: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_pan: (a: number, b: number, c: number) => void;
    readonly chartengine_pan_indicator_y: (a: number, b: number, c: number) => void;
    readonly chartengine_pan_x: (a: number, b: number) => void;
    readonly chartengine_pan_y: (a: number, b: number) => void;
    readonly chartengine_pop_last_kline: (a: number) => number;
    readonly chartengine_prepend_klines: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_push_agg_liq_bar: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_push_agg_liq_signal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_push_large_trade: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_push_obf_sample: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_push_obs_alert: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_remove_cvd_divergence: (a: number, b: number, c: number) => number;
    readonly chartengine_remove_cvd_orderblock_ob: (a: number, b: number, c: number) => number;
    readonly chartengine_remove_cvd_regime_flip: (a: number, b: number, c: number) => number;
    readonly chartengine_remove_cvd_trade_signal: (a: number, b: number, c: number) => number;
    readonly chartengine_remove_drawing: (a: number, b: number) => void;
    readonly chartengine_remove_marker: (a: number, b: number) => void;
    readonly chartengine_render: (a: number) => number;
    readonly chartengine_replace_cvd_profile_session: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_reset_indicator_y_auto: (a: number, b: number) => void;
    readonly chartengine_resize: (a: number, b: number, c: number) => void;
    readonly chartengine_rsi_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_agg_liq_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_cvd_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_fr_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_ob_flow_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_oi_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_rsi_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_vpin_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_world_x: (a: number, b: number) => number;
    readonly chartengine_screen_to_world_y: (a: number, b: number) => number;
    readonly chartengine_select_drawing: (a: number, b: number) => void;
    readonly chartengine_select_marker: (a: number, b: number) => void;
    readonly chartengine_set_agg_liq_data: (a: number, b: number, c: number) => void;
    readonly chartengine_set_agg_liq_hover: (a: number, b: number) => void;
    readonly chartengine_set_agg_liq_mode: (a: number, b: number) => void;
    readonly chartengine_set_agg_liq_ratio: (a: number, b: number) => void;
    readonly chartengine_set_agg_liq_show_long: (a: number, b: number) => void;
    readonly chartengine_set_agg_liq_show_short: (a: number, b: number) => void;
    readonly chartengine_set_agg_liq_show_signals: (a: number, b: number) => void;
    readonly chartengine_set_agg_liq_signals: (a: number, b: number, c: number) => void;
    readonly chartengine_set_agg_liq_signals_on_chart: (a: number, b: number) => void;
    readonly chartengine_set_background_color: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_bg_gradient: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_candle_bear_border_color: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_candle_bear_color: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_candle_bear_wick_color: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_candle_bull_border_color: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_candle_bull_color: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_candle_bull_wick_color: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_candle_interval: (a: number, b: number) => void;
    readonly chartengine_set_channel_preview: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_set_chart_type: (a: number, b: number) => void;
    readonly chartengine_set_crosshair: (a: number, b: number, c: number) => void;
    readonly chartengine_set_crosshair_color: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_crosshair_style: (a: number, b: number) => void;
    readonly chartengine_set_crosshair_width: (a: number, b: number) => void;
    readonly chartengine_set_cvd_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_cvd_divergence_min_strength: (a: number, b: number) => void;
    readonly chartengine_set_cvd_divergence_show_band: (a: number, b: number) => void;
    readonly chartengine_set_cvd_divergence_show_hidden: (a: number, b: number) => void;
    readonly chartengine_set_cvd_divergence_show_labels: (a: number, b: number) => void;
    readonly chartengine_set_cvd_divergence_show_long: (a: number, b: number) => void;
    readonly chartengine_set_cvd_divergence_show_regular: (a: number, b: number) => void;
    readonly chartengine_set_cvd_divergence_show_short: (a: number, b: number) => void;
    readonly chartengine_set_cvd_mode: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_breaker_style: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_direction_filter: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_label_size_scale: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_min_score: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_mitigation_filter: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_render_mode: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_show_filled_gaps: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_show_gaps: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_show_labels: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_show_mitigated: (a: number, b: number) => void;
    readonly chartengine_set_cvd_orderblock_show_obs: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_bar_height_px: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_bar_max_width_px: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_label_size_scale: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_max_bar_ratio: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_sessions: (a: number, b: number, c: number) => void;
    readonly chartengine_set_cvd_profile_show_anchors: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_show_delta_poc: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_show_poc: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_show_session_poc_line: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_theme_mode: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_tooltip_enabled: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_value_in_quote: (a: number, b: number) => void;
    readonly chartengine_set_cvd_profile_view_mode: (a: number, b: number) => void;
    readonly chartengine_set_cvd_ratio: (a: number, b: number) => void;
    readonly chartengine_set_cvd_regime_show_flip_lines: (a: number, b: number) => void;
    readonly chartengine_set_cvd_regime_show_ribbon: (a: number, b: number) => void;
    readonly chartengine_set_cvd_regime_show_wash: (a: number, b: number) => void;
    readonly chartengine_set_cvd_show_delta: (a: number, b: number) => void;
    readonly chartengine_set_cvd_show_divergence: (a: number, b: number) => void;
    readonly chartengine_set_cvd_show_signals: (a: number, b: number) => void;
    readonly chartengine_set_cvd_source: (a: number, b: number) => void;
    readonly chartengine_set_cvd_spot_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_cvd_trade_signals_min_confidence: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_absorption_resolution: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_breakout: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_delta_trap: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_divergence: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_labels: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_levels: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_long: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_rejection: (a: number, b: number) => void;
    readonly chartengine_set_cvd_trade_signals_show_short: (a: number, b: number) => void;
    readonly chartengine_set_drawing_dashed: (a: number, b: number, c: number) => void;
    readonly chartengine_set_drawing_flip_left: (a: number, b: number, c: number) => void;
    readonly chartengine_set_drawing_font_size: (a: number, b: number, c: number) => void;
    readonly chartengine_set_drawing_hide_label: (a: number, b: number, c: number) => void;
    readonly chartengine_set_drawing_preview: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
    readonly chartengine_set_drawing_style: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_set_drawing_text: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_drawing_text_wrap: (a: number, b: number, c: number) => void;
    readonly chartengine_set_drawings_visible: (a: number, b: number) => void;
    readonly chartengine_set_elliott_manual_cursor: (a: number, b: number, c: number) => void;
    readonly chartengine_set_elliott_preview: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
    readonly chartengine_set_es_ema1_len: (a: number, b: number) => void;
    readonly chartengine_set_es_ema2_len: (a: number, b: number) => void;
    readonly chartengine_set_es_show_bos: (a: number, b: number) => void;
    readonly chartengine_set_es_show_ema1: (a: number, b: number) => void;
    readonly chartengine_set_es_show_ema2: (a: number, b: number) => void;
    readonly chartengine_set_es_show_wma: (a: number, b: number) => void;
    readonly chartengine_set_es_swing_len: (a: number, b: number) => void;
    readonly chartengine_set_es_wma_len: (a: number, b: number) => void;
    readonly chartengine_set_fib_ext_preview: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_set_font_size: (a: number, b: number) => void;
    readonly chartengine_set_footprint_tick_size: (a: number, b: number) => void;
    readonly chartengine_set_forex_signals_mode: (a: number, b: number) => void;
    readonly chartengine_set_forex_signals_setup: (a: number, b: number) => void;
    readonly chartengine_set_forex_signals_show_stats: (a: number, b: number) => void;
    readonly chartengine_set_fr_agg_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_fr_binance_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_fr_ratio: (a: number, b: number) => void;
    readonly chartengine_set_fr_show_agg: (a: number, b: number) => void;
    readonly chartengine_set_fr_show_sma: (a: number, b: number) => void;
    readonly chartengine_set_grid_color: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_grid_h_visible: (a: number, b: number) => void;
    readonly chartengine_set_grid_v_visible: (a: number, b: number) => void;
    readonly chartengine_set_heatmap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
    readonly chartengine_set_heatmap_color_scheme: (a: number, b: number) => void;
    readonly chartengine_set_heatmap_prefetch_range: (a: number, b: number) => void;
    readonly chartengine_set_heatmap_profile_brightness: (a: number, b: number) => void;
    readonly chartengine_set_heatmap_range: (a: number, b: number, c: number) => void;
    readonly chartengine_set_heatmap_show_profile: (a: number, b: number) => void;
    readonly chartengine_set_heatmap_walls: (a: number, b: number, c: number) => void;
    readonly chartengine_set_hover_price: (a: number, b: number) => void;
    readonly chartengine_set_iceberg_events: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_set_indicators_visible: (a: number, b: number) => void;
    readonly chartengine_set_kline_visible: (a: number, b: number) => void;
    readonly chartengine_set_klines: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_set_large_trades_data: (a: number, b: number, c: number) => void;
    readonly chartengine_set_license_state: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_liq_heatmap_cell_height: (a: number, b: number) => void;
    readonly chartengine_set_liq_heatmap_filled_pct: (a: number, b: number) => void;
    readonly chartengine_set_liq_heatmap_filled_zones: (a: number, b: number) => void;
    readonly chartengine_set_liq_heatmap_predictions: (a: number, b: number) => void;
    readonly chartengine_set_liq_heatmap_profile: (a: number, b: number) => void;
    readonly chartengine_set_liq_heatmap_range: (a: number, b: number, c: number) => void;
    readonly chartengine_set_live_signals_data: (a: number, b: number, c: number) => void;
    readonly chartengine_set_live_signals_leverage: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_loading: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_pip_value: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_show_entry: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_show_labels: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_show_max_profit: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_show_tp_sl: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_show_zones: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_text_size: (a: number, b: number) => void;
    readonly chartengine_set_live_signals_trial: (a: number, b: number) => void;
    readonly chartengine_set_lt_bubble_scale: (a: number, b: number) => void;
    readonly chartengine_set_lt_volume_filter: (a: number, b: number, c: number) => void;
    readonly chartengine_set_mrd_pullback_entry_mode: (a: number, b: number) => void;
    readonly chartengine_set_mrd_pullback_htf_klines: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_set_mrd_pullback_show_hidden_div: (a: number, b: number) => void;
    readonly chartengine_set_mrd_pullback_sr_mode: (a: number, b: number) => void;
    readonly chartengine_set_mrd_pullback_text_size: (a: number, b: number) => void;
    readonly chartengine_set_mrd_pullback_tf_mode: (a: number, b: number) => void;
    readonly chartengine_set_mrd_pullback_trend_mode: (a: number, b: number) => void;
    readonly chartengine_set_obf_data: (a: number, b: number, c: number) => void;
    readonly chartengine_set_obf_ratio: (a: number, b: number) => void;
    readonly chartengine_set_obf_show_cum_delta: (a: number, b: number) => void;
    readonly chartengine_set_obf_show_net_flow: (a: number, b: number) => void;
    readonly chartengine_set_obf_show_obi: (a: number, b: number) => void;
    readonly chartengine_set_obm_anchor_top_right: (a: number, b: number) => void;
    readonly chartengine_set_obm_data: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number) => void;
    readonly chartengine_set_obs_com: (a: number, b: number) => void;
    readonly chartengine_set_obs_gaps: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_obs_show_alerts: (a: number, b: number) => void;
    readonly chartengine_set_obs_show_com: (a: number, b: number) => void;
    readonly chartengine_set_obs_show_gaps: (a: number, b: number) => void;
    readonly chartengine_set_obs_show_walls: (a: number, b: number) => void;
    readonly chartengine_set_obs_walls: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_oi_data: (a: number, b: number, c: number) => void;
    readonly chartengine_set_oi_data_ts: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_oi_display_mode: (a: number, b: number) => void;
    readonly chartengine_set_oi_ratio: (a: number, b: number) => void;
    readonly chartengine_set_oi_show_on_chart: (a: number, b: number) => void;
    readonly chartengine_set_path_cursor: (a: number, b: number, c: number) => void;
    readonly chartengine_set_price_precision: (a: number, b: number) => void;
    readonly chartengine_set_real_timestamps: (a: number, b: number, c: number) => void;
    readonly chartengine_set_replay_hovered: (a: number, b: number) => void;
    readonly chartengine_set_replay_preview: (a: number, b: number) => void;
    readonly chartengine_set_replay_state: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_set_rsi_period: (a: number, b: number) => void;
    readonly chartengine_set_rsi_ratio: (a: number, b: number) => void;
    readonly chartengine_set_rsi_show_divergence: (a: number, b: number) => void;
    readonly chartengine_set_rsi_show_ema: (a: number, b: number) => void;
    readonly chartengine_set_rsi_show_levels: (a: number, b: number) => void;
    readonly chartengine_set_rsi_show_on_chart: (a: number, b: number) => void;
    readonly chartengine_set_rsi_show_signals: (a: number, b: number) => void;
    readonly chartengine_set_rsi_show_traps: (a: number, b: number) => void;
    readonly chartengine_set_rsi_show_wma: (a: number, b: number) => void;
    readonly chartengine_set_rsi_smoothing: (a: number, b: number) => void;
    readonly chartengine_set_si_show_icebergs: (a: number, b: number) => void;
    readonly chartengine_set_si_show_stops: (a: number, b: number) => void;
    readonly chartengine_set_si_show_zones: (a: number, b: number) => void;
    readonly chartengine_set_sr_fvg_extend: (a: number, b: number) => void;
    readonly chartengine_set_sr_fvg_htf: (a: number, b: number) => void;
    readonly chartengine_set_sr_fvg_mitigation: (a: number, b: number) => void;
    readonly chartengine_set_sr_fvg_theme: (a: number, b: number) => void;
    readonly chartengine_set_sr_htf_minutes: (a: number, b: number) => void;
    readonly chartengine_set_sr_mitigation: (a: number, b: number) => void;
    readonly chartengine_set_sr_ob_last: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_breakers: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_fvg: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_fvg_signals: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_htf_ob: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_metrics: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_ob: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_ob_activity: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_ob_signals: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_predict: (a: number, b: number) => void;
    readonly chartengine_set_sr_show_smart_rev: (a: number, b: number) => void;
    readonly chartengine_set_sr_smart_rev_htf: (a: number, b: number) => void;
    readonly chartengine_set_sr_stats_position: (a: number, b: number) => void;
    readonly chartengine_set_sr_stats_type: (a: number, b: number) => void;
    readonly chartengine_set_sr_text_size: (a: number, b: number) => void;
    readonly chartengine_set_theme: (a: number, b: number) => void;
    readonly chartengine_set_touch_mode: (a: number, b: number) => void;
    readonly chartengine_set_tpo_ib: (a: number, b: number) => void;
    readonly chartengine_set_tpo_ib_minutes: (a: number, b: number) => void;
    readonly chartengine_set_tpo_letter_minutes: (a: number, b: number) => void;
    readonly chartengine_set_tpo_naked_poc: (a: number, b: number) => void;
    readonly chartengine_set_tpo_period: (a: number, b: number) => void;
    readonly chartengine_set_tpo_poc_line: (a: number, b: number) => void;
    readonly chartengine_set_tpo_profile_shape: (a: number, b: number) => void;
    readonly chartengine_set_tpo_signals: (a: number, b: number) => void;
    readonly chartengine_set_tpo_single_prints: (a: number, b: number) => void;
    readonly chartengine_set_tpo_va_lines: (a: number, b: number) => void;
    readonly chartengine_set_volume_color_mode: (a: number, b: number) => void;
    readonly chartengine_set_volume_ma_period: (a: number, b: number) => void;
    readonly chartengine_set_volume_show_ma: (a: number, b: number) => void;
    readonly chartengine_set_volume_show_signals: (a: number, b: number) => void;
    readonly chartengine_set_vpin_bucket_size: (a: number, b: number) => void;
    readonly chartengine_set_vpin_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_vpin_num_buckets: (a: number, b: number) => void;
    readonly chartengine_set_vpin_ratio: (a: number, b: number) => void;
    readonly chartengine_set_vpin_show_sma: (a: number, b: number) => void;
    readonly chartengine_set_vpin_show_zones: (a: number, b: number) => void;
    readonly chartengine_set_vpin_threshold: (a: number, b: number) => void;
    readonly chartengine_set_vrvp_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_vrvp_poc_line: (a: number, b: number) => void;
    readonly chartengine_show_latest: (a: number, b: number) => void;
    readonly chartengine_start_brush: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_start_elliott_manual: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_start_path: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_update_drawing_anchor: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_update_heatmap_column: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_update_heatmap_column_at: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_update_last_heatmap_column: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_update_last_kline: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_update_mrd_pullback_last_htf_kline: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_upsert_cvd_divergence: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_upsert_cvd_orderblock_ob: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number, b1: number, c1: number, d1: number, e1: number, f1: number, g1: number, h1: number, i1: number, j1: number, k1: number) => void;
    readonly chartengine_upsert_cvd_regime_flip: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
    readonly chartengine_upsert_cvd_trade_signal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number) => void;
    readonly chartengine_vpin_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_vrvp_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_world_to_screen_x: (a: number, b: number) => number;
    readonly chartengine_world_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_zoom: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_zoom_indicator_y: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_zoom_x: (a: number, b: number, c: number) => void;
    readonly chartengine_zoom_y: (a: number, b: number, c: number) => void;
    readonly orderbookengine_center_on_mid: (a: number) => void;
    readonly orderbookengine_clear: (a: number) => void;
    readonly orderbookengine_clear_hover: (a: number) => void;
    readonly orderbookengine_get_command_buffer_len: (a: number) => number;
    readonly orderbookengine_get_command_buffer_ptr: (a: number) => number;
    readonly orderbookengine_get_hover_price: (a: number) => number;
    readonly orderbookengine_get_hover_qty: (a: number) => number;
    readonly orderbookengine_get_hover_side: (a: number) => number;
    readonly orderbookengine_get_theme: (a: number) => number;
    readonly orderbookengine_is_dirty: (a: number) => number;
    readonly orderbookengine_new: (a: number, b: number) => number;
    readonly orderbookengine_pan_y: (a: number, b: number) => void;
    readonly orderbookengine_push_heatmap_col: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly orderbookengine_push_snapshot: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly orderbookengine_render: (a: number) => number;
    readonly orderbookengine_reset_ring: (a: number) => void;
    readonly orderbookengine_resize: (a: number, b: number, c: number) => void;
    readonly orderbookengine_set_auto_center: (a: number, b: number) => void;
    readonly orderbookengine_set_depth_book: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly orderbookengine_set_exchange_count: (a: number, b: number) => void;
    readonly orderbookengine_set_exchange_labels: (a: number, b: number, c: number) => void;
    readonly orderbookengine_set_heatmap_alpha_mul: (a: number, b: number) => void;
    readonly orderbookengine_set_heatmap_cols: (a: number, b: number) => void;
    readonly orderbookengine_set_hover: (a: number, b: number, c: number) => void;
    readonly orderbookengine_set_hover_y: (a: number, b: number) => void;
    readonly orderbookengine_set_price_precision: (a: number, b: number) => void;
    readonly orderbookengine_set_ring_capacity: (a: number, b: number, c: number) => void;
    readonly orderbookengine_set_show_cumulative: (a: number, b: number) => void;
    readonly orderbookengine_set_show_signal_overlays: (a: number, b: number) => void;
    readonly orderbookengine_set_signal_absorption: (a: number, b: number, c: number) => void;
    readonly orderbookengine_set_signal_flow: (a: number, b: number, c: number) => void;
    readonly orderbookengine_set_signal_gaps: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly orderbookengine_set_signal_obi: (a: number, b: number, c: number, d: number) => void;
    readonly orderbookengine_set_signal_spoof: (a: number, b: number) => void;
    readonly orderbookengine_set_signal_walls: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly orderbookengine_set_symbol: (a: number, b: number, c: number) => void;
    readonly orderbookengine_set_theme: (a: number, b: number) => void;
    readonly orderbookengine_set_tick_size: (a: number, b: number) => void;
    readonly orderbookengine_set_visible_ticks: (a: number, b: number) => void;
    readonly orderbookengine_zoom_y: (a: number, b: number, c: number) => void;
    readonly tickengine_chart_height_px: (a: number) => number;
    readonly tickengine_chart_left_px: (a: number) => number;
    readonly tickengine_chart_top_px: (a: number) => number;
    readonly tickengine_chart_width_px: (a: number) => number;
    readonly tickengine_clear: (a: number) => void;
    readonly tickengine_clear_hover: (a: number) => void;
    readonly tickengine_get_command_buffer_len: (a: number) => number;
    readonly tickengine_get_command_buffer_ptr: (a: number) => number;
    readonly tickengine_get_last_mid: (a: number) => number;
    readonly tickengine_hit_zone: (a: number, b: number, c: number) => number;
    readonly tickengine_is_dirty: (a: number) => number;
    readonly tickengine_new: (a: number, b: number) => number;
    readonly tickengine_pan_x: (a: number, b: number) => void;
    readonly tickengine_pan_y: (a: number, b: number) => void;
    readonly tickengine_push_book: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly tickengine_push_trade: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly tickengine_push_trades_batch: (a: number, b: number, c: number) => void;
    readonly tickengine_render: (a: number) => number;
    readonly tickengine_reset_view: (a: number) => void;
    readonly tickengine_reset_y_auto: (a: number) => void;
    readonly tickengine_resize: (a: number, b: number, c: number) => void;
    readonly tickengine_set_auto_scale_y: (a: number, b: number) => void;
    readonly tickengine_set_follow_live: (a: number, b: number) => void;
    readonly tickengine_set_heatmap_intensity: (a: number, b: number, c: number) => void;
    readonly tickengine_set_heatmap_palette: (a: number, b: number) => void;
    readonly tickengine_set_hover: (a: number, b: number, c: number) => void;
    readonly tickengine_set_large_trade_3d: (a: number, b: number) => void;
    readonly tickengine_set_large_trade_scale: (a: number, b: number) => void;
    readonly tickengine_set_lookback: (a: number, b: number, c: number) => void;
    readonly tickengine_set_price_precision: (a: number, b: number) => void;
    readonly tickengine_set_show_book_heatmap: (a: number, b: number) => void;
    readonly tickengine_set_show_grid: (a: number, b: number) => void;
    readonly tickengine_set_show_latest_profile: (a: number, b: number) => void;
    readonly tickengine_set_show_trade_tape: (a: number, b: number) => void;
    readonly tickengine_set_show_volume: (a: number, b: number) => void;
    readonly tickengine_set_show_vwap: (a: number, b: number) => void;
    readonly tickengine_set_theme: (a: number, b: number) => void;
    readonly tickengine_set_tick_size: (a: number, b: number) => void;
    readonly tickengine_xaxis_height_px: (a: number) => number;
    readonly tickengine_yaxis_width_px: (a: number) => number;
    readonly tickengine_zoom: (a: number, b: number, c: number, d: number) => void;
    readonly tickengine_zoom_x: (a: number, b: number, c: number) => void;
    readonly tickengine_zoom_y: (a: number, b: number, c: number) => void;
    readonly wasm_init: () => void;
    readonly wasm_memory: () => number;
    readonly __wbindgen_export: (a: number, b: number, c: number) => void;
    readonly __wbindgen_export2: (a: number, b: number) => number;
    readonly __wbindgen_export3: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
