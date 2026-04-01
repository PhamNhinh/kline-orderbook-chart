/**
 * Generates realistic-looking OHLCV sample data for demo purposes.
 * In production, you'd fetch this from your exchange API / WebSocket.
 */

export function generateKlines(count = 1000, startPrice = 68500, intervalSec = 300) {
  const data = []
  let price = startPrice
  const now = Math.floor(Date.now() / 1000)
  const volatility = startPrice > 10000 ? 0.005 : startPrice > 1000 ? 0.008 : 0.012

  for (let i = 0; i < count; i++) {
    const trend = Math.sin(i / 80) * volatility * price * 0.3
    const noise = (Math.random() - 0.48) * volatility * price
    const change = trend + noise

    const o = price
    const c = price + change
    const h = Math.max(o, c) + Math.random() * volatility * price * 0.6
    const l = Math.min(o, c) - Math.random() * volatility * price * 0.6
    const baseVol = startPrice > 10000 ? 200 : startPrice > 1000 ? 3000 : 50000
    const v = baseVol * (0.3 + Math.random() * 1.7) * (1 + Math.abs(change / price) * 10)

    data.push({
      t: now - (count - i) * intervalSec,
      o: +o.toFixed(2),
      h: +h.toFixed(2),
      l: +l.toFixed(2),
      c: +c.toFixed(2),
      v: +v.toFixed(2),
    })
    price = c
  }
  return data
}

/**
 * Generates a fake orderbook heatmap depth matrix.
 * rows = price levels, cols = time columns.
 */
export function generateHeatmapMatrix(klines, rows = 150, cols = 80) {
  if (!klines.length) return null

  const prices = klines.map(k => [k.h, k.l]).flat()
  const priceMin = Math.min(...prices) * 0.998
  const priceMax = Math.max(...prices) * 1.002
  const timeStart = klines[Math.max(0, klines.length - cols)].t
  const timeEnd = klines[klines.length - 1].t

  const data = new Float32Array(rows * cols)
  for (let col = 0; col < cols; col++) {
    const ki = Math.min(klines.length - 1, klines.length - cols + col)
    const k = klines[ki]
    const midPrice = (k.h + k.l) / 2

    for (let row = 0; row < rows; row++) {
      const price = priceMin + (row / rows) * (priceMax - priceMin)
      const dist = Math.abs(price - midPrice) / (priceMax - priceMin)
      const support = price < midPrice ? 0.3 : 0
      const resistance = price > midPrice ? 0.2 : 0
      const intensity = Math.max(0, 1 - dist * 4) * (0.2 + Math.random() * 0.8) + support + resistance
      data[row * cols + col] = Math.min(1, Math.max(0, intensity * 0.6))
    }
  }

  return { data, rows, cols, priceMin, priceMax, timeStart, timeEnd }
}

/**
 * Generates fake Open Interest data matching kline timestamps.
 */
export function generateOIData(klines) {
  let oi = 1500000000
  return klines.map(k => {
    oi += (Math.random() - 0.48) * 5000000
    return { t: k.t, value: +oi.toFixed(0), delta: +(Math.random() * 2000000 - 1000000).toFixed(0) }
  })
}

/**
 * Simulates real-time kline updates. Calls callback every intervalMs.
 */
export function simulateLive(klines, intervalMs = 1000, onUpdate) {
  let timer = setInterval(() => {
    const last = klines[klines.length - 1]
    const change = (Math.random() - 0.48) * 0.002 * last.c
    const updated = {
      ...last,
      c: +(last.c + change).toFixed(2),
      h: +Math.max(last.h, last.c + change).toFixed(2),
      l: +Math.min(last.l, last.c + change).toFixed(2),
      v: +(last.v + Math.random() * 10).toFixed(2),
    }
    klines[klines.length - 1] = updated
    onUpdate('update', updated)

    if (Math.random() < 0.01) {
      const newBar = {
        t: last.t + 300,
        o: updated.c,
        h: updated.c,
        l: updated.c,
        c: updated.c,
        v: +(50 + Math.random() * 200).toFixed(2),
      }
      klines.push(newBar)
      onUpdate('new', newBar)
    }
  }, intervalMs)

  return () => clearInterval(timer)
}
