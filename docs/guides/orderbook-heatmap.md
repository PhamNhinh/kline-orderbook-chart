# Orderbook Heatmap

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/orderbook-heatmap](https://mrd-indicators.com/docs/orderbook-heatmap)** — this Markdown mirror is kept for offline / GitHub browsing.


The orderbook heatmap renders a **price-level × time-column** depth matrix directly behind the candlesticks on the same canvas. It visualizes order book depth over time, revealing support/resistance zones, spoofing patterns, and liquidity walls.

**Plan requirement:** Professional or Enterprise.

---

## How It Works

The heatmap is a 2D matrix where:
- **Rows** = price levels (Y-axis, from `yStart` upward by `yStep`)
- **Columns** = time buckets (X-axis, from `xStart` by `xStep` seconds)
- **Cell values** = aggregated orderbook depth at that price/time intersection

Your application aggregates L2 orderbook snapshots into this matrix. The engine renders it using optimized color mapping inside the native engine.

```
                       Time →
              ┌───┬───┬───┬───┬───┬───┐
  Price ↑     │ 0 │ 5 │12 │ 3 │ 0 │ 8 │  ← row (price level)
              ├───┼───┼───┼───┼───┼───┤
              │ 2 │18 │ 9 │ 0 │ 4 │11 │
              ├───┼───┼───┼───┼───┼───┤
              │ 7 │ 3 │ 0 │15 │22 │ 6 │
              └───┴───┴───┴───┴───┴───┘
                          ↑
                 Each cell = depth quantity
                 Color intensity = magnitude
```

---

## Initial Setup

### `setHeatmap(matrix, rows, cols, xStart, xStep, yStart, yStep)`

Loads the full heatmap matrix into the engine.

| Parameter | Type | Description |
|---|---|---|
| `matrix` | `Float64Array` | Flat array of length `rows × cols`, row-major order |
| `rows` | `number` | Number of price levels |
| `cols` | `number` | Number of time columns |
| `xStart` | `number` | Unix timestamp (seconds) of the first column |
| `xStep` | `number` | Seconds per column (should match candle interval) |
| `yStart` | `number` | Lowest price level |
| `yStep` | `number` | Price increment per row |

```javascript
const ROWS = 200    // 200 price levels
const COLS = 500    // 500 time columns

const matrix = new Float64Array(ROWS * COLS)
// ... fill matrix from your orderbook depth aggregation ...

const yStart = 63000        // lowest price level ($63,000)
const yStep  = 10           // $10 per row
const xStart = 1710000000   // first column timestamp (Unix seconds)
const xStep  = 3600         // 1 hour per column (match candle interval)

chart.setHeatmap(matrix, ROWS, COLS, xStart, xStep, yStart, yStep)
```

### Matrix Layout (Row-Major)

The matrix is stored as a flat `Float64Array` in row-major order:

```
Index:  [0]  [1]  [2]  ...  [COLS-1]  [COLS]  [COLS+1]  ...
        ↑ row 0 (yStart)              ↑ row 1 (yStart + yStep)
        col 0   col 1   col 2         col 0    col 1

matrix[row * COLS + col] = depth at price (yStart + row * yStep) at time (xStart + col * xStep)
```

---

## Real-time Streaming

### `appendHeatmapColumn(values, colTimestamp, yStart, yStep)`

Appends a new column to the right side of the matrix.

| Parameter | Type | Description |
|---|---|---|
| `values` | `Float64Array` | Depth values, length = ROWS |
| `colTimestamp` | `number` | Unix timestamp (seconds) for this column |
| `yStart` | `number` | Lowest price level (must match initial setup) |
| `yStep` | `number` | Price increment per row (must match initial setup) |

```javascript
function onNewDepthSnapshot(timestamp, depthAtLevels) {
  const colData = new Float64Array(ROWS)
  for (let i = 0; i < ROWS; i++) {
    const price = yStart + i * yStep
    colData[i] = depthAtLevels.get(price) || 0
  }
  chart.appendHeatmapColumn(colData, timestamp, yStart, yStep)
}
```

### `updateLastHeatmapColumn(values, yStart, yStep)`

Updates the most recent (rightmost) column. Use this when the orderbook changes within the same time bucket.

```javascript
function onDepthUpdate(depthAtLevels) {
  const colData = new Float64Array(ROWS)
  for (let i = 0; i < ROWS; i++) {
    const price = yStart + i * yStep
    colData[i] = depthAtLevels.get(price) || 0
  }
  chart.updateLastHeatmapColumn(colData, yStart, yStep)
}
```

### `updateHeatmapColumnAt(values, timestamp, yStart, yStep)`

Updates a specific column by its timestamp. Use this for backfill corrections.

```javascript
chart.updateHeatmapColumnAt(correctedData, targetTimestamp, yStart, yStep)
```

---

## Streaming Pattern (Complete Example)

```javascript
// Initial load
chart.setHeatmap(historicalMatrix, ROWS, COLS, xStart, xStep, yStart, yStep)

// L2 orderbook WebSocket
const obWs = new WebSocket('wss://your-server.com/ws/orderbook/BTCUSDT')
let currentBucket = null

obWs.onmessage = (event) => {
  const { timestamp, bids, asks } = JSON.parse(event.data)
  const bucketTs = Math.floor(timestamp / xStep) * xStep

  // Build column from orderbook snapshot
  const colData = new Float64Array(ROWS)
  for (const [price, qty] of [...bids, ...asks]) {
    const row = Math.floor((price - yStart) / yStep)
    if (row >= 0 && row < ROWS) {
      colData[row] += qty
    }
  }

  if (bucketTs !== currentBucket) {
    // New time bucket — append new column
    chart.appendHeatmapColumn(colData, bucketTs, yStart, yStep)
    currentBucket = bucketTs
  } else {
    // Same bucket — update current column
    chart.updateLastHeatmapColumn(colData, yStart, yStep)
  }
}
```

---

## Range & Prefetch Configuration

### `setHeatmapRange(min, max)`

Overrides the automatic color mapping range. Values below `min` map to transparent; values above `max` map to full intensity.

```javascript
chart.setHeatmapRange(0, 500)  // clamp color mapping to 0–500 units
```

### `getHeatmapDataRange()` → `{ min, max }`

Returns the actual min/max values in the current heatmap data.

```javascript
const { min, max } = chart.getHeatmapDataRange()
console.log(`Depth range: ${min} – ${max}`)
```

### `setHeatmapPrefetchRange(max)` / `clearHeatmapPrefetchRange()` / `getHeatmapPrefetchMax()`

Controls the prefetch range for lazy-loading heatmap data when the user scrolls.

```javascript
chart.setHeatmapPrefetchRange(2000)   // request up to 2000 columns ahead
const max = chart.getHeatmapPrefetchMax()
chart.clearHeatmapPrefetchRange()
```

---

## Query Methods

### `getHeatmapLastTimestamp()` → `number`

Returns the timestamp of the last (rightmost) heatmap column.

### `getHeatmapXStep()` → `number`

Returns the current column time interval in seconds.

```javascript
const lastTs = chart.getHeatmapLastTimestamp()
const step   = chart.getHeatmapXStep()
```

---

## Enabling Heatmap Display

After loading data, enable the heatmap chart type:

```javascript
chart.setChartType(1)   // 1 = heatmap mode (renders behind candles)
```

To switch back to candlestick-only:

```javascript
chart.setChartType(0)   // 0 = candlestick mode
```

---

## Constraints & Best Practices

| Rule | Detail |
|---|---|
| `yStart`, `yStep`, `ROWS` must stay constant | Changing these mid-session invalidates the matrix. Call `setHeatmap` to reload. |
| `xStep` should match candle interval | Misalignment causes visual drift between candles and heatmap columns |
| Matrix must be row-major | `matrix[row * COLS + col]` — not column-major |
| Values must be non-negative | Negative depth values produce undefined rendering |
| Column data length must equal ROWS | Short arrays will cause out-of-bounds reads |

### When to Reload

If the price moves significantly outside the `[yStart, yStart + ROWS * yStep]` range:

```javascript
// Detect when price is outside heatmap range
const lastClose = chart.getLastClose()
const heatmapTop = yStart + ROWS * yStep

if (lastClose < yStart || lastClose > heatmapTop) {
  // Re-center the matrix around current price
  const newYStart = lastClose - (ROWS / 2) * yStep
  // ... rebuild matrix with new yStart ...
  chart.setHeatmap(newMatrix, ROWS, COLS, xStart, xStep, newYStart, yStep)
}
```

---

## Memory Usage

| Configuration | Matrix Size | Memory |
|---|---|---|
| 200 rows × 500 cols | 100,000 cells | ~800 KB |
| 200 rows × 1,000 cols | 200,000 cells | ~1.6 MB |
| 500 rows × 2,000 cols | 1,000,000 cells | ~8 MB |

The engine internally manages rendering LOD (Level of Detail) to cap the number of heatmap rectangles drawn per frame at 250,000.

---

## Next Steps

| Topic | Link |
|---|---|
| Enable footprint chart | [Footprint Chart](./footprint-chart.md) |
| Configure indicators | [Built-in Indicators](./indicators.md) |
| Handle events & tooltips | [Events & Tooltips](./tooltip.md) |
