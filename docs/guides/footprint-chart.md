# Footprint Chart

The footprint chart (also called a cluster chart) shows bid/ask volume at each price level within each candle bar. It reveals order flow dynamics — who is buying vs. selling, at which prices, and where imbalances exist.

**Plan requirement:** Professional or Enterprise.

---

## Overview

A footprint bar displays:
- **Bid volume** (left side) vs. **Ask volume** (right side) at each price level
- **Delta** (ask − bid) per price level
- **POC** (Point of Control) — the price level with highest volume
- **Imbalance detection** — levels where one side dominates significantly

```
         ┌──────────────────────┐
  68,200 │   12.5  │  18.3     │ ← Imbalance (asks > bids)
  68,190 │   45.2  │  42.1     │
  68,180 │  ▶82.6◀ │  85.3     │ ← POC (highest volume)
  68,170 │   30.1  │  15.4     │ ← Imbalance (bids > asks)
  68,160 │   18.7  │  22.9     │
         └──────────────────────┘
           Bids       Asks
```

---

## Quick Start

### 1. Switch to Footprint Mode

```javascript
chart.setChartType(2)   // 2 = footprint chart mode
```

### 2. Set Tick Size

The tick size determines the price granularity of each row in the footprint bar.

```javascript
chart.setFootprintTickSize(10)   // $10 per price level
```

Choose a tick size appropriate for the asset:
- **BTC:** 10–50
- **ETH:** 1–5
- **Low-cap altcoins:** 0.001–0.01

### 3. Allocate Footprint Buffers

After loading klines, allocate footprint storage for all bars:

```javascript
chart.setKlines(timestamps, open, high, low, close, volume)
chart.footprintEnsureLen(timestamps.length)
```

### 4. Feed Trade Data

The footprint chart requires individual trade data. Connect to an aggTrade WebSocket stream:

```javascript
const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@aggTrade')

ws.onmessage = (event) => {
  const trade = JSON.parse(event.data)
  const tradeTime = trade.T / 1000   // ms → seconds
  const barIndex = Math.floor((tradeTime - timestamps[0]) / intervalSec)

  if (barIndex >= 0 && barIndex < timestamps.length) {
    chart.footprintAddTrade(
      barIndex,
      +trade.p,           // price
      +trade.q,           // quantity
      trade.m ? 1 : 0     // 1 = buyer is maker (sell), 0 = buyer is taker (buy)
    )
  }
}
```

---

## API Reference

### Trade Ingestion

#### `footprintAddTrade(barIndex, price, volume, isBuyerMaker)`

Adds a single trade to the footprint data.

| Parameter | Type | Description |
|---|---|---|
| `barIndex` | `number` | Index of the candle bar (0-based from the first kline) |
| `price` | `number` | Trade execution price |
| `volume` | `number` | Trade volume/quantity |
| `isBuyerMaker` | `number` | `1` if buyer is maker (sell aggressor), `0` if buyer is taker (buy aggressor) |

#### `footprintAddTradeBatch(data)`

Adds multiple trades in a single call for better performance. The data is a flat `Float64Array` where every 4 elements represent one trade.

| Elements | Meaning |
|---|---|
| `data[i*4 + 0]` | barIndex |
| `data[i*4 + 1]` | price |
| `data[i*4 + 2]` | volume |
| `data[i*4 + 3]` | isBuyerMaker (1 or 0) |

```javascript
let tradeBuf = new Float64Array(4096)
let bufLen = 0
let flushRaf = null

ws.onmessage = (event) => {
  const t = JSON.parse(event.data)
  const barIndex = Math.floor((t.T / 1000 - timestamps[0]) / intervalSec)
  if (barIndex < 0) return

  // Grow buffer if needed
  if (bufLen + 4 > tradeBuf.length) {
    const bigger = new Float64Array(tradeBuf.length * 2)
    bigger.set(tradeBuf)
    tradeBuf = bigger
  }

  tradeBuf[bufLen++] = barIndex
  tradeBuf[bufLen++] = +t.p
  tradeBuf[bufLen++] = +t.q
  tradeBuf[bufLen++] = t.m ? 1 : 0

  // Batch flush on next animation frame
  if (!flushRaf) {
    flushRaf = requestAnimationFrame(() => {
      flushRaf = null
      chart.footprintAddTradeBatch(tradeBuf.subarray(0, bufLen))
      bufLen = 0
    })
  }
}
```

> **Performance tip:** Batching trades into RAF-aligned flushes dramatically reduces the number of engine boundary crossings.

#### `footprintSetBar(barIndex, tickSize, prices, bidVols, askVols)`

Directly sets the complete footprint data for a single bar. Use this for historical backfill when you have pre-aggregated data.

```javascript
const prices  = new Float64Array([68160, 68170, 68180, 68190, 68200])
const bidVols = new Float64Array([18.7, 30.1, 82.6, 45.2, 12.5])
const askVols = new Float64Array([22.9, 15.4, 85.3, 42.1, 18.3])

chart.footprintSetBar(0, 10, prices, bidVols, askVols)
```

---

### Buffer Management

#### `footprintEnsureLen(n)`

Ensures the footprint buffer has space for at least `n` bars. Call after `setKlines` and when appending new candles.

#### `footprintClear()`

Clears all footprint data for all bars.

#### `footprintClearBar(barIndex)`

Clears footprint data for a single bar.

#### `footprintPrependEmpty(count)`

Prepends empty footprint slots when prepending historical klines.

```javascript
// After prepending older candles
chart.prependKlines(olderTs, olderO, olderH, olderL, olderC, olderV)
chart.footprintPrependEmpty(olderTs.length)
```

---

### Display Modes

#### `footprintSetDisplayMode(mode)` / `footprintGetDisplayMode()`

| Value | Mode | Description |
|---|---|---|
| `0` | **BidAsk** | Shows bid volume on left, ask volume on right |
| `1` | **Delta** | Shows net delta (ask − bid) per price level |
| `2` | **Volume** | Shows total volume (bid + ask) per price level |

```javascript
chart.footprintSetDisplayMode(0)   // Bid/Ask (default)
chart.footprintSetDisplayMode(1)   // Delta
chart.footprintSetDisplayMode(2)   // Volume
```

---

### Signals & Profile

#### `footprintSetShowSignals(show)` / `footprintGetShowSignals()`

Toggles imbalance and absorption signal markers on the footprint chart.

```javascript
chart.footprintSetShowSignals(true)
const count = chart.footprintSignalCount()   // number of detected signals
```

#### `footprintSetShowProfile(show)` / `footprintGetShowProfile()`

Toggles the volume profile sidebar on the footprint chart.

```javascript
chart.footprintSetShowProfile(true)
```

#### `footprintProfileHitTest(sx, sy)` → `string`

Returns hit test information for the volume profile at screen coordinates.

```javascript
const info = chart.footprintProfileHitTest(mouseX, mouseY)
```

---

### Delta Histogram Sub-pane

The delta histogram is a separate sub-pane below the main chart that shows per-bar net delta.

#### `enableDeltaHistogram()` / `disableDeltaHistogram()` / `deltaHistogramEnabled()`

```javascript
chart.enableDeltaHistogram()

if (chart.deltaHistogramEnabled()) {
  console.log('Delta histogram is active')
}

chart.disableDeltaHistogram()
```

---

## Complete Example

```javascript
import { createChartBridge } from '@mrd/chart-engine'

const chart = await createChartBridge(canvas, { licenseKey: '...' })

// Load candles
chart.setKlines(timestamps, open, high, low, close, volume)
chart.setCandleInterval(300)      // 5 min candles
chart.setPrecision(2)

// Enable footprint
chart.setChartType(2)
chart.setFootprintTickSize(10)
chart.footprintEnsureLen(timestamps.length)
chart.footprintSetDisplayMode(0)     // Bid/Ask mode
chart.footprintSetShowSignals(true)  // Show imbalance signals
chart.enableDeltaHistogram()         // Delta sub-pane

chart.start()

// Stream trades
const aggTradeWs = new WebSocket('wss://fstream.binance.com/ws/btcusdt@aggTrade')

let tradeBuf = new Float64Array(8192)
let bufLen = 0
let flushRaf = null
const firstTs = timestamps[0]

aggTradeWs.onmessage = (event) => {
  const t = JSON.parse(event.data)
  const barIndex = Math.floor((t.T / 1000 - firstTs) / 300)
  if (barIndex < 0) return

  if (bufLen + 4 > tradeBuf.length) {
    const bigger = new Float64Array(tradeBuf.length * 2)
    bigger.set(tradeBuf)
    tradeBuf = bigger
  }

  tradeBuf[bufLen++] = barIndex
  tradeBuf[bufLen++] = +t.p
  tradeBuf[bufLen++] = +t.q
  tradeBuf[bufLen++] = t.m ? 1 : 0

  if (!flushRaf) {
    flushRaf = requestAnimationFrame(() => {
      flushRaf = null
      chart.footprintAddTradeBatch(tradeBuf.subarray(0, bufLen))
      bufLen = 0
    })
  }
}

// When a new candle starts, extend the buffer
function onNewCandle() {
  chart.footprintEnsureLen(chart.getKlineCount())
}
```

---

## Next Steps

| Topic | Link |
|---|---|
| Configure indicators | [Built-in Indicators](./indicators.md) |
| Orderbook heatmap | [Orderbook Heatmap](./orderbook-heatmap.md) |
| Events & tooltips | [Events & Tooltips](./tooltip.md) |
