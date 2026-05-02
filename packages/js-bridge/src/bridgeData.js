/**
 * Bridge methods for kline data, heatmap, chart type, and footprint operations.
 * Extracted from bridge.js for maintainability.
 *
 * Feature gating: getGate() returns the current feature gate function.
 */

const _f64 = (v) => v instanceof Float64Array ? v : new Float64Array(v)

export function createDataMethods(engine, markDirty, isDestroyed, getGate) {
  const gate = (k) => getGate()(k)

  return {
    // ── Kline Data ──
    //
    // Every writer below is a realtime-hot path: WebSocket tick handlers
    // can invoke these dozens of times per second per symbol.  Once the
    // WASM engine is dead (see bridge.js), the proxy already no-ops these
    // calls, but we still gate at this layer so we avoid constructing
    // Float64Array copies and doing prop lookups for a dead engine.

    setKlines(timestamps, open, high, low, close, volume) {
      if (isDestroyed()) return
      engine.set_klines(
        _f64(timestamps), _f64(open), _f64(high),
        _f64(low), _f64(close), _f64(volume),
      )
      markDirty()
    },

    setRealTimestamps(realTs) {
      if (isDestroyed()) return
      engine.set_real_timestamps(_f64(realTs))
      markDirty()
    },

    appendRealTimestamp(realTs) {
      if (isDestroyed()) return
      engine.append_real_timestamp(realTs)
    },

    prependKlines(timestamps, open, high, low, close, volume) {
      if (isDestroyed()) return
      engine.prepend_klines(
        _f64(timestamps), _f64(open), _f64(high),
        _f64(low), _f64(close), _f64(volume),
      )
      markDirty()
    },

    appendKline(ts, o, h, l, c, v) {
      if (isDestroyed()) return
      engine.append_kline(ts, o, h, l, c, v)
      markDirty()
    },

    updateLastKline(ts, o, h, l, c, v) {
      if (isDestroyed()) return
      engine.update_last_kline(ts, o, h, l, c, v)
      markDirty()
    },

    popLastKline() {
      if (isDestroyed()) return false
      const ok = engine.pop_last_kline()
      if (ok) markDirty()
      return !!ok
    },

    getLastClose() {
      try { return engine.get_last_close() } catch { return 0 }
    },

    // ── Kline Data Accessors ──

    getKlineCount() {
      if (isDestroyed()) return 0
      try { return engine.kline_count() } catch { return 0 }
    },

    getKlineTimestamps() {
      if (isDestroyed()) return null
      try { return engine.kline_timestamps() } catch { return null }
    },

    getKlineOpens() {
      if (isDestroyed()) return null
      try { return engine.kline_opens() } catch { return null }
    },

    getKlineHighs() {
      if (isDestroyed()) return null
      try { return engine.kline_highs() } catch { return null }
    },

    getKlineLows() {
      if (isDestroyed()) return null
      try { return engine.kline_lows() } catch { return null }
    },

    getKlineCloses() {
      if (isDestroyed()) return null
      try { return engine.kline_closes() } catch { return null }
    },

    getKlineVolumes() {
      if (isDestroyed()) return null
      try { return engine.kline_volumes() } catch { return null }
    },

    // ── Heatmap ── (Professional+)

    setHeatmap(matrix, rows, cols, xStart, xStep, yStart, yStep) {
      if (isDestroyed()) return
      if (!gate('heatmap')) return
      engine.set_heatmap(_f64(matrix), rows, cols, xStart, xStep, yStart, yStep)
      markDirty()
    },

    appendHeatmapColumn(values, colTimestamp, yStart, yStep) {
      if (isDestroyed()) return
      if (!gate('heatmap')) return
      engine.append_heatmap_column(_f64(values), colTimestamp, yStart, yStep)
      markDirty()
    },

    updateLastHeatmapColumn(values, yStart, yStep) {
      if (isDestroyed()) return
      engine.update_last_heatmap_column(_f64(values), yStart, yStep)
      markDirty()
    },

    getHeatmapLastTimestamp() {
      if (isDestroyed()) return 0
      try { return engine.get_heatmap_last_timestamp() ?? 0 } catch { return 0 }
    },

    getHeatmapXStep() {
      if (isDestroyed()) return 0
      try { return engine.get_heatmap_x_step() ?? 0 } catch { return 0 }
    },

    updateHeatmapColumnAt(values, timestamp, yStart, yStep) {
      if (isDestroyed()) return
      engine.update_heatmap_column_at(_f64(values), timestamp, yStart, yStep)
      markDirty()
    },

    setHeatmapRange(min, max) {
      if (isDestroyed()) return
      engine.set_heatmap_range(min, max)
      markDirty()
    },

    getHeatmapDataRange() {
      try {
        return {
          min: engine.get_heatmap_data_min(),
          max: engine.get_heatmap_data_max(),
        }
      } catch {
        return { min: 0, max: 0 }
      }
    },

    setHeatmapPrefetchRange(max) {
      try { engine.set_heatmap_prefetch_range(max) } catch { /* ignore */ }
    },

    clearHeatmapPrefetchRange() {
      try { engine.clear_heatmap_prefetch_range() } catch { /* ignore */ }
    },

    getHeatmapPrefetchMax() {
      try { return engine.get_heatmap_prefetch_max() } catch { return 0 }
    },

    setHeatmapColorScheme(scheme) {
      try { engine.set_heatmap_color_scheme(scheme); markDirty() } catch { /* ignore */ }
    },

    setHeatmapShowProfile(show) {
      try { engine.set_heatmap_show_profile(show); markDirty() } catch { /* ignore */ }
    },

    isHeatmapShowProfile() {
      try { return engine.is_heatmap_show_profile() } catch { return false }
    },

    /**
     * Brightness multiplier for the heatmap depth profile bars.
     * Common presets: 0.6 dim / 1.0 normal / 1.4 bright / 1.8 vivid.
     */
    setHeatmapProfileBrightness(mul) {
      try { engine.set_heatmap_profile_brightness(Number(mul) || 1.0); markDirty() } catch { /* ignore */ }
    },

    getHeatmapProfileBrightness() {
      try { return engine.get_heatmap_profile_brightness() } catch { return 1.0 }
    },

    /**
     * Set heatmap wall data for profile rendering.
     *
     * Three stride layouts are auto-detected by the engine — pick the
     * stride that matches the data you have so the engine can render the
     * appropriate overlays:
     *
     * Legacy (11):
     *   [price, isResistance(0/1), status(0-5), strength(0-100),
     *    currentVol, peakVol, volumeUSD, volumeTrend,
     *    persistencePct, ageSeconds, sweepProbability(0-1)]
     *
     * Enriched-v1 (14, deprecated — bucket derived from prob):
     *   …legacy11…, swingQualified(0/1), swingFillProb(0-1),
     *   swingOutcome(-1=none, 0=standing, 1=absorbed_iceberg,
     *                2=absorbed_hard, 3=exhausted, 4=spoof_pulled,
     *                5=tested_soft)
     *
     * Enriched-v2 (15, current — BE-driven `fill.bucket`):
     *   …legacy11…, swingQualified(0/1), swingFillProb(0-1),
     *   swingFillBucket(0=low, 1=med, 2=high), swingOutcome(-1..=5)
     *
     * `swing_qualified` and `swing_outcome` are independent (BE doc §1.1):
     * an un-qualified wall can still carry a resolved historical outcome.
     * The renderer mutes the badge / fill-bar when qualified=false so users
     * can tell live-actionable verdicts from historical ones.
     *
     * @param {number[]} flat
     */
    setHeatmapWalls(flat) {
      try { engine.set_heatmap_walls(new Float64Array(flat)); markDirty() } catch { /* ignore */ }
    },

    clearHeatmapWalls() {
      try { engine.clear_heatmap_walls(); markDirty() } catch { /* ignore */ }
    },

    getHeatmapWallCount() {
      try { return engine.get_heatmap_wall_count() } catch { return 0 }
    },

    // ── Chart Type ──

    setChartType(ct) {
      if (isDestroyed()) return
      if (ct === 2 && !gate('footprint')) return
      engine.set_chart_type(ct)
      markDirty()
    },

    getChartType() {
      if (isDestroyed()) return 0
      try { return engine.get_chart_type() } catch { return 0 }
    },

    // ── Footprint ── (Professional+)

    setFootprintTickSize(tick) {
      if (isDestroyed()) return
      if (!gate('footprint')) return
      engine.set_footprint_tick_size(tick)
      markDirty()
    },

    footprintEnsureLen(n) {
      if (isDestroyed()) return
      engine.footprint_ensure_len(n)
    },

    footprintAddTrade(barIdx, price, volume, isBuyerMaker) {
      if (isDestroyed()) return
      engine.footprint_add_trade(barIdx, price, volume, isBuyerMaker)
    },

    footprintAddTradeBatch(data) {
      if (isDestroyed() || !data || data.length === 0) return
      engine.footprint_add_trade_batch(_f64(data))
    },

    footprintSetBar(barIdx, tickSize, prices, bidVols, askVols) {
      if (isDestroyed()) return
      engine.footprint_set_bar(barIdx, tickSize, prices, bidVols, askVols)
      markDirty()
    },

    footprintClear() {
      if (isDestroyed()) return
      engine.footprint_clear()
      markDirty()
    },

    footprintClearBar(barIdx) {
      if (isDestroyed()) return
      engine.footprint_clear_bar(barIdx)
    },

    footprintPrependEmpty(count) {
      if (isDestroyed()) return
      engine.footprint_prepend_empty(count)
    },

    footprintSetShowSignals(show) {
      if (isDestroyed()) return
      engine.footprint_set_show_signals(show)
      markDirty()
    },

    footprintGetShowSignals() {
      if (isDestroyed()) return true
      try { return engine.footprint_get_show_signals() } catch { return true }
    },

    footprintSignalCount() {
      if (isDestroyed()) return 0
      try { return engine.footprint_signal_count() } catch { return 0 }
    },

    footprintSetShowProfile(show) {
      if (isDestroyed()) return
      engine.footprint_set_show_profile(show)
      markDirty()
    },

    footprintGetShowProfile() {
      if (isDestroyed()) return false
      try { return engine.footprint_get_show_profile() } catch { return false }
    },

    footprintProfileHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.footprint_profile_hit_test(sx, sy) } catch { return '' }
    },

    // ── Footprint display mode ── (0=BidAsk, 1=Delta, 2=Volume)

    footprintSetDisplayMode(mode) {
      if (isDestroyed()) return
      engine.footprint_set_display_mode(mode)
      markDirty()
    },

    footprintGetDisplayMode() {
      if (isDestroyed()) return 0
      try { return engine.footprint_get_display_mode() } catch { return 0 }
    },

    // ── Delta Histogram sub-pane ──

    enableDeltaHistogram() {
      if (isDestroyed()) return
      engine.enable_delta_histogram()
    },

    disableDeltaHistogram() {
      if (isDestroyed()) return
      engine.disable_delta_histogram()
    },

    deltaHistogramEnabled() {
      if (isDestroyed()) return false
      try { return engine.delta_histogram_enabled() } catch { return false }
    },
  }
}
