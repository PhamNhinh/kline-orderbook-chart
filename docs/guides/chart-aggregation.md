# Chart Aggregation

kline-orderbook-chart includes utilities to build non-time-based charts from standard OHLCV data: **Renko**, **Range**, and **Tick** charts. These are computed in JavaScript and fed into the engine as regular kline data.

---

## Overview

| Chart Type | Description | Parameter |
|---|---|---|
| **Renko** | Fixed-size bricks, no wicks. New brick when price moves by `brickSize`. | `brickSize` (price units) |
| **Range** | Each candle completes when its high-low range reaches `rangeSize`. | `rangeSize` (price units) |
| **Tick** | Each candle represents a fixed number of source candles (trade approximation). | `tickCount` (integer) |

All three functions take standard OHLCV input and return new OHLCV arrays that can be passed directly to `chart.setKlines()`.

---

## Imports

```javascript
import {
  buildRenko,
  buildRange,
  buildTick,
  suggestDefaults,
} from 'kline-orderbook-chart'
```

---

## Renko Charts

### `buildRenko(klines, brickSize)` → `{ t, o, h, l, c, v }`

Builds Renko bricks from close prices. Each brick has a fixed size. Wicks are absent — `high === close` for bull bricks, `low === close` for bear bricks.

| Parameter | Type | Description |
|---|---|---|
| `klines` | `{ t[], o[], h[], l[], c[], v[] }` | Source OHLCV data |
| `brickSize` | `number` | Brick size in price units |

```javascript
const source = {
  t: timestamps,
  o: Array.from(opens),
  h: Array.from(highs),
  l: Array.from(lows),
  c: Array.from(closes),
  v: Array.from(volumes),
}

const renko = buildRenko(source, 50)    // $50 per brick (for BTC)

chart.setKlines(
  new Float64Array(renko.t),
  new Float64Array(renko.o),
  new Float64Array(renko.h),
  new Float64Array(renko.l),
  new Float64Array(renko.c),
  new Float64Array(renko.v),
)
```

### How Renko Works

1. Start from the first close price, rounded to the nearest brick boundary
2. Accumulate volume as price moves
3. When price moves up by `brickSize`: emit a bull brick (open → close = up)
4. When price moves down by `brickSize`: emit a bear brick (open → close = down)
5. Multiple bricks can be emitted from a single source candle if price moves several brick sizes

---

## Range Charts

### `buildRange(klines, rangeSize)` → `{ t, o, h, l, c, v }`

Each output candle completes when its price range (high - low) reaches `rangeSize`.

| Parameter | Type | Description |
|---|---|---|
| `klines` | `{ t[], o[], h[], l[], c[], v[] }` | Source OHLCV data |
| `rangeSize` | `number` | Price range per candle |

```javascript
const range = buildRange(source, 100)   // $100 range per candle

chart.setKlines(
  new Float64Array(range.t),
  new Float64Array(range.o),
  new Float64Array(range.h),
  new Float64Array(range.l),
  new Float64Array(range.c),
  new Float64Array(range.v),
)
```

### How Range Works

1. Open a new candle at the first bar's open price
2. Track running high and low
3. When `high - low >= rangeSize`: close the candle, start a new one
4. The last candle may be incomplete (range not yet reached)

---

## Tick Charts

### `buildTick(klines, tickCount)` → `{ t, o, h, l, c, v }`

Groups every `tickCount` source candles into one output candle. Since we don't have individual trades, each source candle approximates one "tick unit."

| Parameter | Type | Description |
|---|---|---|
| `klines` | `{ t[], o[], h[], l[], c[], v[] }` | Source OHLCV data |
| `tickCount` | `number` | Number of source candles per output candle |

```javascript
const tick = buildTick(source, 10)   // 10 source candles per output candle

chart.setKlines(
  new Float64Array(tick.t),
  new Float64Array(tick.o),
  new Float64Array(tick.h),
  new Float64Array(tick.l),
  new Float64Array(tick.c),
  new Float64Array(tick.v),
)
```

---

## Suggested Defaults

### `suggestDefaults(lastPrice, timeframeSec)` → `{ brickSize, rangeSize, tickCount }`

Returns sensible default parameters based on the asset's price level and the source timeframe.

| `lastPrice` range | `brickSize` | `rangeSize` | `tickCount` |
|---|---|---|---|
| > 10,000 (e.g. BTC) | 50 | 100 | depends on TF |
| > 1,000 (e.g. ETH) | 10 | 20 | depends on TF |
| > 100 | 1 | 2 | depends on TF |
| > 1 | 0.1 | 0.2 | depends on TF |
| < 1 | 0.001 | 0.002 | depends on TF |

| Timeframe | `tickCount` |
|---|---|
| ≤ 1 min | 10 |
| ≤ 5 min | 5 |
| > 5 min | 3 |

```javascript
const lastPrice = chart.getLastClose()
const defaults = suggestDefaults(lastPrice, 300)   // 5 min timeframe

console.log(defaults)
// → { brickSize: 50, rangeSize: 100, tickCount: 5 }

const renko = buildRenko(source, defaults.brickSize)
```

---

## Real Timestamps

When using aggregated chart types, the output timestamps correspond to the source candle that triggered each brick/bar — not actual wall-clock times. To preserve the original timestamps for tooltip display:

```javascript
const renko = buildRenko(source, 50)
chart.setKlines(/* ... renko arrays ... */)

// Store original real timestamps for tooltip
chart.setRealTimestamps(new Float64Array(source.t))
```

When a new candle is appended live:

```javascript
chart.appendRealTimestamp(newOriginalTimestamp)
```

---

## Complete Example: Renko with Live Updates

```javascript
import { createChartBridge, buildRenko, suggestDefaults } from 'kline-orderbook-chart'

const chart = await createChartBridge(canvas, { licenseKey: '...' })
chart.setTheme('dark')

// Load historical data
const res = await fetch('/api/klines?symbol=BTCUSDT&interval=5m&limit=2000')
const raw = await res.json()

const source = {
  t: raw.map(k => k[0] / 1000),
  o: raw.map(k => +k[1]),
  h: raw.map(k => +k[2]),
  l: raw.map(k => +k[3]),
  c: raw.map(k => +k[4]),
  v: raw.map(k => +k[5]),
}

const lastPrice = source.c[source.c.length - 1]
const { brickSize } = suggestDefaults(lastPrice, 300)

const renko = buildRenko(source, brickSize)

chart.setKlines(
  new Float64Array(renko.t),
  new Float64Array(renko.o),
  new Float64Array(renko.h),
  new Float64Array(renko.l),
  new Float64Array(renko.c),
  new Float64Array(renko.v),
)
chart.setRealTimestamps(new Float64Array(source.t))
chart.enableVolume()
chart.start()

// Live updates: on each new source candle, rebuild renko
const ws = new WebSocket('wss://stream.binance.com/ws/btcusdt@kline_5m')

ws.onmessage = (event) => {
  const { k } = JSON.parse(event.data)

  if (k.x) {
    // New candle closed — add to source and rebuild
    source.t.push(k.t / 1000)
    source.o.push(+k.o)
    source.h.push(+k.h)
    source.l.push(+k.l)
    source.c.push(+k.c)
    source.v.push(+k.v)

    const updated = buildRenko(source, brickSize)
    chart.setKlines(
      new Float64Array(updated.t),
      new Float64Array(updated.o),
      new Float64Array(updated.h),
      new Float64Array(updated.l),
      new Float64Array(updated.c),
      new Float64Array(updated.v),
    )
  }
}
```

---

## Next Steps

| Topic | Link |
|---|---|
| Candlestick data format | [Candlestick Data](./data.md) |
| Advanced topics | [Advanced Topics](./advanced.md) |
| Framework integration | [Framework Integration](../examples/framework-integration.md) |
