/**
 * Bridge methods for all chart indicators.
 * Extracted from bridge.js for maintainability.
 *
 * Feature gating: getGate() returns the current feature gate function.
 * gate(featureKey) returns true if allowed, false + console.warn if blocked.
 */
export function createIndicatorMethods(engine, markDirty, isDestroyed, getGate) {
  const gate = (k) => getGate()(k)

  return {
    // ── RSI ──

    enableRsi() {
      engine.enable_rsi()
      markDirty()
    },

    disableRsi() {
      engine.disable_rsi()
      markDirty()
    },

    setRsiPeriod(period) {
      engine.set_rsi_period(period)
      markDirty()
    },

    isRsiEnabled() {
      return engine.is_rsi_enabled()
    },

    setRsiShowEma(show) {
      engine.set_rsi_show_ema(show)
      markDirty()
    },

    setRsiShowWma(show) {
      engine.set_rsi_show_wma(show)
      markDirty()
    },

    setRsiShowSignals(show) {
      engine.set_rsi_show_signals(show)
      markDirty()
    },

    setRsiShowDivergence(show) {
      engine.set_rsi_show_divergence(show)
      markDirty()
    },

    setRsiShowTraps(show) {
      engine.set_rsi_show_traps(show)
      markDirty()
    },

    setRsiSmoothing(val) {
      engine.set_rsi_smoothing(val)
      markDirty()
    },

    setRsiRatio(ratio) {
      engine.set_rsi_ratio(ratio)
      markDirty()
    },

    getRsiRatio() {
      return engine.get_rsi_ratio()
    },

    // ── Forex Signals ── (Enterprise)

    enableForexSignals() {
      if (!gate('forexSignals')) return
      engine.enable_forex_signals()
      markDirty()
    },

    disableForexSignals() {
      engine.disable_forex_signals()
      markDirty()
    },

    isForexSignalsEnabled() {
      return engine.is_forex_signals_enabled()
    },

    setForexSignalsSetup(isBtc5m) {
      engine.set_forex_signals_setup(isBtc5m)
      markDirty()
    },

    setForexSignalsMode(mode) {
      engine.set_forex_signals_mode(mode)
      markDirty()
    },

    setForexSignalsShowStats(show) {
      engine.set_forex_signals_show_stats(show)
      markDirty()
    },

    getForexSignalsCount() {
      return engine.get_forex_signals_count()
    },

    // ── Open Interest ── (Professional+)

    enableOi() {
      if (isDestroyed()) return
      if (!gate('oi')) return
      engine.enable_oi()
      markDirty()
    },

    disableOi() {
      if (isDestroyed()) return
      engine.disable_oi()
      markDirty()
    },

    isOiEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_oi_enabled() } catch { return false }
    },

    setOiData(values) {
      if (isDestroyed()) return
      engine.set_oi_data(values)
      markDirty()
    },

    setOiDataTs(timestamps, values) {
      if (isDestroyed()) return
      engine.set_oi_data_ts(timestamps, values)
      markDirty()
    },

    setOiShowOnChart(show) {
      if (isDestroyed()) return
      engine.set_oi_show_on_chart(show)
      markDirty()
    },

    setOiDisplayMode(mode) {
      if (isDestroyed()) return
      engine.set_oi_display_mode(mode)
      markDirty()
    },

    setOiRatio(ratio) {
      if (isDestroyed()) return
      engine.set_oi_ratio(ratio)
      markDirty()
    },

    getOiRatio() {
      if (isDestroyed()) return 0.2
      try { return engine.get_oi_ratio() } catch { return 0.2 }
    },

    // ── Funding Rate ── (Professional+)

    enableFundingRate() {
      if (isDestroyed()) return
      if (!gate('fundingRate')) return
      engine.enable_funding_rate()
      markDirty()
    },

    disableFundingRate() {
      if (isDestroyed()) return
      engine.disable_funding_rate()
      markDirty()
    },

    isFundingRateEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_funding_rate_enabled() } catch { return false }
    },

    setFrBinanceData(timestamps, values) {
      if (isDestroyed()) return
      engine.set_fr_binance_data(timestamps, values)
      markDirty()
    },

    setFrAggData(timestamps, values) {
      if (isDestroyed()) return
      engine.set_fr_agg_data(timestamps, values)
      markDirty()
    },

    setFrShowAgg(show) {
      if (isDestroyed()) return
      engine.set_fr_show_agg(show)
      markDirty()
    },

    setFrShowSma(show) {
      if (isDestroyed()) return
      engine.set_fr_show_sma(show)
      markDirty()
    },

    // ── CVD (Cumulative Volume Delta) ── (Professional+)

    enableCvd() {
      if (isDestroyed()) return
      if (!gate('cvd')) return
      engine.enable_cvd()
      markDirty()
    },

    disableCvd() {
      if (isDestroyed()) return
      engine.disable_cvd()
      markDirty()
    },

    isCvdEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_cvd_enabled() } catch { return false }
    },

    setCvdData(takerBuyVol, totalVol) {
      if (isDestroyed()) return
      engine.set_cvd_data(takerBuyVol, totalVol)
      markDirty()
    },

    setCvdSpotData(takerBuyVol, totalVol) {
      if (isDestroyed()) return
      engine.set_cvd_spot_data(takerBuyVol, totalVol)
      markDirty()
    },

    setCvdSource(mode) {
      if (isDestroyed()) return
      engine.set_cvd_source(mode)
      markDirty()
    },

    getCvdSource() {
      if (isDestroyed()) return 0
      try { return engine.get_cvd_source() } catch { return 0 }
    },

    setCvdMode(mode) {
      if (isDestroyed()) return
      engine.set_cvd_mode(mode)
      markDirty()
    },

    getCvdMode() {
      if (isDestroyed()) return 0
      try { return engine.get_cvd_mode() } catch { return 0 }
    },

    setCvdShowDelta(show) {
      if (isDestroyed()) return
      engine.set_cvd_show_delta(show)
      markDirty()
    },

    getCvdShowDelta() {
      if (isDestroyed()) return true
      try { return engine.get_cvd_show_delta() } catch { return true }
    },

    setCvdShowSignals(show) {
      if (isDestroyed()) return
      engine.set_cvd_show_signals(show)
      markDirty()
    },

    getCvdShowSignals() {
      if (isDestroyed()) return true
      try { return engine.get_cvd_show_signals() } catch { return true }
    },

    setCvdShowDivergence(show) {
      if (isDestroyed()) return
      engine.set_cvd_show_divergence(show)
      markDirty()
    },

    getCvdShowDivergence() {
      if (isDestroyed()) return false
      try { return engine.get_cvd_show_divergence() } catch { return false }
    },

    // ── Large Trades ── (Professional+)

    enableLargeTrades() {
      if (isDestroyed()) return
      if (!gate('largeTrades')) return
      engine.enable_large_trades()
      markDirty()
    },

    disableLargeTrades() {
      if (isDestroyed()) return
      engine.disable_large_trades()
      markDirty()
    },

    isLargeTradesEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_large_trades_enabled() } catch { return false }
    },

    setLargeTradesData(flat) {
      if (isDestroyed()) return
      engine.set_large_trades_data(flat)
      markDirty()
    },

    pushLargeTrade(ts, price, volUsd, sideType) {
      if (isDestroyed()) return
      engine.push_large_trade(ts, price, volUsd, sideType)
      markDirty()
    },

    clearLargeTrades() {
      if (isDestroyed()) return
      engine.clear_large_trades()
      markDirty()
    },

    setLtVolumeFilter(min, max) {
      if (isDestroyed()) return
      engine.set_lt_volume_filter(min, max)
      markDirty()
    },

    setLtBubbleScale(scale) {
      if (isDestroyed()) return
      engine.set_lt_bubble_scale(scale)
      markDirty()
    },

    getLtDataMinVol() {
      if (isDestroyed()) return 0
      return engine.get_lt_data_min_vol()
    },

    getLtDataMaxVol() {
      if (isDestroyed()) return 0
      return engine.get_lt_data_max_vol()
    },

    ltHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.lt_hit_test(sx, sy) } catch { return '' }
    },

    // ── VRVP ── (Enterprise)

    enableVrvp() {
      if (isDestroyed()) return
      if (!gate('vrvp')) return
      engine.enable_vrvp()
      markDirty()
    },

    disableVrvp() {
      if (isDestroyed()) return
      engine.disable_vrvp()
      markDirty()
    },

    isVrvpEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_vrvp_enabled() } catch { return false }
    },

    setVrvpPocLine(show) {
      if (isDestroyed()) return
      engine.set_vrvp_poc_line(show)
      markDirty()
    },

    vrvpHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.vrvp_hit_test(sx, sy) } catch { return '' }
    },

    // ── TPO (Time Price Opportunity / Market Profile) ── (Enterprise)

    enableTpo() {
      if (isDestroyed()) return
      if (!gate('tpo')) return
      engine.enable_tpo()
      markDirty()
    },

    disableTpo() {
      if (isDestroyed()) return
      engine.disable_tpo()
      markDirty()
    },

    isTpoEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_tpo_enabled() } catch { return false }
    },

    setTpoPocLine(show) {
      if (isDestroyed()) return
      engine.set_tpo_poc_line(show)
      markDirty()
    },

    setTpoVaLines(show) {
      if (isDestroyed()) return
      engine.set_tpo_va_lines(show)
      markDirty()
    },

    setTpoIb(show) {
      if (isDestroyed()) return
      engine.set_tpo_ib(show)
      markDirty()
    },

    setTpoSinglePrints(show) {
      if (isDestroyed()) return
      engine.set_tpo_single_prints(show)
      markDirty()
    },

    setTpoPeriod(minutes) {
      if (isDestroyed()) return
      engine.set_tpo_period(minutes)
      markDirty()
    },

    getTpoPeriod() {
      if (isDestroyed()) return 1440
      try { return engine.get_tpo_period() } catch { return 1440 }
    },

    setTpoNakedPoc(show) {
      if (isDestroyed()) return
      engine.set_tpo_naked_poc(show)
      markDirty()
    },

    setTpoProfileShape(show) {
      if (isDestroyed()) return
      engine.set_tpo_profile_shape(show)
      markDirty()
    },

    setTpoIbMinutes(minutes) {
      if (isDestroyed()) return
      engine.set_tpo_ib_minutes(minutes)
      markDirty()
    },

    setTpoLetterMinutes(minutes) {
      if (isDestroyed()) return
      engine.set_tpo_letter_minutes(minutes)
      markDirty()
    },

    setTpoSignals(show) {
      if (isDestroyed()) return
      engine.set_tpo_signals(show)
      markDirty()
    },

    isTpoSignals() {
      if (isDestroyed()) return false
      try { return engine.is_tpo_signals() } catch { return false }
    },

    // ── Liquidation Heatmap ── (Professional+)

    enableLiqHeatmap() {
      if (isDestroyed()) return
      if (!gate('liqHeatmap')) return
      engine.enable_liq_heatmap()
      markDirty()
    },

    disableLiqHeatmap() {
      if (isDestroyed()) return
      engine.disable_liq_heatmap()
      markDirty()
    },

    isLiqHeatmapEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_liq_heatmap_enabled() } catch { return false }
    },

    setLiqHeatmapRange(min, max) {
      if (isDestroyed()) return
      engine.set_liq_heatmap_range(min, max)
      markDirty()
    },

    getLiqHeatmapMin() {
      if (isDestroyed()) return 0
      try { return engine.get_liq_heatmap_min() } catch { return 0 }
    },

    getLiqHeatmapMax() {
      if (isDestroyed()) return 1
      try { return engine.get_liq_heatmap_max() } catch { return 1 }
    },

    getLiqHeatmapSegMax() {
      if (isDestroyed()) return 0
      try { return engine.get_liq_heatmap_seg_max() } catch { return 0 }
    },

    setLiqHeatmapProfile(show) {
      if (isDestroyed()) return
      engine.set_liq_heatmap_profile(show)
      markDirty()
    },

    isLiqHeatmapProfile() {
      if (isDestroyed()) return true
      try { return engine.is_liq_heatmap_profile() } catch { return true }
    },

    setLiqHeatmapCellHeight(mult) {
      if (isDestroyed()) return
      engine.set_liq_heatmap_cell_height(mult)
      markDirty()
    },

    getLiqHeatmapCellHeight() {
      if (isDestroyed()) return 1.0
      try { return engine.get_liq_heatmap_cell_height() } catch { return 1.0 }
    },

    setLiqHeatmapPredictions(show) {
      if (isDestroyed()) return
      engine.set_liq_heatmap_predictions(show)
      markDirty()
    },

    setLiqHeatmapFilledPct(pct) {
      if (isDestroyed()) return
      engine.set_liq_heatmap_filled_pct(pct)
      markDirty()
    },

    getLiqHeatmapFilledPct() {
      if (isDestroyed()) return 0.85
      try { return engine.get_liq_heatmap_filled_pct() } catch { return 0.85 }
    },

    liqHeatmapHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.liq_heatmap_hit_test(sx, sy) } catch { return '' }
    },

    liqZoneHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.liq_zone_hit_test(sx, sy) } catch { return '' }
    },

    // ── Smart Ranges ── (Enterprise)

    enableSmartRanges() {
      if (isDestroyed()) return
      if (!gate('smartRanges')) return
      engine.enable_smart_ranges()
      markDirty()
    },

    disableSmartRanges() {
      if (isDestroyed()) return
      engine.disable_smart_ranges()
      markDirty()
    },

    isSmartRangesEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_smart_ranges_enabled() } catch { return false }
    },

    setSrTextSize(size) {
      if (isDestroyed()) return
      engine.set_sr_text_size(size)
      markDirty()
    },

    setSrShowOb(show) {
      if (isDestroyed()) return
      engine.set_sr_show_ob(show)
      markDirty()
    },

    setSrObLast(count) {
      if (isDestroyed()) return
      engine.set_sr_ob_last(count)
      markDirty()
    },

    setSrShowObActivity(show) {
      if (isDestroyed()) return
      engine.set_sr_show_ob_activity(show)
      markDirty()
    },

    setSrShowBreakers(show) {
      if (isDestroyed()) return
      engine.set_sr_show_breakers(show)
      markDirty()
    },

    setSrMitigation(mode) {
      if (isDestroyed()) return
      engine.set_sr_mitigation(mode)
      markDirty()
    },

    setSrShowMetrics(show) {
      if (isDestroyed()) return
      engine.set_sr_show_metrics(show)
      markDirty()
    },

    setSrShowHtfOb(show) {
      if (isDestroyed()) return
      engine.set_sr_show_htf_ob(show)
      markDirty()
    },

    setSrHtfMinutes(minutes) {
      if (isDestroyed()) return
      engine.set_sr_htf_minutes(minutes)
      markDirty()
    },

    setSrShowFvg(show) {
      if (isDestroyed()) return
      engine.set_sr_show_fvg(show)
      markDirty()
    },

    setSrFvgTheme(theme) {
      if (isDestroyed()) return
      engine.set_sr_fvg_theme(theme)
      markDirty()
    },

    setSrFvgMitigation(mode) {
      if (isDestroyed()) return
      engine.set_sr_fvg_mitigation(mode)
      markDirty()
    },

    setSrFvgHtf(show) {
      if (isDestroyed()) return
      engine.set_sr_fvg_htf(show)
      markDirty()
    },

    setSrFvgExtend(extend) {
      if (isDestroyed()) return
      engine.set_sr_fvg_extend(extend)
      markDirty()
    },

    setSrShowObSignals(show) {
      if (isDestroyed()) return
      engine.set_sr_show_ob_signals(show)
      markDirty()
    },

    setSrShowPredict(show) {
      if (isDestroyed()) return
      engine.set_sr_show_predict(show)
      markDirty()
    },

    setSrShowFvgSignals(show) {
      if (isDestroyed()) return
      engine.set_sr_show_fvg_signals(show)
      markDirty()
    },

    setSrShowSmartRev(show) {
      if (isDestroyed()) return
      engine.set_sr_show_smart_rev(show)
      markDirty()
    },

    setSrSmartRevHtf(minutes) {
      if (isDestroyed()) return
      engine.set_sr_smart_rev_htf(minutes)
      markDirty()
    },

    setSrStatsType(type_) {
      if (isDestroyed()) return
      engine.set_sr_stats_type(type_)
      markDirty()
    },

    setSrStatsPosition(pos) {
      if (isDestroyed()) return
      engine.set_sr_stats_position(pos)
      markDirty()
    },

    getSrSignalsCount() {
      if (isDestroyed()) return 0
      try { return engine.get_sr_signals_count() } catch { return 0 }
    },

    // ── EMA Structure ── (Enterprise)

    enableEmaStructure() {
      if (isDestroyed()) return
      if (!gate('emaStructure')) return
      engine.enable_ema_structure()
      markDirty()
    },

    disableEmaStructure() {
      if (isDestroyed()) return
      engine.disable_ema_structure()
      markDirty()
    },

    isEmaStructureEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_ema_structure_enabled() } catch { return false }
    },

    setEsEma1Len(len) {
      if (isDestroyed()) return
      engine.set_es_ema1_len(len)
      markDirty()
    },

    setEsEma2Len(len) {
      if (isDestroyed()) return
      engine.set_es_ema2_len(len)
      markDirty()
    },

    setEsWmaLen(len) {
      if (isDestroyed()) return
      engine.set_es_wma_len(len)
      markDirty()
    },

    setEsShowEma1(show) {
      if (isDestroyed()) return
      engine.set_es_show_ema1(show)
      markDirty()
    },

    setEsShowEma2(show) {
      if (isDestroyed()) return
      engine.set_es_show_ema2(show)
      markDirty()
    },

    setEsShowWma(show) {
      if (isDestroyed()) return
      engine.set_es_show_wma(show)
      markDirty()
    },

    setEsSwingLen(len) {
      if (isDestroyed()) return
      engine.set_es_swing_len(len)
      markDirty()
    },

    setEsShowBos(show) {
      if (isDestroyed()) return
      engine.set_es_show_bos(show)
      markDirty()
    },

    // ── Live Signals ──

    enableLiveSignals() {
      if (isDestroyed()) return
      engine.enable_live_signals()
      markDirty()
    },

    disableLiveSignals() {
      if (isDestroyed()) return
      engine.disable_live_signals()
      markDirty()
    },

    isLiveSignalsEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_live_signals_enabled() } catch { return false }
    },

    setLiveSignalsData(flat) {
      if (isDestroyed()) return
      engine.set_live_signals_data(new Float64Array(flat))
      markDirty()
    },

    clearLiveSignals() {
      if (isDestroyed()) return
      engine.clear_live_signals()
      markDirty()
    },

    setLiveSignalsLeverage(leverage) {
      if (isDestroyed()) return
      engine.set_live_signals_leverage(leverage)
      markDirty()
    },

    getLiveSignalsLeverage() {
      if (isDestroyed()) return 10
      try { return engine.get_live_signals_leverage() } catch { return 10 }
    },

    setLiveSignalsTrial(isTrial) {
      if (isDestroyed()) return
      engine.set_live_signals_trial(isTrial)
      markDirty()
    },

    setLiveSignalsShowEntry(show) {
      if (isDestroyed()) return
      engine.set_live_signals_show_entry(show)
      markDirty()
    },

    setLiveSignalsShowTpSl(show) {
      if (isDestroyed()) return
      engine.set_live_signals_show_tp_sl(show)
      markDirty()
    },

    setLiveSignalsShowMaxProfit(show) {
      if (isDestroyed()) return
      engine.set_live_signals_show_max_profit(show)
      markDirty()
    },

    setLiveSignalsShowLabels(show) {
      if (isDestroyed()) return
      engine.set_live_signals_show_labels(show)
      markDirty()
    },

    setLiveSignalsShowZones(show) {
      if (isDestroyed()) return
      engine.set_live_signals_show_zones(show)
      markDirty()
    },

    setLiveSignalsTextSize(size) {
      if (isDestroyed()) return
      engine.set_live_signals_text_size(size)
      markDirty()
    },

    setLiveSignalsPipValue(pipValue) {
      if (isDestroyed()) return
      engine.set_live_signals_pip_value(pipValue)
      markDirty()
    },

    setLiveSignalsLoading(loading) {
      if (isDestroyed()) return
      engine.set_live_signals_loading(loading)
      markDirty()
    },

    getLiveSignalsCount() {
      if (isDestroyed()) return 0
      try { return engine.get_live_signals_count() } catch { return 0 }
    },

    // ── VPIN (Volume-Synchronized Probability of Informed Trading) ── (Enterprise)

    enableVpin() {
      if (isDestroyed()) return
      if (!gate('vpin')) return
      engine.enable_vpin()
      markDirty()
    },

    disableVpin() {
      if (isDestroyed()) return
      engine.disable_vpin()
      markDirty()
    },

    isVpinEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_vpin_enabled() } catch { return false }
    },

    setVpinData(takerBuyVol, totalVol) {
      if (isDestroyed()) return
      engine.set_vpin_data(takerBuyVol, totalVol)
      markDirty()
    },

    setVpinBucketSize(size) {
      if (isDestroyed()) return
      engine.set_vpin_bucket_size(size)
      markDirty()
    },

    getVpinBucketSize() {
      if (isDestroyed()) return 50
      try { return engine.get_vpin_bucket_size() } catch { return 50 }
    },

    setVpinNumBuckets(count) {
      if (isDestroyed()) return
      engine.set_vpin_num_buckets(count)
      markDirty()
    },

    getVpinNumBuckets() {
      if (isDestroyed()) return 50
      try { return engine.get_vpin_num_buckets() } catch { return 50 }
    },

    setVpinThreshold(threshold) {
      if (isDestroyed()) return
      engine.set_vpin_threshold(threshold)
      markDirty()
    },

    getVpinThreshold() {
      if (isDestroyed()) return 0.7
      try { return engine.get_vpin_threshold() } catch { return 0.7 }
    },

    setVpinShowSma(show) {
      if (isDestroyed()) return
      engine.set_vpin_show_sma(show)
      markDirty()
    },

    setVpinShowZones(show) {
      if (isDestroyed()) return
      engine.set_vpin_show_zones(show)
      markDirty()
    },

    // ── Stops & Icebergs ── (Enterprise)

    enableStopIceberg() {
      if (isDestroyed()) return
      if (!gate('stopIceberg')) return
      engine.enable_stop_iceberg()
      markDirty()
    },

    disableStopIceberg() {
      if (isDestroyed()) return
      engine.disable_stop_iceberg()
      markDirty()
    },

    isStopIcebergEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_stop_iceberg_enabled() } catch { return false }
    },

    setSiShowStops(show) {
      if (isDestroyed()) return
      engine.set_si_show_stops(show)
      markDirty()
    },

    setSiShowIcebergs(show) {
      if (isDestroyed()) return
      engine.set_si_show_icebergs(show)
      markDirty()
    },

    setSiShowZones(show) {
      if (isDestroyed()) return
      engine.set_si_show_zones(show)
      markDirty()
    },

    setIcebergEvents(timestamps, prices, visibleSizes, hiddenSizes, isBids, refillCounts) {
      if (isDestroyed()) return
      engine.set_iceberg_events(timestamps, prices, visibleSizes, hiddenSizes, isBids, refillCounts)
      markDirty()
    },

    getStopRunCount() {
      if (isDestroyed()) return 0
      try { return engine.get_stop_run_count() } catch { return 0 }
    },

    getIcebergCount() {
      if (isDestroyed()) return 0
      try { return engine.get_iceberg_count() } catch { return 0 }
    },

    // ── Volume ──

    enableVolume() {
      engine.enable_volume()
      markDirty()
    },

    disableVolume() {
      engine.disable_volume()
      markDirty()
    },

    isVolumeEnabled() {
      return engine.is_volume_enabled()
    },

    setVolumeMaPeriod(period) {
      engine.set_volume_ma_period(period)
      markDirty()
    },

    setVolumeShowMa(show) {
      engine.set_volume_show_ma(show)
      markDirty()
    },

    setVolumeShowSignals(show) {
      engine.set_volume_show_signals(show)
      markDirty()
    },

    setVolumeColorMode(mode) {
      engine.set_volume_color_mode(mode)
      markDirty()
    },

    getVolumeMaPeriod()    { return engine.get_volume_ma_period() },
    getVolumeShowMa()      { return engine.get_volume_show_ma() },
    getVolumeShowSignals() { return engine.get_volume_show_signals() },
    getVolumeColorMode()   { return engine.get_volume_color_mode() },
  }
}
