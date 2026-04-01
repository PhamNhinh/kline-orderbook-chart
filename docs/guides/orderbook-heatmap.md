# Orderbook Heatmap

The orderbook heatmap renders real-time order book depth as a color-mapped layer behind the candlesticks. This is the signature feature of Kline Orderbook Chart — no other library offers this.

<p align="center">
  <img src="../../assets/media/heatmap-large-trades.png" alt="Orderbook Heatmap behind candlesticks" width="100%" />
</p>

## How it works

The heatmap is a 2D matrix where:

- **Rows** = price levels (from lowest to highest)
- **Columns** = time slices (from oldest to newest)
- **Values** = depth/volume at that price and time (higher = brighter color)

The engine maps each cell value to a color using an adaptive intensity scale, then renders the matrix behind the candles.

## Data format

The heatmap data is a **flat `Float64Array`** in row-major order:

```
[row0_col0, row0_col1, row0_col2, ..., row1_col0, row1_col1, ...]
```

Where `row0` is the lowest price level and the last row is the highest.

## Setting the heatmap

```javascript
chart.setHeatmap(
  data,         // Float64Array — flattened row-major matrix
  rows,         // number of price levels (rows)
  cols,         // number of time columns
  xStart,       // timestamp of the first column (seconds)
  xStep,        // time interval between columns (seconds)
  yStart,       // price of the first row (lowest price)
  yStep,        // price interval between rows
)
```

### Example

```javascript
const rows = 200       // 200 price levels
const cols = 100       // 100 time snapshots
const priceMin = 64000
const priceMax = 66000
const timeStart = 1710000000
const timeEnd = 1710050000

const yStep = (priceMax - priceMin) / rows
const xStep = (timeEnd - timeStart) / cols

const data = new Float64Array(rows * cols)
// ... fill with depth data from your orderbook collector ...

chart.setHeatmap(data, rows, cols, timeStart, xStep, priceMin, yStep)
```

## Real-time updates

### Append a new time column

As new orderbook snapshots arrive, append a single column:

```javascript
chart.appendHeatmapColumn(
  columnValues,    // Float64Array of length `rows`
  colTimestamp,    // timestamp for this snapshot (seconds)
  yStart,          // price of the first row
  yStep,           // price interval between rows
)
```

### Update the latest column

If the latest snapshot changes (same time window):

```javascript
chart.updateLastHeatmapColumn(
  columnValues,    // Float64Array of length `rows`
  yStart,          // price of the first row
  yStep,           // price interval between rows
)
```

## Collecting orderbook data

The heatmap requires a continuous stream of orderbook snapshots over time. A typical collector:

1. Subscribes to the exchange's orderbook WebSocket (e.g., Binance `depth@500ms`)
2. On each snapshot, builds a price-level array of bid+ask volumes
3. Appends it as a new heatmap column

```javascript
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth@500ms')

ws.onmessage = (event) => {
  const { b: bids, a: asks } = JSON.parse(event.data)

  const column = new Float64Array(rows)
  for (const [priceStr, qtyStr] of [...bids, ...asks]) {
    const price = +priceStr
    const qty = +qtyStr
    const rowIdx = Math.floor((price - priceMin) / yStep)
    if (rowIdx >= 0 && rowIdx < rows) {
      column[rowIdx] += qty
    }
  }

  chart.appendHeatmapColumn(column, Math.floor(Date.now() / 1000), priceMin, yStep)
}
```

## Clearing the heatmap

To remove the heatmap overlay:

```javascript
chart.setHeatmap(new Float64Array(0), 0, 0, 0, 1, 0, 1)
```

## Performance notes

- The engine handles heatmap matrices up to **500 x 500** at 60 fps
- Color mapping runs entirely in the native engine — no JavaScript overhead
- Memory usage is proportional to `rows * cols * 8` bytes (Float64)

---

## Next steps

- [Footprint Chart](footprint-chart.md) — Bid/ask volume at every price level
- [Real-Time Data](real-time-data.md) — WebSocket setup
- [Indicators](indicators.md) — Layer indicators on top of the heatmap
- [API Reference](../api/README.md) — Full `setHeatmap` documentation
