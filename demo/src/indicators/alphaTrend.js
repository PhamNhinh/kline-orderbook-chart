/**
 * AlphaTrend — example custom indicator.
 *
 * AlphaTrend is a popular trend-following indicator originally written
 * for TradingView by KivancOzbilgic. It draws a single trailing line
 * that hugs price from below during an up-trend and from above during
 * a down-trend. The line ratchets in one direction only — it never
 * loosens against price — so a crossover of the line with its 2-bar-
 * back value flags a trend flip (BUY / SELL).
 *
 * The algorithm is small and fully transparent, so this file is a good
 * starting template for writing your own indicators on top of
 * `kline-orderbook-chart`. It only uses the public custom-indicator
 * API documented in `docs/guides/custom-indicators.md`:
 *
 *   bridge.addIndicator({ name, params, compute, render })
 *
 * To plug it into your own chart:
 *
 *   import { registerAlphaTrend } from './indicators/alphaTrend.js'
 *
 *   const bridge = await createChartBridge(canvas, { licenseKey: 'trial' })
 *   const id = registerAlphaTrend(bridge, { period: 14, coef: 1 })
 *
 *   // Later, from anywhere:
 *   bridge.setIndicatorEnabled(id, false)
 *   bridge.updateIndicatorParams(id, { period: 21, coef: 1.5 })
 *   bridge.removeIndicator(id)
 *
 * The two phases of a custom indicator:
 *
 *   compute(ohlcv, params) — runs whenever data or params change.
 *     Return any plain object. Its fields are cached and forwarded
 *     to `render`. Keep this fast — it runs on the main thread.
 *
 *   render(draw, computed, ohlcv) — runs every frame. Inside,
 *     `this.params` is the live params object. Use the engine-backed
 *     `draw.*` helpers; do not touch the DOM or allocate large
 *     arrays here.
 */

const DEFAULTS = {
  period:    14,         // ATR look-back. Smaller = tighter, more flips.
  coef:      1.0,        // ATR multiplier. Bigger = looser stop.
  upColor:   '#26a69a',  // colour while in an up-trend
  downColor: '#ef5350',  // colour while in a down-trend
  lineWidth: 1.8,
  showSignals: true,     // draw BUY / SELL arrows on trend flips
}

export function registerAlphaTrend(bridge, params = {}) {
  return bridge.addIndicator({
    name: 'AlphaTrend',
    params: { ...DEFAULTS, ...params },

    // ──────────────────────────────────────────────────────────────
    //  compute — pure function of (ohlcv, params).
    //
    //  Result is cached by the engine and reused across frames until
    //  data or params change, so we can do "expensive" work here
    //  (single-pass O(n) is fine; avoid O(n²) on large datasets).
    // ──────────────────────────────────────────────────────────────
    compute(ohlcv, params) {
      const { open, high, low, close, length } = ohlcv
      const empty = { trend: [], buys: [], sells: [] }
      if (length < params.period + 2) return empty

      const atr = simpleATR(high, low, close, params.period)

      // Build the trailing line. Bullish bars (close ≥ open) push the
      // line up to `low - coef·ATR`, bearish bars pull it down to
      // `high + coef·ATR`. The line is "sticky" — it only ratchets
      // tighter, never looser, so it traces a smooth stop-loss curve.
      const trend = new Array(length).fill(NaN)
      for (let i = 0; i < length; i++) {
        const a = atr[i]
        if (!Number.isFinite(a)) continue

        const upT   = low[i]  - params.coef * a
        const downT = high[i] + params.coef * a
        const bullishBar = close[i] >= open[i]
        const prev = Number.isFinite(trend[i - 1])
          ? trend[i - 1]
          : (bullishBar ? upT : downT)

        trend[i] = bullishBar
          ? Math.max(upT, prev)   // up-trend: only ratchet UP
          : Math.min(downT, prev) // down-trend: only ratchet DOWN
      }

      // Signal detection. Buy when the line crosses above its value
      // 2 bars ago; Sell when it crosses below. This matches the
      // canonical Pine reference (`crossover(AlphaTrend, AlphaTrend[2])`).
      const buys  = []
      const sells = []
      for (let i = 3; i < length; i++) {
        const cur  = trend[i],     past  = trend[i - 2]
        const pCur = trend[i - 1], pPast = trend[i - 3]
        if (!Number.isFinite(cur)  || !Number.isFinite(past))  continue
        if (!Number.isFinite(pCur) || !Number.isFinite(pPast)) continue
        if (pCur <= pPast && cur >  past) buys.push(i)
        if (pCur >= pPast && cur <  past) sells.push(i)
      }

      return { trend, buys, sells }
    },

    // ──────────────────────────────────────────────────────────────
    //  render — called every frame. Keep it pure & cheap.
    //
    //  All the heavy lifting was done in compute(); here we just
    //  push draw commands to the engine's command buffer.
    // ──────────────────────────────────────────────────────────────
    render(draw, computed, ohlcv) {
      const { trend, buys, sells } = computed
      const n = trend.length
      if (n === 0) return

      const p = this.params

      // Choose colour by direction of the last bar's move on the line.
      // (Trend going up vs the previous bar ⇒ up-colour; otherwise down.)
      const last  = trend[n - 1]
      const prev  = Number.isFinite(trend[n - 2]) ? trend[n - 2] : last
      const color = last >= prev ? p.upColor : p.downColor

      // Main trailing line.
      draw.seriesLine(trend, color, p.lineWidth)

      // BUY / SELL arrows at trend flips.
      if (p.showSignals) {
        for (const i of buys) {
          // Anchor below the candle low so the marker doesn't clash
          // with the candle body.
          draw.markerUp(i, ohlcv.low[i], p.upColor, 6)
        }
        for (const i of sells) {
          draw.markerDown(i, ohlcv.high[i], p.downColor, 6)
        }
      }

      // Right-edge label so the line stays identifiable when the
      // chart hosts multiple custom indicators at once.
      draw.priceLabel(last, `AlphaTrend(${p.period})`, color, 10)
    },
  })
}

/**
 * Simple moving-average ATR — matches the classic AlphaTrend Pine
 * implementation. (Use Wilder smoothing — `(prev·(n-1)+tr)/n` — if you
 * want the same ATR as RSI / SuperTrend.)
 *
 * Kept inline so this file is fully self-contained and copy-pasteable.
 */
function simpleATR(high, low, close, period) {
  const len = close.length
  const atr = new Array(len).fill(NaN)
  if (len === 0) return atr

  let sumTR = 0
  for (let i = 0; i < len; i++) {
    let tr
    if (i === 0) {
      tr = high[i] - low[i]
    } else {
      const a = high[i] - low[i]
      const b = Math.abs(high[i] - close[i - 1])
      const c = Math.abs(low[i]  - close[i - 1])
      tr = a > b ? (a > c ? a : c) : (b > c ? b : c)
    }

    sumTR += tr
    if (i >= period) {
      // Drop the oldest TR so `sumTR` covers exactly `period` bars.
      // (Recomputing the dropped TR is a tiny price for an O(1) update.)
      let oldTR
      const k = i - period
      if (k === 0) {
        oldTR = high[0] - low[0]
      } else {
        const a = high[k] - low[k]
        const b = Math.abs(high[k] - close[k - 1])
        const c = Math.abs(low[k]  - close[k - 1])
        oldTR = a > b ? (a > c ? a : c) : (b > c ? b : c)
      }
      sumTR -= oldTR
    }
    if (i >= period - 1) atr[i] = sumTR / period
  }
  return atr
}
