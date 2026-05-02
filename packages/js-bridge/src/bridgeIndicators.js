/**
 * Bridge methods for all chart indicators.
 * Extracted from bridge.js for maintainability.
 *
 * Feature gating: getGate() returns the current feature gate function.
 * gate(featureKey) returns true if allowed, false + console.warn if blocked.
 */
const _f64 = (v) => (v instanceof Float64Array ? v : new Float64Array(v))

// ── CVD Order Block discriminator helpers ────────────────────────────
// Mirror cvd_orderblock::DIR_* / SRC_* / MIT_* in the Rust core. Strings
// match the BE wire values verbatim. `defaultU8` lets callers express
// "no filter" by passing 255 / null / "" — separate from "default codepoint".

const directionToU8 = (v, defaultU8 = 0) => {
  if (v === undefined || v === null || v === '') return defaultU8
  if (typeof v === 'number') return (v | 0) & 0xff
  switch (String(v).toLowerCase()) {
    case 'bull':    return 0
    case 'bear':    return 1
    case 'neutral': return 2
    case 'all':     return 255
    default:        return defaultU8
  }
}

const sourceKindToU8 = (v, defaultU8 = 255) => {
  if (v === undefined || v === null || v === '') return defaultU8
  if (typeof v === 'number') return (v | 0) & 0xff
  switch (String(v).toLowerCase()) {
    case 'offside_buy':   return 0
    case 'offside_sell':  return 1
    case 'distribution':  return 2
    case 'accumulation':  return 3
    case 'absorption':    return 4
    default:              return defaultU8
  }
}

const mitigationModeToU8 = (v, defaultU8 = 0) => {
  if (v === undefined || v === null || v === '') return defaultU8
  if (typeof v === 'number') return (v | 0) & 0xff
  switch (String(v).toLowerCase()) {
    case 'wick':  return 0
    case 'close': return 1
    case 'all':   return 255
    default:      return defaultU8
  }
}

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

    setRsiShowLevels(show) {
      engine.set_rsi_show_levels(show)
      markDirty()
    },

    setRsiShowOnChart(show) {
      engine.set_rsi_show_on_chart(show)
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

    setVrvpData(takerBuyVol, totalVol) {
      if (isDestroyed()) return
      engine.set_vrvp_data(takerBuyVol, totalVol)
      markDirty()
    },

    vrvpHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.vrvp_hit_test(sx, sy) } catch { return '' }
    },

    // ── CVD Profile (per-session signed volume profile, BE: obAG) ── (Professional)
    //
    // The ingestion API mirrors the BE wire protocol:
    //   • setCvdProfileSessions  → snapshot / full refresh (REST + initial WS)
    //   • applyCvdProfileUpdate  → incremental cvd_session_update
    //   • replaceCvdProfileSession → cvd_session_close (full replace of one slot)
    //   • openCvdProfileSession  → cvd_session_open marker
    //
    // Bucket payloads are flat Float64Array `[p, b, s]*` to avoid JSON
    // alloc on the hot path. The bridge accepts plain arrays too — it will
    // adopt or copy into an `Float64Array` as needed.

    enableCvdProfile() {
      if (isDestroyed()) return
      if (!gate('cvdProfile')) return
      engine.enable_cvd_profile()
      markDirty()
    },

    disableCvdProfile() {
      if (isDestroyed()) return
      engine.disable_cvd_profile()
      markDirty()
    },

    isCvdProfileEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_cvd_profile_enabled() } catch { return false }
    },

    setCvdProfileSessions(flat) {
      if (isDestroyed()) return
      engine.set_cvd_profile_sessions(_f64(flat))
      markDirty()
    },

    applyCvdProfileUpdate(start, end, tick, buckets) {
      if (isDestroyed()) return
      engine.apply_cvd_profile_update(start, end, tick, _f64(buckets))
      markDirty()
    },

    replaceCvdProfileSession(start, end, closed, tick, buckets) {
      if (isDestroyed()) return
      engine.replace_cvd_profile_session(start, end, !!closed, tick, _f64(buckets))
      markDirty()
    },

    openCvdProfileSession(start, end, tick) {
      if (isDestroyed()) return
      engine.open_cvd_profile_session(start, end, tick)
      markDirty()
    },

    clearCvdProfile() {
      if (isDestroyed()) return
      engine.clear_cvd_profile()
      markDirty()
    },

    setCvdProfileViewMode(mode) {
      if (isDestroyed()) return
      engine.set_cvd_profile_view_mode(mode | 0)
      markDirty()
    },

    getCvdProfileViewMode() {
      if (isDestroyed()) return 2
      try { return engine.get_cvd_profile_view_mode() } catch { return 2 }
    },

    setCvdProfileShowAnchors(show) {
      if (isDestroyed()) return
      engine.set_cvd_profile_show_anchors(!!show)
      markDirty()
    },

    setCvdProfileShowPoc(show) {
      if (isDestroyed()) return
      engine.set_cvd_profile_show_poc(!!show)
      markDirty()
    },

    /**
     * Toggle the stable session POC line — a thin horizontal marker
     * at the session's invariant POC price (max `buy + sell` across
     * all raw buckets), independent from the zoom-tracking POC
     * outline (`setCvdProfileShowPoc`). Both can be on simultaneously.
     */
    setCvdProfileShowSessionPocLine(show) {
      if (isDestroyed()) return
      engine.set_cvd_profile_show_session_poc_line(!!show)
      markDirty()
    },

    /**
     * Toggle the optional **Delta POC** marker — a thin cyan line +
     * "Δ" badge at the price level with the largest `|buy − sell|`
     * (net order-flow imbalance) in the session. Different concept
     * from the canonical Session POC: this answers "where was flow
     * most one-sided?" instead of "where did most volume trade?".
     * Off by default; can co-exist with the canonical POC box.
     */
    setCvdProfileShowDeltaPoc(show) {
      if (isDestroyed()) return
      engine.set_cvd_profile_show_delta_poc(!!show)
      markDirty()
    },

    /**
     * Toggle the per-row tooltip on crosshair hover. `false` keeps the
     * profile bars rendering normally but suppresses the hover popup
     * AND skips the per-frame Rust hit-test (every session × bucket).
     * Useful on a busy chart where the popup overlay clutters the
     * visual or where the user wants a measurable performance bump.
     */
    setCvdProfileTooltipEnabled(enabled) {
      if (isDestroyed()) return
      engine.set_cvd_profile_tooltip_enabled(!!enabled)
      markDirty()
    },

    setCvdProfileMaxBarRatio(ratio) {
      if (isDestroyed()) return
      engine.set_cvd_profile_max_bar_ratio(Number(ratio) || 0.85)
      markDirty()
    },

    /**
     * User multiplier on the per-row volume label font size, applied on
     * top of the density-aware auto-scaling. `1.0` is the default; the
     * Rust setter clamps to `[0.5, 2.0]`. Useful for hi-DPI screens or
     * screenshots where the auto size reads small.
     */
    setCvdProfileLabelSizeScale(scale) {
      if (isDestroyed()) return
      const n = Number(scale)
      engine.set_cvd_profile_label_size_scale(Number.isFinite(n) ? n : 1.0)
      markDirty()
    },

    /**
     * Pin per-bucket bar height (pixels). Pass `0` for auto (use
     * tick-density derived height). Useful when the auto path collapses
     * to ~2 px (small tick + huge price span).
     */
    setCvdProfileBarHeightPx(px) {
      if (isDestroyed()) return
      engine.set_cvd_profile_bar_height_px(Number(px) || 0)
      markDirty()
    },

    /**
     * Pin per-session max bar width (pixels). Pass `0` for auto
     * (`ratio × column_width`). Use when sessions are narrow on screen
     * (e.g. 1d session shown across 30 days of chart width).
     */
    setCvdProfileBarMaxWidthPx(px) {
      if (isDestroyed()) return
      engine.set_cvd_profile_bar_max_width_px(Number(px) || 0)
      markDirty()
    },

    /**
     * Profile theme.
     * `0` = auto (follows the chart's global Theme background),
     * `1` = force dark (label colours tuned for ≥ 90 % dark backdrops),
     * `2` = force light (near-black labels for white backdrops).
     * Anything else is coerced back to auto so older saved settings stay valid.
     */
    setCvdProfileThemeMode(mode) {
      if (isDestroyed()) return
      const m = Number(mode)
      const safe = m === 1 || m === 2 ? m : 0
      engine.set_cvd_profile_theme_mode(safe)
      markDirty()
    },

    /**
     * Toggle quote-asset (USD / USDT) display for profile labels.
     * `false` (default) shows base-asset volume directly from BE; `true`
     * multiplies each row's volume by its mid-price before formatting.
     * Bar shapes are unaffected.
     */
    setCvdProfileValueInQuote(inQuote) {
      if (isDestroyed()) return
      engine.set_cvd_profile_value_in_quote(!!inQuote)
      markDirty()
    },

    cvdProfileHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.cvd_profile_hit_test(sx, sy) } catch { return '' }
    },

    // ── CVD Order Block + GAP overlay (BE: obAG /api/cvd-orderblock) ──
    //
    // Pine-style supply / demand boxes (OB), breaker blocks (mitigated
    // OB) — projected from the BE `cvdoffside` + `cvdsignals` evidence
    // (see `cvd_orderbolck-fe.md`). FVG-shaped voids (GAP) are now
    // computed locally inside the Rust core from the chart's kline
    // series (mirrors `smart_ranges` Pine 3-candle imbalance) — there
    // is **no GAP wire / push API** here on purpose; the Rust side
    // refreshes them in `recompute_indicators` on every candle close.
    //
    // OB ingestion contract — upsert-by-id, never clear mid-session:
    //   • upsertCvdOrderBlockOb
    //       → handles snapshot frames AND `cvd_ob_new` / `cvd_ob_break`
    //         interchangeably (the BE re-ships the full record on
    //         update; per-mode mitigation flags flip in place). Per
    //         BE doc rev 3, `cvd_ob_break` may fire UP TO TWICE per OB
    //         (once when `mitigatedWick` flips, again when
    //         `mitigatedClose` confirms) — each event re-pushes the
    //         full record so the upsert-by-id path always converges
    //         to the freshest state.
    //   • removeCvdOrderBlockOb
    //       → `cvd_ob_expire`. We explicitly do NOT remove on
    //         `cvd_ob_break` — breakers stay on the chart.
    //   • clearCvdOrderBlockObs / clearCvdOrderBlockAll
    //       → only when the BE doc says to (reconnect → re-snap), or when
    //         the chart symbol changes. `clearCvdOrderBlockAll` also
    //         flushes the local FVG cache; the next compute pass will
    //         repopulate it from klines.
    //
    // String → u8 mapping (renderer / Rust core stores u8):
    //   direction:       bull=0 / bear=1 / neutral=2
    //   sourceKind:      offside_buy=0 / offside_sell=1 / distribution=2 /
    //                    accumulation=3 / absorption=4 / unknown=255
    //   mitigationFilter: wick=0 / close=1 / "all"=255 — picks WHICH
    //                    per-mode flag (`mitigatedWick` vs
    //                    `mitigatedClose`) drives the breaker visual.
    //                    NOT a "filter by recorded mode" anymore —
    //                    every OB carries both flags simultaneously.
    //   *Filter*:        255 (or "" / null) means "show all"

    enableCvdOrderBlock() {
      if (isDestroyed()) return
      if (!gate('cvdProfile')) return
      engine.enable_cvd_orderblock()
      markDirty()
    },

    disableCvdOrderBlock() {
      if (isDestroyed()) return
      engine.disable_cvd_orderblock()
      markDirty()
    },

    isCvdOrderBlockEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_cvd_orderblock_enabled() } catch { return false }
    },

    clearCvdOrderBlockObs() {
      if (isDestroyed()) return
      engine.clear_cvd_orderblock_obs()
      markDirty()
    },

    clearCvdOrderBlockAll() {
      if (isDestroyed()) return
      engine.clear_cvd_orderblock_all()
      markDirty()
    },

    /**
     * Insert or replace one OB. Used for snapshot ingestion (loop one
     * call per OB) AND for live `cvd_ob_new` / `cvd_ob_break` events
     * (BE ships the full record — per-mode mitigation flags flip in
     * place; `cvd_ob_break` may fire twice per OB, once per mode).
     *
     * @param {string} id
     * @param {string|number} direction      "bull"|"bear"|"neutral" or 0/1/2
     * @param {string|number} sourceKind     "offside_buy"|"offside_sell"|"distribution"|"accumulation"|"absorption"
     * @param {number} sessionResMs          3600000 / 14400000 / 86400000
     * @param {number} sessionStartSec       session start in **seconds**
     * @param {number} priceTop              cluster band top (volume-cluster, narrow ~1-10 ticks; fallback when candle band is absent)
     * @param {number} priceBtm              cluster band bottom (fallback partner)
     * @param {number} priceAvg              dashed midline price (cluster centroid; used regardless of which band wins)
     * @param {number} tick                  tick size BE used to align the box
     * @param {number} candleHi              displacement-candle high (Pine-OB band top); pass 0 when missing
     * @param {number} candleLo              displacement-candle low; pass 0 when missing — renderer falls back to cluster band
     * @param {number} candleStartSec        start of the picked 5m bar (seconds; informational, not a fallback signal)
     * @param {number} avgTop                avg band top (= candle shrunk 50% toward priceAvg); pass 0 when missing
     * @param {number} avgBtm                avg band bottom (paired with avgTop)
     * @param {number} openedAtSec           left edge in seconds (= sessionStart)
     * @param {number} extendUntilSec        right edge in seconds; slides forward each tick while active
     * @param {number} totalVol              from source-zone aggregate
     * @param {number} buyVol
     * @param {number} sellVol
     * @param {number} delta                 buyVol − sellVol (signed)
     * @param {number} buyShare              [0, 1]
     * @param {number} sellShare             [0, 1]
     * @param {number} deltaPct              [-1, 1]
     * @param {number} buckets               # price buckets in source zone
     * @param {number} score                 [0, 1]
     * @param {number} testCount
     * @param {boolean} confirmed            signals-only (false for offside)
     * @param {number} rangePos              signals-only
     * @param {boolean} healthy              false → render at ~50% alpha
     * @param {boolean} mitigatedWick        per BE doc rev 3 — wick rule fired (intra-bar)
     * @param {boolean} mitigatedClose       per BE doc rev 3 — close rule fired (5m bar close)
     * @param {number} mitigatedWickAtSec    0 if not mitigated under wick rules
     * @param {number} mitigatedCloseAtSec   0 if not mitigated under close rules
     * @param {number} createdAtSec
     * @param {number} updatedAtSec
     */
    upsertCvdOrderBlockOb(
      id,
      direction,
      sourceKind,
      sessionResMs,
      sessionStartSec,
      priceTop,
      priceBtm,
      priceAvg,
      tick,
      candleHi,
      candleLo,
      candleStartSec,
      // Avg band (BE-derived "middle" band — candle band shrunk 50%
      // toward `priceAvg`). Pass 0/0 if your service hasn't been
      // updated to forward these — the Rust side collapses to the
      // cluster band on its own. See BE doc §1.2.
      avgTop,
      avgBtm,
      openedAtSec,
      extendUntilSec,
      totalVol,
      buyVol,
      sellVol,
      delta,
      buyShare,
      sellShare,
      deltaPct,
      buckets,
      score,
      testCount,
      confirmed,
      rangePos,
      healthy,
      mitigatedWick,
      mitigatedClose,
      mitigatedWickAtSec,
      mitigatedCloseAtSec,
      createdAtSec,
      updatedAtSec,
    ) {
      if (isDestroyed()) return
      engine.upsert_cvd_orderblock_ob(
        String(id || ''),
        directionToU8(direction),
        sourceKindToU8(sourceKind),
        (sessionResMs | 0) >>> 0,
        Number(sessionStartSec) || 0,
        Number(priceTop) || 0,
        Number(priceBtm) || 0,
        Number(priceAvg) || 0,
        Number(tick) || 0,
        Number(candleHi) || 0,
        Number(candleLo) || 0,
        Number(candleStartSec) || 0,
        Number(avgTop) || 0,
        Number(avgBtm) || 0,
        Number(openedAtSec) || 0,
        Number(extendUntilSec) || 0,
        Number(totalVol) || 0,
        Number(buyVol) || 0,
        Number(sellVol) || 0,
        Number(delta) || 0,
        Number(buyShare) || 0,
        Number(sellShare) || 0,
        Number(deltaPct) || 0,
        (buckets | 0) >>> 0,
        Number(score) || 0,
        (testCount | 0) >>> 0,
        !!confirmed,
        Number(rangePos) || 0,
        healthy === undefined ? true : !!healthy,
        !!mitigatedWick,
        !!mitigatedClose,
        Number(mitigatedWickAtSec) || 0,
        Number(mitigatedCloseAtSec) || 0,
        Number(createdAtSec) || 0,
        Number(updatedAtSec) || 0,
      )
      markDirty()
    },

    removeCvdOrderBlockOb(id) {
      if (isDestroyed()) return false
      try {
        const ok = engine.remove_cvd_orderblock_ob(String(id || ''))
        if (ok) markDirty()
        return ok
      } catch {
        return false
      }
    },

    // GAP / FVG ingestion is intentionally absent — locally-computed
    // by the Rust core from kline data (Pine 3-bar imbalance, mirrors
    // smart_ranges). See `cvd_orderblock::CvdOrderBlock::compute_gaps`.

    /** 255 = show every direction; otherwise 0/1/2 (bull/bear/neutral). */
    setCvdOrderBlockDirectionFilter(dir) {
      if (isDestroyed()) return
      engine.set_cvd_orderblock_direction_filter(directionToU8(dir, 255))
      markDirty()
    },

    /**
     * Pick which per-mode mitigation flag drives the breaker visual
     * (BE doc rev 3 — NOT a "filter by recorded mode" anymore).
     *   • `0` / `"wick"`  → render as breaker the moment a wick has
     *                       crossed the edge. Earliest signal.
     *   • `1` / `"close"` → render as breaker only after a 5m bar has
     *                       CLOSED beyond the edge. Up to one bar
     *                       slower but with confirmation.
     *   • `255` / `""` / `null` ("All") → behaves like wick by the
     *                       close⇒wick invariant; the legacy default.
     * Switch is INSTANT — every OB carries both flags simultaneously.
     */
    setCvdOrderBlockMitigationFilter(mode) {
      if (isDestroyed()) return
      engine.set_cvd_orderblock_mitigation_filter(mitigationModeToU8(mode, 255))
      markDirty()
    },

    setCvdOrderBlockMinScore(min) {
      if (isDestroyed()) return
      engine.set_cvd_orderblock_min_score(Number(min) || 0)
      markDirty()
    },

    setCvdOrderBlockShowMitigated(show) {
      if (isDestroyed()) return
      engine.set_cvd_orderblock_show_mitigated(!!show)
      markDirty()
    },

    /**
     * Breaker visual intensity (mitigated OBs).
     *
     *   0 = OUTLINE — dashed border only (default, matches the
     *       project's "quiet chart by default" rule).
     *   1 = LIGHT   — thin amber body fill + slightly bolder border.
     *   2 = BOLD    — full amber fill at live-OB intensity. Use when
     *       the trader's flow is "fade the retest of broken levels".
     *
     * Anything else clamps to 2 (see Rust `set_cvd_orderblock_breaker_style`).
     *
     * @param {number} style 0 / 1 / 2
     */
    setCvdOrderBlockBreakerStyle(style) {
      if (isDestroyed()) return
      const v = Number(style)
      const safe = Number.isFinite(v) ? Math.max(0, Math.min(2, Math.trunc(v))) : 0
      engine.set_cvd_orderblock_breaker_style(safe)
      markDirty()
    },

    /**
     * Toggle OB rendering (active fills, breaker outlines, midlines,
     * OB labels) without disabling the indicator.
     *
     * Independent of `setCvdOrderBlockShowGaps` — the two gates let
     * traders show FVG voids without their parent OBs (or vice-versa)
     * without paying the BE-resubscribe cost of toggling the master
     * `enable_cvd_orderblock` flag. The indicator must still be
     * enabled for either to take effect.
     */
    setCvdOrderBlockShowObs(show) {
      if (isDestroyed()) return
      engine.set_cvd_orderblock_show_obs(!!show)
      markDirty()
    },

    setCvdOrderBlockShowGaps(show) {
      if (isDestroyed()) return
      engine.set_cvd_orderblock_show_gaps(!!show)
      markDirty()
    },

    setCvdOrderBlockShowFilledGaps(show) {
      if (isDestroyed()) return
      engine.set_cvd_orderblock_show_filled_gaps(!!show)
      markDirty()
    },

    setCvdOrderBlockShowLabels(show) {
      if (isDestroyed()) return
      engine.set_cvd_orderblock_show_labels(!!show)
      markDirty()
    },

    /**
     * User multiplier on the OB / GAP label font size. Shares the
     * "Label Size" dropdown with `setCvdProfileLabelSizeScale` — the
     * composable fans both calls out from the same UI control so all
     * CVD-stack labels resize together. Rust setter clamps to
     * `[0.5, 2.0]`.
     */
    setCvdOrderBlockLabelSizeScale(scale) {
      if (isDestroyed()) return
      const n = Number(scale)
      engine.set_cvd_orderblock_label_size_scale(Number.isFinite(n) ? n : 1.0)
      markDirty()
    },

    /**
     * Render-band selector (BE doc §1.2 / §6.1).
     *
     *   `0` = Cluster — narrow volume-cluster band (1-10 ticks). Best
     *         on densely-zoomed charts where you want the precise
     *         volume footprint.
     *   `1` = Avg     — candle band shrunk 50% toward `priceAvg`
     *         (default). Visual sweet spot.
     *   `2` = Candle  — full displacement-candle band (Pine SMC look).
     *         Tallest; some traders prefer it for swing context, but
     *         ABS sessions can look oversized.
     *
     * Mitigation is mode-independent on the BE so flipping is purely
     * cosmetic — no spurious / missed break events.
     */
    setCvdOrderBlockRenderMode(mode) {
      if (isDestroyed()) return
      const n = Number(mode)
      const safe = (n === 0 || n === 1 || n === 2) ? n : 1
      engine.set_cvd_orderblock_render_mode(safe)
      markDirty()
    },

    cvdOrderBlockObCount() {
      if (isDestroyed()) return 0
      try { return engine.cvd_orderblock_ob_count() } catch { return 0 }
    },

    cvdOrderBlockGapCount() {
      if (isDestroyed()) return 0
      try { return engine.cvd_orderblock_gap_count() } catch { return 0 }
    },

    cvdOrderBlockHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.cvd_orderblock_hit_test(sx, sy) } catch { return '' }
    },

    // ── CVD Trade Signals (S1–S5 actionable entries) ──
    //
    // Wire mapping (string discriminators ←→ u8 codes; renderer is u8):
    //   direction: long=0 / short=1
    //   trigger:   rejection=0 / breakout=1 / delta_trap=2 /
    //              absorption_resolution=3 / divergence=4
    //   bias4h:    neutral=0 / bull=1 / bear=2

    enableCvdTradeSignals() {
      if (isDestroyed()) return
      if (!gate('cvdProfile')) return
      engine.enable_cvd_trade_signals()
      markDirty()
    },

    disableCvdTradeSignals() {
      if (isDestroyed()) return
      engine.disable_cvd_trade_signals()
      markDirty()
    },

    isCvdTradeSignalsEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_cvd_trade_signals_enabled() } catch { return false }
    },

    clearCvdTradeSignals() {
      if (isDestroyed()) return
      engine.clear_cvd_trade_signals()
      markDirty()
    },

    /**
     * @param {string} id - deterministic BE id
     * @param {number|string} direction - 0|"long" / 1|"short"
     * @param {number|string} trigger - 0|"rejection" / 1|"breakout" /
     *   2|"delta_trap" / 3|"absorption_resolution" / 4|"divergence"
     * @param {number} candleStartSec
     * @param {number} candleHigh
     * @param {number} candleLow
     * @param {number} entry
     * @param {number} stop
     * @param {number} target1
     * @param {number} target2
     * @param {number} rrT1
     * @param {number} rrT2
     * @param {number} confidence - clamped [0, 1]
     * @param {number|string} bias4h - 0|"neutral" / 1|"bull" / 2|"bear"
     * @param {number} confluenceCount
     * @param {number} validUntilSec
     * @param {number} primaryZoneLo
     * @param {number} primaryZoneHi
     * @param {number} primaryZoneScore
     * @param {number} primaryAnchorMs
     * @param {string} reason
     */
    upsertCvdTradeSignal(
      id,
      direction,
      trigger,
      candleStartSec,
      candleHigh,
      candleLow,
      entry,
      stop,
      target1,
      target2,
      rrT1,
      rrT2,
      confidence,
      bias4h,
      confluenceCount,
      validUntilSec,
      primaryZoneLo,
      primaryZoneHi,
      primaryZoneScore,
      primaryAnchorMs,
      reason,
    ) {
      if (isDestroyed()) return
      let dir = 0
      if (direction === 'short' || direction === 1) dir = 1
      let trig = 0
      if (trigger === 'breakout' || trigger === 1) trig = 1
      else if (trigger === 'delta_trap' || trigger === 2) trig = 2
      else if (trigger === 'absorption_resolution' || trigger === 3) trig = 3
      else if (trigger === 'divergence' || trigger === 4) trig = 4
      let bias = 0
      if (bias4h === 'bull' || bias4h === 1) bias = 1
      else if (bias4h === 'bear' || bias4h === 2) bias = 2
      engine.upsert_cvd_trade_signal(
        String(id || ''),
        dir,
        trig,
        Number(candleStartSec) || 0,
        Number(candleHigh) || 0,
        Number(candleLow) || 0,
        Number(entry) || 0,
        Number(stop) || 0,
        Number(target1) || 0,
        Number(target2) || 0,
        Number(rrT1) || 0,
        Number(rrT2) || 0,
        Number(confidence) || 0,
        bias,
        (confluenceCount | 0) >>> 0,
        Number(validUntilSec) || 0,
        Number(primaryZoneLo) || 0,
        Number(primaryZoneHi) || 0,
        Number(primaryZoneScore) || 0,
        ((primaryAnchorMs | 0) >>> 0),
        String(reason || ''),
      )
      markDirty()
    },

    removeCvdTradeSignal(id) {
      if (isDestroyed()) return false
      try {
        const ok = engine.remove_cvd_trade_signal(String(id || ''))
        if (ok) markDirty()
        return ok
      } catch {
        return false
      }
    },

    setCvdTradeSignalsShowLong(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_long(!!show)
      markDirty()
    },

    setCvdTradeSignalsShowShort(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_short(!!show)
      markDirty()
    },

    setCvdTradeSignalsShowRejection(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_rejection(!!show)
      markDirty()
    },

    setCvdTradeSignalsShowBreakout(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_breakout(!!show)
      markDirty()
    },

    setCvdTradeSignalsShowDeltaTrap(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_delta_trap(!!show)
      markDirty()
    },

    setCvdTradeSignalsShowAbsorptionResolution(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_absorption_resolution(!!show)
      markDirty()
    },

    setCvdTradeSignalsShowDivergence(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_divergence(!!show)
      markDirty()
    },

    setCvdTradeSignalsShowLabels(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_labels(!!show)
      markDirty()
    },

    setCvdTradeSignalsShowLevels(show) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_show_levels(!!show)
      markDirty()
    },

    setCvdTradeSignalsMinConfidence(min) {
      if (isDestroyed()) return
      engine.set_cvd_trade_signals_min_confidence(Number(min) || 0)
      markDirty()
    },

    cvdTradeSignalCount() {
      if (isDestroyed()) return 0
      try { return engine.cvd_trade_signal_count() } catch { return 0 }
    },

    cvdTradeSignalsHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.cvd_trade_signals_hit_test(sx, sy) } catch { return '' }
    },

    // ── CVD Divergence (S1 regular + S2 hidden raw stream) ──
    //
    // Wire mapping:
    //   kind:      regular=0 / hidden=1
    //   direction: long=0 / short=1

    enableCvdDivergence() {
      if (isDestroyed()) return
      if (!gate('cvdProfile')) return
      engine.enable_cvd_divergence()
      markDirty()
    },

    disableCvdDivergence() {
      if (isDestroyed()) return
      engine.disable_cvd_divergence()
      markDirty()
    },

    isCvdDivergenceEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_cvd_divergence_enabled() } catch { return false }
    },

    clearCvdDivergence() {
      if (isDestroyed()) return
      engine.clear_cvd_divergence()
      markDirty()
    },

    /**
     * @param {string} id
     * @param {number|string} kind - 0|"regular" / 1|"hidden"
     * @param {number|string} direction - 0|"long" / 1|"short"
     * @param {number} fromSec - pivot 1
     * @param {number} priceFrom
     * @param {number} toSec - pivot 2
     * @param {number} priceTo
     * @param {number} cvdFrom
     * @param {number} cvdTo
     * @param {number} strength - clamped [0, 1]
     * @param {number} validUntilSec
     */
    upsertCvdDivergence(
      id,
      kind,
      direction,
      fromSec,
      priceFrom,
      toSec,
      priceTo,
      cvdFrom,
      cvdTo,
      strength,
      validUntilSec,
    ) {
      if (isDestroyed()) return
      let k = 0
      if (kind === 'hidden' || kind === 1) k = 1
      let dir = 0
      if (direction === 'short' || direction === 1) dir = 1
      engine.upsert_cvd_divergence(
        String(id || ''),
        k,
        dir,
        Number(fromSec) || 0,
        Number(priceFrom) || 0,
        Number(toSec) || 0,
        Number(priceTo) || 0,
        Number(cvdFrom) || 0,
        Number(cvdTo) || 0,
        Number(strength) || 0,
        Number(validUntilSec) || 0,
      )
      markDirty()
    },

    removeCvdDivergence(id) {
      if (isDestroyed()) return false
      try {
        const ok = engine.remove_cvd_divergence(String(id || ''))
        if (ok) markDirty()
        return ok
      } catch {
        return false
      }
    },

    setCvdDivergenceShowRegular(show) {
      if (isDestroyed()) return
      engine.set_cvd_divergence_show_regular(!!show)
      markDirty()
    },

    setCvdDivergenceShowHidden(show) {
      if (isDestroyed()) return
      engine.set_cvd_divergence_show_hidden(!!show)
      markDirty()
    },

    setCvdDivergenceShowLong(show) {
      if (isDestroyed()) return
      engine.set_cvd_divergence_show_long(!!show)
      markDirty()
    },

    setCvdDivergenceShowShort(show) {
      if (isDestroyed()) return
      engine.set_cvd_divergence_show_short(!!show)
      markDirty()
    },

    setCvdDivergenceShowLabels(show) {
      if (isDestroyed()) return
      engine.set_cvd_divergence_show_labels(!!show)
      markDirty()
    },

    setCvdDivergenceShowBand(show) {
      if (isDestroyed()) return
      engine.set_cvd_divergence_show_band(!!show)
      markDirty()
    },

    setCvdDivergenceMinStrength(min) {
      if (isDestroyed()) return
      engine.set_cvd_divergence_min_strength(Number(min) || 0)
      markDirty()
    },

    cvdDivergenceCount() {
      if (isDestroyed()) return 0
      try { return engine.cvd_divergence_count() } catch { return 0 }
    },

    cvdDivergenceHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.cvd_divergence_hit_test(sx, sy) } catch { return '' }
    },

    // ── CVD Regime Flip (S5 — 4H rolling-Σdelta sign change) ──
    //
    // Wire mapping:
    //   bias: neutral=0 / bull=1 / bear=2

    enableCvdRegime() {
      if (isDestroyed()) return
      if (!gate('cvdProfile')) return
      engine.enable_cvd_regime()
      markDirty()
    },

    disableCvdRegime() {
      if (isDestroyed()) return
      engine.disable_cvd_regime()
      markDirty()
    },

    isCvdRegimeEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_cvd_regime_enabled() } catch { return false }
    },

    clearCvdRegime() {
      if (isDestroyed()) return
      engine.clear_cvd_regime()
      markDirty()
    },

    /**
     * @param {string} id
     * @param {number} windowEndSec
     * @param {number} windowStartSec
     * @param {number|string} fromBias - 0|"neutral" / 1|"bull" / 2|"bear"
     * @param {number|string} toBias
     * @param {number} biasShare - signed [-1, 1]
     * @param {number} windowBars
     * @param {number} validUntilSec
     */
    upsertCvdRegimeFlip(
      id,
      windowEndSec,
      windowStartSec,
      fromBias,
      toBias,
      biasShare,
      windowBars,
      validUntilSec,
    ) {
      if (isDestroyed()) return
      const biasCode = (b) => {
        if (b === 'bull' || b === 1) return 1
        if (b === 'bear' || b === 2) return 2
        return 0
      }
      engine.upsert_cvd_regime_flip(
        String(id || ''),
        Number(windowEndSec) || 0,
        Number(windowStartSec) || 0,
        biasCode(fromBias),
        biasCode(toBias),
        Number(biasShare) || 0,
        (windowBars | 0) >>> 0,
        Number(validUntilSec) || 0,
      )
      markDirty()
    },

    removeCvdRegimeFlip(id) {
      if (isDestroyed()) return false
      try {
        const ok = engine.remove_cvd_regime_flip(String(id || ''))
        if (ok) markDirty()
        return ok
      } catch {
        return false
      }
    },

    setCvdRegimeShowRibbon(show) {
      if (isDestroyed()) return
      engine.set_cvd_regime_show_ribbon(!!show)
      markDirty()
    },

    setCvdRegimeShowWash(show) {
      if (isDestroyed()) return
      engine.set_cvd_regime_show_wash(!!show)
      markDirty()
    },

    setCvdRegimeShowFlipLines(show) {
      if (isDestroyed()) return
      engine.set_cvd_regime_show_flip_lines(!!show)
      markDirty()
    },

    cvdRegimeFlipCount() {
      if (isDestroyed()) return 0
      try { return engine.cvd_regime_flip_count() } catch { return 0 }
    },

    cvdRegimeHitTest(sx, sy) {
      if (isDestroyed()) return ''
      try { return engine.cvd_regime_hit_test(sx, sy) } catch { return '' }
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

    // ── OB Signals (chart overlay) ──

    enableObSignals() { engine.enable_ob_signals(); markDirty() },
    disableObSignals() { engine.disable_ob_signals(); markDirty() },
    isObSignalsEnabled() { return engine.is_ob_signals_enabled() },
    setObsShowWalls(show) { engine.set_obs_show_walls(show); markDirty() },
    setObsShowGaps(show) { engine.set_obs_show_gaps(show); markDirty() },
    setObsShowAlerts(show) { engine.set_obs_show_alerts(show); markDirty() },
    setObsShowCom(show) { engine.set_obs_show_com(show); markDirty() },
    setObsWalls(bidWalls, askWalls) {
      engine.set_obs_walls(new Float64Array(bidWalls), new Float64Array(askWalls)); markDirty()
    },
    setObsGaps(bidGaps, askGaps) {
      engine.set_obs_gaps(new Float64Array(bidGaps), new Float64Array(askGaps)); markDirty()
    },
    pushObsAlert(ts, price, atype, severity, isBid) {
      engine.push_obs_alert(ts, price, atype, severity, isBid); markDirty()
    },
    setObsCom(price) { engine.set_obs_com(price); markDirty() },
    clearObSignals() { engine.clear_ob_signals(); markDirty() },

    // ── OB Flow (sub-pane) ──

    enableObFlow() { engine.enable_ob_flow(); markDirty() },
    disableObFlow() { engine.disable_ob_flow(); markDirty() },
    isObFlowEnabled() { return engine.is_ob_flow_enabled() },
    setObfShowObi(show) { engine.set_obf_show_obi(show); markDirty() },
    setObfShowNetFlow(show) { engine.set_obf_show_net_flow(show); markDirty() },
    setObfShowCumDelta(show) { engine.set_obf_show_cum_delta(show); markDirty() },
    pushObfSample(ts, obi, netFlow, cumDelta) {
      engine.push_obf_sample(ts, obi, netFlow, cumDelta); markDirty()
    },
    setObfData(flat) {
      engine.set_obf_data(new Float64Array(flat)); markDirty()
    },
    clearObFlow() { engine.clear_ob_flow(); markDirty() },
    setObfRatio(ratio) { engine.set_obf_ratio(ratio); markDirty() },
    getObfRatio() { return engine.get_obf_ratio() },

    enableObMicro() { engine.enable_ob_micro(); markDirty() },
    disableObMicro() { engine.disable_ob_micro(); markDirty() },
    isObMicroEnabled() { return engine.is_ob_micro_enabled() },
    setObmData(absorpBid, absorpAsk, spoof, vpin, bidPres, askPres, tradeImb, spreadZ, buyVol, sellVol, tradeRate, lgBuys, lgSells) {
      engine.set_obm_data(absorpBid, absorpAsk, spoof, vpin, bidPres, askPres, tradeImb, spreadZ, buyVol, sellVol, tradeRate, lgBuys, lgSells)
      markDirty()
    },
    setObmAnchorTopRight(topRight) { engine.set_obm_anchor_top_right(topRight); markDirty() },
    clearObMicro() { engine.clear_ob_micro(); markDirty() },

    // ── Aggregated Liquidations (sub-pane) ──

    enableAggLiq() {
      if (!gate('aggLiquidations')) return
      engine.enable_agg_liq()
      markDirty()
    },
    disableAggLiq() { engine.disable_agg_liq(); markDirty() },
    isAggLiqEnabled() { return engine.is_agg_liq_enabled() },
    /**
     * Bulk-set data. `bars` is an array of AggBar objects:
     *   { time, longUsd, shortUsd, longQty, shortQty, count }
     * or a flat [ts, longUsd, shortUsd, longQty, shortQty, count, ...] array.
     */
    setAggLiqData(bars) {
      let flat
      if (bars && bars.length > 0 && typeof bars[0] === 'object' && !Array.isArray(bars[0])) {
        flat = new Float64Array(bars.length * 6)
        for (let i = 0; i < bars.length; i++) {
          const b = bars[i]
          flat[i * 6 + 0] = Number(b.time) || 0
          flat[i * 6 + 1] = Number(b.longUsd) || 0
          flat[i * 6 + 2] = Number(b.shortUsd) || 0
          flat[i * 6 + 3] = Number(b.longQty) || 0
          flat[i * 6 + 4] = Number(b.shortQty) || 0
          flat[i * 6 + 5] = Number(b.count) || 0
        }
      } else {
        flat = new Float64Array(bars || [])
      }
      engine.set_agg_liq_data(flat)
      markDirty()
    },
    pushAggLiqBar(ts, longUsd, shortUsd, longQty, shortQty, count) {
      engine.push_agg_liq_bar(ts, longUsd, shortUsd, longQty, shortQty, count >>> 0)
      markDirty()
    },
    clearAggLiq() { engine.clear_agg_liq(); markDirty() },
    /** mode: 0 = USD, 1 = Qty */
    setAggLiqMode(mode) { engine.set_agg_liq_mode(mode); markDirty() },
    getAggLiqMode() { return engine.get_agg_liq_mode() },
    setAggLiqShowLong(show) { engine.set_agg_liq_show_long(show); markDirty() },
    setAggLiqShowShort(show) { engine.set_agg_liq_show_short(show); markDirty() },
    setAggLiqHover(idx) { engine.set_agg_liq_hover(idx | 0); markDirty() },
    aggLiqBarJson(idx) {
      const s = engine.agg_liq_bar_json(idx | 0)
      if (!s) return null
      try { return JSON.parse(s) } catch { return null }
    },
    setAggLiqRatio(ratio) { engine.set_agg_liq_ratio(ratio); markDirty() },
    getAggLiqRatio() { return engine.get_agg_liq_ratio() },
    screenToAggLiqY(sy) { return engine.screen_to_agg_liq_y(sy) },
    aggLiqToScreenY(val) { return engine.agg_liq_to_screen_y(val) },

    // ── Agg Liq Signals ──
    // Signal kinds (u8 encoding used by the engine):
    //   0 spike · 1 capitulation · 2 cascade_start · 3 cascade_exhaustion
    //   4 imbalance · 5 silent_zone
    // Signal sides: 0 neutral · 1 long · 2 short
    /**
     * Bulk-set signals. Accepts either an array of server-shaped objects
     *   { type, side, time, volumeUsd, ratio, confidence }
     * (time in ms — same format the server sends) or a flat
     *   [ts_sec, kindCode, sideCode, volumeUsd, ratio, confidence, ...] array.
     */
    setAggLiqSignals(signals) {
      let flat
      if (signals && signals.length > 0 && typeof signals[0] === 'object' && !Array.isArray(signals[0])) {
        flat = new Float64Array(signals.length * 6)
        for (let i = 0; i < signals.length; i++) {
          const s = signals[i]
          flat[i * 6 + 0] = Number(s.time) / 1000 // ms → sec
          flat[i * 6 + 1] = AGG_LIQ_SIGNAL_KIND[s.type] ?? -1
          flat[i * 6 + 2] = AGG_LIQ_SIGNAL_SIDE[s.side] ?? 0
          flat[i * 6 + 3] = Number(s.volumeUsd) || 0
          flat[i * 6 + 4] = Number(s.ratio) || 0
          flat[i * 6 + 5] = Math.max(0, Math.min(1, Number(s.confidence) || 0))
        }
      } else {
        flat = new Float64Array(signals || [])
      }
      engine.set_agg_liq_signals(flat)
      markDirty()
    },
    /** Push a single server-shaped signal object. Safe to call repeatedly (deduped). */
    pushAggLiqSignal(sig) {
      if (!sig || sig.time == null || sig.type == null) return
      const kind = AGG_LIQ_SIGNAL_KIND[sig.type]
      if (kind == null) return
      engine.push_agg_liq_signal(
        Number(sig.time) / 1000,
        kind,
        AGG_LIQ_SIGNAL_SIDE[sig.side] ?? 0,
        Number(sig.volumeUsd) || 0,
        Number(sig.ratio) || 0,
        Math.max(0, Math.min(1, Number(sig.confidence) || 0)),
      )
      markDirty()
    },
    clearAggLiqSignals() { engine.clear_agg_liq_signals(); markDirty() },
    setAggLiqShowSignals(show) { engine.set_agg_liq_show_signals(!!show); markDirty() },
    isAggLiqShowSignals() { return engine.is_agg_liq_show_signals() },
    setAggLiqSignalsOnChart(show) { engine.set_agg_liq_signals_on_chart(!!show); markDirty() },
    isAggLiqSignalsOnChart() { return engine.is_agg_liq_signals_on_chart() },

    // ── mrD-Pullback Signals (overlay) ──

    enableMrdPullback() {
      if (isDestroyed()) return
      if (!gate('mrdPullback')) return
      engine.enable_mrd_pullback()
      markDirty()
    },

    disableMrdPullback() {
      if (isDestroyed()) return
      engine.disable_mrd_pullback()
      markDirty()
    },

    isMrdPullbackEnabled() {
      if (isDestroyed()) return false
      try { return engine.is_mrd_pullback_enabled() } catch { return false }
    },

    setMrdPullbackEntryMode(mode) {
      if (isDestroyed()) return
      engine.set_mrd_pullback_entry_mode(mode)
      markDirty()
    },

    setMrdPullbackTrendMode(mode) {
      if (isDestroyed()) return
      engine.set_mrd_pullback_trend_mode(mode)
      markDirty()
    },

    setMrdPullbackShowHiddenDiv(show) {
      if (isDestroyed()) return
      engine.set_mrd_pullback_show_hidden_div(show)
      markDirty()
    },

    setMrdPullbackSrMode(mode) {
      if (isDestroyed()) return
      engine.set_mrd_pullback_sr_mode(mode)
      markDirty()
    },

    setMrdPullbackTextSize(size) {
      if (isDestroyed()) return
      engine.set_mrd_pullback_text_size(size)
      markDirty()
    },

    setMrdPullbackTfMode(mode) {
      if (isDestroyed()) return
      engine.set_mrd_pullback_tf_mode(mode)
      markDirty()
    },

    setMrdPullbackHtfKlines(timestamps, open, high, low, close, volume) {
      if (isDestroyed()) return
      engine.set_mrd_pullback_htf_klines(
        _f64(timestamps), _f64(open), _f64(high),
        _f64(low), _f64(close), _f64(volume),
      )
      markDirty()
    },

    updateMrdPullbackLastHtfKline(ts, o, h, l, c, v) {
      if (isDestroyed()) return
      engine.update_mrd_pullback_last_htf_kline(ts, o, h, l, c, v)
      markDirty()
    },

    clearMrdPullbackHtfKlines() {
      if (isDestroyed()) return
      engine.clear_mrd_pullback_htf_klines()
      markDirty()
    },
  }
}

const AGG_LIQ_SIGNAL_KIND = Object.freeze({
  spike: 0,
  capitulation: 1,
  cascade_start: 2,
  cascade_exhaustion: 3,
  imbalance: 4,
  silent_zone: 5,
})

const AGG_LIQ_SIGNAL_SIDE = Object.freeze({
  neutral: 0,
  long: 1,
  short: 2,
})
