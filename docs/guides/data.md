# Candlestick Data

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/data-loading](https://mrd-indicators.com/docs/data-loading)** — this Markdown mirror is kept for offline / GitHub browsing.


This page covers everything about loading, updating, and accessing OHLCV candlestick data in the chart engine.

---

## Data Format

The engine stores OHLCV data as six parallel arrays of equal length:

| Array | Type | Unit | Description |
|---|---|---|---|
| `timestamps` | `Float64Array` | Unix seconds | Candle open time (NOT milliseconds) |
| `open` | `Float64Array` | Price | Open price |
| `high` | `Float64Array` | Price | High price |
| `low` | `Float64Array` | Price | Low price |
| `close` | `Float64Array` | Price | Close price |
| `volume` | `Float64Array` | Units | Volume |

> **Common mistake:** Binance and most exchanges return timestamps in milliseconds. You must divide by 1000 before passing to the engine.

---

## Loading Historical Data

### `setKlines(timestamps, open, high, low, close, volume)`

Replaces all existing kline data with a new dataset. This is the primary method for initial data load.

```javascript
// From Binance REST API
const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=1000')
const raw = await res.json()

const len = raw.length
const timestamps = new Float64Array(len)
const open       = new Float64Array(len)
const high       = new Float64Array(len)
const low        = new Float64Array(len)
const close      = new Float64Array(len)
const volume     = new Float64Array(len)

for (let i = 0; i < len; i++) {
  timestamps[i] = raw[i][0] / 1000   // ms → seconds
  open[i]       = +raw[i][1]
  high[i]       = +raw[i][2]
  low[i]        = +raw[i][3]
  close[i]      = +raw[i][4]
  volume[i]     = +raw[i][5]
}

chart.setKlines(timestamps, open, high, low, close, volume)
```

**Accepted input types:** `Float64Array`, `Float32Array`, `number[]`, or any array-like. The engine internally converts to `Float64Array`.

**Sorting:** Data must be sorted by timestamp in ascending order (oldest first).

---

## Real-time Updates

### `appendKline(ts, o, h, l, c, v)`

Appends a single new completed candle to the end of the dataset.

```javascript
chart.appendKline(1710003600, 67500, 67890, 67400, 67800, 125.5)
```

Use this when a candle closes and a new one begins. Complexity: O(1) amortised.

### `updateLastKline(ts, o, h, l, c, v)`

Updates the most recent (rightmost) candle. Use this for the live/forming candle.

```javascript
chart.updateLastKline(1710003600, 67500, 67920, 67380, 67650, 130.2)
```

This is called frequently (every tick from WebSocket). The engine only re-renders if the visual state actually changes.

### Typical WebSocket Pattern

```javascript
const ws = new WebSocket('wss://stream.binance.com/ws/btcusdt@kline_1h')

ws.onmessage = (event) => {
  const { k } = JSON.parse(event.data)
  const ts = k.t / 1000   // ms → seconds

  if (k.x) {
    // k.x = true means candle is closed
    chart.appendKline(ts, +k.o, +k.h, +k.l, +k.c, +k.v)
  } else {
    // Candle still forming
    chart.updateLastKline(ts, +k.o, +k.h, +k.l, +k.c, +k.v)
  }
}
```

---

## Prepending Historical Data (Infinite Scroll)

### `prependKlines(timestamps, open, high, low, close, volume)`

Adds older candles to the beginning of the dataset. Use this to implement infinite scroll — loading more history as the user pans left.

```javascript
// User scrolled to the left edge, load older data
const olderRes = await fetch(`/api/klines?symbol=BTCUSDT&interval=1h&endTime=${oldestTimestamp * 1000}&limit=500`)
const olderRaw = await olderRes.json()

const len = olderRaw.length
const ts = new Float64Array(olderRaw.map(k => k[0] / 1000))
const o  = new Float64Array(olderRaw.map(k => +k[1]))
const h  = new Float64Array(olderRaw.map(k => +k[2]))
const l  = new Float64Array(olderRaw.map(k => +k[3]))
const c  = new Float64Array(olderRaw.map(k => +k[4]))
const v  = new Float64Array(olderRaw.map(k => +k[5]))

chart.prependKlines(ts, o, h, l, c, v)
```

The viewport position is preserved — the user does not see a visual jump.

---

## Removing Data

### `popLastKline()`

Removes the last (rightmost) candle. Returns `true` if a candle was removed, `false` if the dataset is empty.

```javascript
const removed = chart.popLastKline()  // → true/false
```

---

## Accessing Data

These methods provide read access to the current kline data stored in the engine.

### `getKlineCount()` → `number`

Returns the number of candles currently loaded.

```javascript
const count = chart.getKlineCount()  // → 1000
```

### `getKlineTimestamps()` → `Float64Array | null`

### `getKlineOpens()` → `Float64Array | null`

### `getKlineHighs()` → `Float64Array | null`

### `getKlineLows()` → `Float64Array | null`

### `getKlineCloses()` → `Float64Array | null`

### `getKlineVolumes()` → `Float64Array | null`

Returns a copy of the corresponding data array, or `null` if the engine has been destroyed.

```javascript
const closes = chart.getKlineCloses()
const lastClose = closes[closes.length - 1]
```

### `getLastClose()` → `number`

Convenience method for the most recent close price.

```javascript
const price = chart.getLastClose()  // → 67800
```

---

## Real Timestamps

### `setRealTimestamps(realTs)`

### `appendRealTimestamp(realTs)`

For aggregated chart types (Renko, Range, Tick), the kline timestamps may not correspond to actual wall-clock times. Use these methods to store the original real timestamps alongside the aggregated data.

```javascript
chart.setRealTimestamps(originalTimestamps)
chart.appendRealTimestamp(latestRealTimestamp)
```

---

## Chart Types

### `setChartType(type)` / `getChartType()`

| Value | Chart Type | Description |
|---|---|---|
| `0` | Candlestick | Standard OHLC candlesticks (default) |
| `1` | Heatmap | Orderbook depth heatmap behind candles |
| `2` | Footprint | Footprint / cluster chart (requires trade data) |

```javascript
chart.setChartType(0)   // candlestick (default)
chart.setChartType(1)   // heatmap overlay mode
chart.setChartType(2)   // footprint chart
```

> **Note:** Heikin-Ashi, Line, and Area chart styles are controlled through the rendering pipeline, not via `setChartType`.

---

## Configuration

### `setPrecision(decimals)`

Sets the number of decimal places on the price axis.

```javascript
chart.setPrecision(2)   // $67,500.00
chart.setPrecision(8)   // 0.00001234 (for low-price assets)
```

### `setCandleInterval(seconds)`

Tells the engine the time interval of each candle in seconds. This is used for time axis labeling and heatmap column alignment.

```javascript
chart.setCandleInterval(60)      // 1 minute
chart.setCandleInterval(300)     // 5 minutes
chart.setCandleInterval(3600)    // 1 hour
chart.setCandleInterval(86400)   // 1 day
```

---

## Data Integrity Rules

1. **Timestamps must be in seconds** — not milliseconds
2. **Arrays must be equal length** — all six arrays must have the same number of elements
3. **Ascending order** — timestamps must be sorted oldest → newest
4. **No NaN in timestamps** — `NaN` timestamps will cause rendering artifacts
5. **Price values must be finite** — `Infinity` or `NaN` in OHLC data is undefined behavior
6. **Volume can be zero** — zero-volume bars are valid

---

## Performance Tips

| Tip | Why |
|---|---|
| Use `Float64Array` directly | Avoids internal conversion copy |
| Batch WS updates | `updateLastKline` is O(1) but triggers a dirty flag each call |
| Limit to 10,000–20,000 candles | Beyond this, consider using `prependKlines` on demand |
| Prefer `appendKline` over `setKlines` for live data | `setKlines` replaces the entire dataset |

---

## Next Steps

| Topic | Link |
|---|---|
| Add orderbook heatmap behind candles | [Orderbook Heatmap](./orderbook-heatmap.md) |
| Enable footprint chart | [Footprint Chart](./footprint-chart.md) |
| Build Renko/Range/Tick charts | [Chart Aggregation](./chart-aggregation.md) |
| Enable indicators | [Built-in Indicators](./indicators.md) |
