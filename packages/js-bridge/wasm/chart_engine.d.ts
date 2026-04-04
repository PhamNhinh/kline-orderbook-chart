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
     * Append a brand-new column (new candle) to the heatmap.
     */
    append_heatmap_column(values: Float64Array, col_timestamp: number, y_start: number, y_step: number): void;
    append_kline(ts: number, o: number, h: number, l: number, c: number, v: number): void;
    /**
     * Append a single real timestamp (call after `append_kline` for Forex).
     */
    append_real_timestamp(real_ts: number): void;
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
    clear_channel_preview(): void;
    clear_drawing_preview(): void;
    clear_drawings(): void;
    clear_elliott_preview(): void;
    clear_fib_ext_preview(): void;
    clear_heatmap_prefetch_range(): void;
    clear_hover_price(): void;
    clear_large_trades(): void;
    clear_live_signals(): void;
    clear_markers(): void;
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
    delta_histogram_enabled(): boolean;
    deselect_drawing(): void;
    deselect_marker(): void;
    disable_cvd(): void;
    disable_delta_histogram(): void;
    disable_ema_structure(): void;
    disable_forex_signals(): void;
    disable_funding_rate(): void;
    disable_large_trades(): void;
    disable_liq_heatmap(): void;
    disable_live_signals(): void;
    disable_oi(): void;
    disable_rsi(): void;
    disable_smart_ranges(): void;
    disable_stop_iceberg(): void;
    disable_tpo(): void;
    disable_volume(): void;
    disable_vpin(): void;
    disable_vrvp(): void;
    drawing_count(): number;
    enable_cvd(): void;
    enable_delta_histogram(): void;
    enable_ema_structure(): void;
    enable_forex_signals(): void;
    enable_funding_rate(): void;
    enable_large_trades(): void;
    enable_liq_heatmap(): void;
    enable_live_signals(): void;
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
    get_chart_type(): number;
    get_command_buffer_len(): number;
    get_command_buffer_ptr(): number;
    get_custom_buffer_len(): number;
    get_custom_buffer_ptr(): number;
    get_cvd_mode(): number;
    get_cvd_ratio(): number;
    get_cvd_show_delta(): boolean;
    get_cvd_show_divergence(): boolean;
    get_cvd_show_signals(): boolean;
    get_cvd_source(): number;
    get_drawing_color(id: number): number;
    get_drawing_dashed(id: number): boolean;
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
    get_forex_signals_count(): number;
    get_fr_ratio(): number;
    get_heatmap_data_max(): number;
    get_heatmap_data_min(): number;
    /**
     * Return the timestamp of the last heatmap column.
     */
    get_heatmap_last_timestamp(): number;
    get_heatmap_prefetch_max(): number;
    get_heatmap_x_step(): number;
    get_iceberg_count(): number;
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
    is_cvd_enabled(): boolean;
    is_dirty(): boolean;
    is_ema_structure_enabled(): boolean;
    is_forex_signals_enabled(): boolean;
    is_funding_rate_enabled(): boolean;
    is_large_trades_enabled(): boolean;
    is_liq_heatmap_enabled(): boolean;
    is_liq_heatmap_filled_zones(): boolean;
    is_liq_heatmap_predictions(): boolean;
    is_liq_heatmap_profile(): boolean;
    is_live_signals_enabled(): boolean;
    is_oi_enabled(): boolean;
    is_rsi_enabled(): boolean;
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
    oi_to_screen_y(val: number): number;
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
    push_large_trade(ts: number, price: number, vol_usd: number, side_type: number): void;
    remove_drawing(id: number): void;
    remove_marker(id: number): void;
    render(): number;
    /**
     * Reset an indicator pane's Y axis back to auto-scale.
     */
    reset_indicator_y_auto(pane: number): void;
    resize(width: number, height: number): void;
    rsi_to_screen_y(val: number): number;
    screen_to_cvd_y(sy: number): number;
    screen_to_fr_y(sy: number): number;
    screen_to_oi_y(sy: number): number;
    screen_to_rsi_y(sy: number): number;
    screen_to_vpin_y(sy: number): number;
    screen_to_world_x(sx: number): number;
    screen_to_world_y(sy: number): number;
    select_drawing(id: number): void;
    select_marker(id: number): void;
    set_candle_interval(seconds: number): void;
    set_channel_preview(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, r: number, g: number, b: number, line_width: number, _dashed: boolean, pane: number): void;
    set_chart_type(ct: number): void;
    set_crosshair(sx: number, sy: number): void;
    set_cvd_data(taker_buy_vol: Float64Array, total_vol: Float64Array): void;
    set_cvd_mode(mode: number): void;
    set_cvd_ratio(ratio: number): void;
    set_cvd_show_delta(show: boolean): void;
    set_cvd_show_divergence(show: boolean): void;
    set_cvd_show_signals(show: boolean): void;
    set_cvd_source(mode: number): void;
    set_cvd_spot_data(taker_buy_vol: Float64Array, total_vol: Float64Array): void;
    set_drawing_dashed(id: number, dashed: boolean): void;
    set_drawing_font_size(id: number, font_size: number): void;
    set_drawing_hide_label(id: number, hide: boolean): void;
    set_drawing_preview(kind: number, x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, line_width: number, dashed: boolean, pane: number): void;
    set_drawing_style(id: number, r: number, g: number, b: number, line_width: number): void;
    set_drawing_text(id: number, text: string): void;
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
    set_footprint_tick_size(tick: number): void;
    set_forex_signals_mode(mode: number): void;
    set_forex_signals_setup(is_btc_5m: boolean): void;
    set_forex_signals_show_stats(show: boolean): void;
    set_fr_agg_data(timestamps: Float64Array, values: Float64Array): void;
    set_fr_binance_data(timestamps: Float64Array, values: Float64Array): void;
    set_fr_ratio(ratio: number): void;
    set_fr_show_agg(show: boolean): void;
    set_fr_show_sma(show: boolean): void;
    set_heatmap(matrix: Float64Array, rows: number, cols: number, x_start: number, x_step: number, y_start: number, y_step: number): void;
    /**
     * Store the server-reported total volume max so that progressive chunk
     * loading produces stable heatmap colours from the first rendered chunk.
     * Does NOT mark dirty — this only affects future normalization, not current pixels.
     */
    set_heatmap_prefetch_range(max: number): void;
    set_heatmap_range(min: number, max: number): void;
    set_hover_price(price: number): void;
    set_iceberg_events(timestamps: Float64Array, prices: Float64Array, visible_sizes: Float64Array, hidden_sizes: Float64Array, is_bids: Uint8Array, refill_counts: Uint32Array): void;
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

export function wasm_memory(): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __mrd_chartengine_free: (a: number, b: number) => void;
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
    readonly chartengine_append_heatmap_column: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_append_kline: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly chartengine_append_real_timestamp: (a: number, b: number) => void;
    readonly chartengine_cancel_brush: (a: number) => void;
    readonly chartengine_cancel_elliott_manual: (a: number) => void;
    readonly chartengine_cancel_path: (a: number) => void;
    readonly chartengine_chart_area_h: (a: number) => number;
    readonly chartengine_chart_area_w: (a: number) => number;
    readonly chartengine_chart_area_x: (a: number) => number;
    readonly chartengine_chart_area_y: (a: number) => number;
    readonly chartengine_clear_channel_preview: (a: number) => void;
    readonly chartengine_clear_drawing_preview: (a: number) => void;
    readonly chartengine_clear_drawings: (a: number) => void;
    readonly chartengine_clear_elliott_preview: (a: number) => void;
    readonly chartengine_clear_fib_ext_preview: (a: number) => void;
    readonly chartengine_clear_heatmap_prefetch_range: (a: number) => void;
    readonly chartengine_clear_hover_price: (a: number) => void;
    readonly chartengine_clear_large_trades: (a: number) => void;
    readonly chartengine_clear_live_signals: (a: number) => void;
    readonly chartengine_clear_markers: (a: number) => void;
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
    readonly chartengine_delta_histogram_enabled: (a: number) => number;
    readonly chartengine_deselect_drawing: (a: number) => void;
    readonly chartengine_deselect_marker: (a: number) => void;
    readonly chartengine_disable_cvd: (a: number) => void;
    readonly chartengine_disable_delta_histogram: (a: number) => void;
    readonly chartengine_disable_ema_structure: (a: number) => void;
    readonly chartengine_disable_forex_signals: (a: number) => void;
    readonly chartengine_disable_funding_rate: (a: number) => void;
    readonly chartengine_disable_large_trades: (a: number) => void;
    readonly chartengine_disable_liq_heatmap: (a: number) => void;
    readonly chartengine_disable_live_signals: (a: number) => void;
    readonly chartengine_disable_oi: (a: number) => void;
    readonly chartengine_disable_rsi: (a: number) => void;
    readonly chartengine_disable_smart_ranges: (a: number) => void;
    readonly chartengine_disable_stop_iceberg: (a: number) => void;
    readonly chartengine_disable_tpo: (a: number) => void;
    readonly chartengine_disable_volume: (a: number) => void;
    readonly chartengine_disable_vpin: (a: number) => void;
    readonly chartengine_disable_vrvp: (a: number) => void;
    readonly chartengine_drawing_count: (a: number) => number;
    readonly chartengine_enable_cvd: (a: number) => void;
    readonly chartengine_enable_delta_histogram: (a: number) => void;
    readonly chartengine_enable_ema_structure: (a: number) => void;
    readonly chartengine_enable_forex_signals: (a: number) => void;
    readonly chartengine_enable_funding_rate: (a: number) => void;
    readonly chartengine_enable_large_trades: (a: number) => void;
    readonly chartengine_enable_liq_heatmap: (a: number) => void;
    readonly chartengine_enable_live_signals: (a: number) => void;
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
    readonly chartengine_get_chart_type: (a: number) => number;
    readonly chartengine_get_command_buffer_len: (a: number) => number;
    readonly chartengine_get_command_buffer_ptr: (a: number) => number;
    readonly chartengine_get_custom_buffer_len: (a: number) => number;
    readonly chartengine_get_custom_buffer_ptr: (a: number) => number;
    readonly chartengine_get_cvd_mode: (a: number) => number;
    readonly chartengine_get_cvd_ratio: (a: number) => number;
    readonly chartengine_get_cvd_show_delta: (a: number) => number;
    readonly chartengine_get_cvd_show_divergence: (a: number) => number;
    readonly chartengine_get_cvd_show_signals: (a: number) => number;
    readonly chartengine_get_cvd_source: (a: number) => number;
    readonly chartengine_get_drawing_color: (a: number, b: number) => number;
    readonly chartengine_get_drawing_dashed: (a: number, b: number) => number;
    readonly chartengine_get_drawing_font_size: (a: number, b: number) => number;
    readonly chartengine_get_drawing_hide_label: (a: number, b: number) => number;
    readonly chartengine_get_drawing_kind_id: (a: number, b: number) => number;
    readonly chartengine_get_drawing_text: (a: number, b: number, c: number) => void;
    readonly chartengine_get_forex_signals_count: (a: number) => number;
    readonly chartengine_get_fr_ratio: (a: number) => number;
    readonly chartengine_get_heatmap_data_max: (a: number) => number;
    readonly chartengine_get_heatmap_data_min: (a: number) => number;
    readonly chartengine_get_heatmap_last_timestamp: (a: number) => number;
    readonly chartengine_get_heatmap_prefetch_max: (a: number) => number;
    readonly chartengine_get_heatmap_x_step: (a: number) => number;
    readonly chartengine_get_iceberg_count: (a: number) => number;
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
    readonly chartengine_is_cvd_enabled: (a: number) => number;
    readonly chartengine_is_dirty: (a: number) => number;
    readonly chartengine_is_ema_structure_enabled: (a: number) => number;
    readonly chartengine_is_forex_signals_enabled: (a: number) => number;
    readonly chartengine_is_funding_rate_enabled: (a: number) => number;
    readonly chartengine_is_large_trades_enabled: (a: number) => number;
    readonly chartengine_is_liq_heatmap_enabled: (a: number) => number;
    readonly chartengine_is_liq_heatmap_filled_zones: (a: number) => number;
    readonly chartengine_is_liq_heatmap_predictions: (a: number) => number;
    readonly chartengine_is_liq_heatmap_profile: (a: number) => number;
    readonly chartengine_is_live_signals_enabled: (a: number) => number;
    readonly chartengine_is_oi_enabled: (a: number) => number;
    readonly chartengine_is_rsi_enabled: (a: number) => number;
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
    readonly chartengine_oi_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_pan: (a: number, b: number, c: number) => void;
    readonly chartengine_pan_indicator_y: (a: number, b: number, c: number) => void;
    readonly chartengine_pan_x: (a: number, b: number) => void;
    readonly chartengine_pan_y: (a: number, b: number) => void;
    readonly chartengine_pop_last_kline: (a: number) => number;
    readonly chartengine_prepend_klines: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_push_large_trade: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_remove_drawing: (a: number, b: number) => void;
    readonly chartengine_remove_marker: (a: number, b: number) => void;
    readonly chartengine_render: (a: number) => number;
    readonly chartengine_reset_indicator_y_auto: (a: number, b: number) => void;
    readonly chartengine_resize: (a: number, b: number, c: number) => void;
    readonly chartengine_rsi_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_cvd_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_fr_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_oi_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_rsi_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_vpin_y: (a: number, b: number) => number;
    readonly chartengine_screen_to_world_x: (a: number, b: number) => number;
    readonly chartengine_screen_to_world_y: (a: number, b: number) => number;
    readonly chartengine_select_drawing: (a: number, b: number) => void;
    readonly chartengine_select_marker: (a: number, b: number) => void;
    readonly chartengine_set_candle_interval: (a: number, b: number) => void;
    readonly chartengine_set_channel_preview: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly chartengine_set_chart_type: (a: number, b: number) => void;
    readonly chartengine_set_crosshair: (a: number, b: number, c: number) => void;
    readonly chartengine_set_cvd_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_cvd_mode: (a: number, b: number) => void;
    readonly chartengine_set_cvd_ratio: (a: number, b: number) => void;
    readonly chartengine_set_cvd_show_delta: (a: number, b: number) => void;
    readonly chartengine_set_cvd_show_divergence: (a: number, b: number) => void;
    readonly chartengine_set_cvd_show_signals: (a: number, b: number) => void;
    readonly chartengine_set_cvd_source: (a: number, b: number) => void;
    readonly chartengine_set_cvd_spot_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_drawing_dashed: (a: number, b: number, c: number) => void;
    readonly chartengine_set_drawing_font_size: (a: number, b: number, c: number) => void;
    readonly chartengine_set_drawing_hide_label: (a: number, b: number, c: number) => void;
    readonly chartengine_set_drawing_preview: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
    readonly chartengine_set_drawing_style: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chartengine_set_drawing_text: (a: number, b: number, c: number, d: number) => void;
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
    readonly chartengine_set_footprint_tick_size: (a: number, b: number) => void;
    readonly chartengine_set_forex_signals_mode: (a: number, b: number) => void;
    readonly chartengine_set_forex_signals_setup: (a: number, b: number) => void;
    readonly chartengine_set_forex_signals_show_stats: (a: number, b: number) => void;
    readonly chartengine_set_fr_agg_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_fr_binance_data: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly chartengine_set_fr_ratio: (a: number, b: number) => void;
    readonly chartengine_set_fr_show_agg: (a: number, b: number) => void;
    readonly chartengine_set_fr_show_sma: (a: number, b: number) => void;
    readonly chartengine_set_heatmap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
    readonly chartengine_set_heatmap_prefetch_range: (a: number, b: number) => void;
    readonly chartengine_set_heatmap_range: (a: number, b: number, c: number) => void;
    readonly chartengine_set_hover_price: (a: number, b: number) => void;
    readonly chartengine_set_iceberg_events: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
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
    readonly chartengine_vpin_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_vrvp_hit_test: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_world_to_screen_x: (a: number, b: number) => number;
    readonly chartengine_world_to_screen_y: (a: number, b: number) => number;
    readonly chartengine_zoom: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_zoom_indicator_y: (a: number, b: number, c: number, d: number) => void;
    readonly chartengine_zoom_x: (a: number, b: number, c: number) => void;
    readonly chartengine_zoom_y: (a: number, b: number, c: number) => void;
    readonly wasm_memory: () => number;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export3: (a: number, b: number, c: number) => void;
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
export default function __mrd_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
