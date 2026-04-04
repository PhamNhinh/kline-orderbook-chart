/**
 * Tick / Range / Renko chart aggregation.
 *
 * Takes standard time-based OHLCV arrays and re-aggregates them into
 * non-time-based candles/bricks. The output is a new set of OHLCV arrays
 * that can be fed directly into bridge.setKlines().
 *
 * Chart types:
 *   - tick:  each candle = N trades (approximated from OHLCV candles)
 *   - range: each candle = fixed price range
 *   - renko: each brick  = fixed price movement (no wicks)
 */

/**
 * Build Renko bricks from close prices.
 * @param {Object} klines - { t[], o[], h[], l[], c[], v[] }
 * @param {number} brickSize - size of each brick in price units
 * @returns {{ t: number[], o: number[], h: number[], l: number[], c: number[], v: number[] }}
 */
export function buildRenko(klines, brickSize) {
  const { t, o, h, l, c, v } = klines
  const n = c.length
  if (n === 0 || brickSize <= 0) return { t: [], o: [], h: [], l: [], c: [], v: [] }

  const rt = [], ro = [], rh = [], rl = [], rc = [], rv = []
  let basePrice = Math.round(c[0] / brickSize) * brickSize
  let accVol = 0

  for (let i = 0; i < n; i++) {
    accVol += v[i]
    const price = c[i]
    const diff = price - basePrice

    while (diff >= brickSize) {
      const brickOpen = basePrice
      const brickClose = basePrice + brickSize
      rt.push(t[i])
      ro.push(brickOpen)
      rh.push(brickClose)
      rl.push(brickOpen)
      rc.push(brickClose)
      rv.push(accVol)
      accVol = 0
      basePrice = brickClose
    }

    while (-diff >= brickSize) {
      const brickOpen = basePrice
      const brickClose = basePrice - brickSize
      rt.push(t[i])
      ro.push(brickOpen)
      rh.push(brickOpen)
      rl.push(brickClose)
      rc.push(brickClose)
      rv.push(accVol)
      accVol = 0
      basePrice = brickClose
    }
  }

  return { t: rt, o: ro, h: rh, l: rl, c: rc, v: rv }
}

/**
 * Build Range candles from OHLCV data.
 * Each candle completes when price range (high - low) reaches rangeSize.
 * @param {Object} klines - { t[], o[], h[], l[], c[], v[] }
 * @param {number} rangeSize - price range per candle
 * @returns {{ t: number[], o: number[], h: number[], l: number[], c: number[], v: number[] }}
 */
export function buildRange(klines, rangeSize) {
  const { t, o, h, l, c, v } = klines
  const n = c.length
  if (n === 0 || rangeSize <= 0) return { t: [], o: [], h: [], l: [], c: [], v: [] }

  const rt = [], ro = [], rh = [], rl = [], rc = [], rv = []

  let barOpen = o[0], barHigh = h[0], barLow = l[0], barVol = 0, barTs = t[0]

  for (let i = 0; i < n; i++) {
    barHigh = Math.max(barHigh, h[i])
    barLow = Math.min(barLow, l[i])
    barVol += v[i]

    while (barHigh - barLow >= rangeSize) {
      const isUp = c[i] >= barOpen
      const barClose = isUp ? barLow + rangeSize : barHigh - rangeSize
      rt.push(barTs)
      ro.push(barOpen)
      rh.push(barHigh)
      rl.push(barLow)
      rc.push(barClose)
      rv.push(barVol)

      barOpen = barClose
      barHigh = isUp ? Math.max(h[i], barClose) : barClose
      barLow = isUp ? barClose : Math.min(l[i], barClose)
      barVol = 0
      barTs = t[i]

      if (barHigh - barLow < rangeSize) break
    }
  }

  if (barVol > 0 || rt.length === 0) {
    rt.push(barTs)
    ro.push(barOpen)
    rh.push(barHigh)
    rl.push(barLow)
    rc.push(c[n - 1])
    rv.push(barVol)
  }

  return { t: rt, o: ro, h: rh, l: rl, c: rc, v: rv }
}

/**
 * Build Tick candles from OHLCV data.
 * Since we don't have individual trades, we approximate by treating each
 * source candle as ~1 "tick unit" and group every tickCount source candles.
 * @param {Object} klines - { t[], o[], h[], l[], c[], v[] }
 * @param {number} tickCount - number of source candles per output candle
 * @returns {{ t: number[], o: number[], h: number[], l: number[], c: number[], v: number[] }}
 */
export function buildTick(klines, tickCount) {
  const { t, o, h, l, c, v } = klines
  const n = c.length
  if (n === 0 || tickCount <= 0) return { t: [], o: [], h: [], l: [], c: [], v: [] }

  const rt = [], ro = [], rh = [], rl = [], rc = [], rv = []
  const tc = Math.max(1, Math.round(tickCount))

  for (let i = 0; i < n; i += tc) {
    const end = Math.min(i + tc, n)
    let barH = -Infinity, barL = Infinity, barV = 0
    for (let j = i; j < end; j++) {
      if (h[j] > barH) barH = h[j]
      if (l[j] < barL) barL = l[j]
      barV += v[j]
    }
    rt.push(t[i])
    ro.push(o[i])
    rh.push(barH)
    rl.push(barL)
    rc.push(c[end - 1])
    rv.push(barV)
  }

  return { t: rt, o: ro, h: rh, l: rl, c: rc, v: rv }
}

/**
 * Suggest default parameters based on price level and timeframe.
 */
export function suggestDefaults(lastPrice, timeframeSec) {
  const brickSize = lastPrice > 10000 ? 50
    : lastPrice > 1000 ? 10
    : lastPrice > 100 ? 1
    : lastPrice > 1 ? 0.1 : 0.001

  const rangeSize = brickSize * 2
  const tickCount = timeframeSec <= 60 ? 10 : timeframeSec <= 300 ? 5 : 3

  return { brickSize, rangeSize, tickCount }
}
