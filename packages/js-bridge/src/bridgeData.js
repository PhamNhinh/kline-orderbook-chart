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

    setKlines(timestamps, open, high, low, close, volume) {
      engine.set_klines(
        _f64(timestamps), _f64(open), _f64(high),
        _f64(low), _f64(close), _f64(volume),
      )
      markDirty()
    },

    setRealTimestamps(realTs) {
      engine.set_real_timestamps(_f64(realTs))
      markDirty()
    },

    appendRealTimestamp(realTs) {
      engine.append_real_timestamp(realTs)
    },

    prependKlines(timestamps, open, high, low, close, volume) {
      engine.prepend_klines(
        _f64(timestamps), _f64(open), _f64(high),
        _f64(low), _f64(close), _f64(volume),
      )
      markDirty()
    },

    appendKline(ts, o, h, l, c, v) {
      engine.append_kline(ts, o, h, l, c, v)
      markDirty()
    },

    updateLastKline(ts, o, h, l, c, v) {
      engine.update_last_kline(ts, o, h, l, c, v)
      markDirty()
    },

    popLastKline() {
      const ok = engine.pop_last_kline()
      if (ok) markDirty()
      return ok
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
      if (!gate('heatmap')) return
      engine.set_heatmap(_f64(matrix), rows, cols, xStart, xStep, yStart, yStep)
      markDirty()
    },

    appendHeatmapColumn(values, colTimestamp, yStart, yStep) {
      if (!gate('heatmap')) return
      engine.append_heatmap_column(_f64(values), colTimestamp, yStart, yStep)
      markDirty()
    },

    updateLastHeatmapColumn(values, yStart, yStep) {
      engine.update_last_heatmap_column(_f64(values), yStart, yStep)
      markDirty()
    },

    getHeatmapLastTimestamp() {
      try { return engine.get_heatmap_last_timestamp() } catch { return 0 }
    },

    getHeatmapXStep() {
      try { return engine.get_heatmap_x_step() } catch { return 0 }
    },

    updateHeatmapColumnAt(values, timestamp, yStart, yStep) {
      engine.update_heatmap_column_at(_f64(values), timestamp, yStart, yStep)
      markDirty()
    },

    setHeatmapRange(min, max) {
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
