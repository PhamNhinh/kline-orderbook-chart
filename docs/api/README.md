# API Reference

Complete method reference for the `kline-orderbook-chart` library.

---

## Module Exports

```javascript
import {
  createChartBridge,
  prefetchWasm,
  validateLicense,
  generateLicenseKey,
} from 'kline-orderbook-chart'
```

---

## Initialization

### `createChartBridge(canvas, options?)`

Creates a chart instance bound to the given canvas element. Returns a `Promise<ChartBridge>`.

```javascript
const chart = await createChartBridge(canvas, {
  licenseKey: 'YOUR_LICENSE_KEY',
})
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `canvas` | `HTMLCanvasElement` | Yes | The canvas element to render into |
| `options.licenseKey` | `string` | No | License key. Omit for 14-day trial. |

### `prefetchWasm()`

Pre-downloads and compiles the engine binary. Call early in your app lifecycle for faster chart initialization.

```javascript
prefetchWasm()
```

---

## Lifecycle

| Method | Description |
|---|---|
| `chart.start()` | Start the render loop |
| `chart.stop()` | Stop the render loop |
| `chart.pause()` | Pause rendering (e.g., when tab is hidden) |
| `chart.resume()` | Resume rendering after pause |
| `chart.resize()` | Recalculate dimensions from the canvas parent |
| `chart.destroy()` | Stop rendering, remove listeners, free engine memory |
| `chart.isPaused` | `boolean` — whether rendering is currently paused |

---

## Settings

| Method | Parameters | Description |
|---|---|---|
| `setPrecision(decimals)` | `number` | Set price decimal places (e.g., `1` for BTC, `4` for forex) |
| `setCandleInterval(seconds)` | `number` | Set candle interval in seconds (e.g., `300` for 5m) |

---

## Theme

| Method | Parameters | Description |
|---|---|---|
| `setTheme(name)` | `'dark'` or `'light'` | Switch the visual theme |
| `getTheme()` | — | Returns current theme: `'dark'` or `'light'` |

---

## Candle Data

### `setKlines(timestamps, opens, highs, lows, closes, volumes)`

Replace all candle data. Each parameter is an array or `Float64Array` of equal length.

```javascript
chart.setKlines(
  [1710000000, 1710003600],   // timestamps (seconds)
  [65200, 65600],             // opens
  [65800, 66100],             // highs
  [65100, 65400],             // lows
  [65600, 65900],             // closes
  [1234.5, 987.2],            // volumes
)
```

### `appendKline(timestamp, open, high, low, close, volume)`

Append a new candle at the end.

### `updateLastKline(timestamp, open, high, low, close, volume)`

Update the most recent candle (real-time tick updates).

### `prependKlines(timestamps, opens, highs, lows, closes, volumes)`

Prepend historical candles (for infinite scroll to the left).

---

## Orderbook Heatmap

### `setHeatmap(data, rows, cols, xStart, xStep, yStart, yStep)`

Set the full heatmap matrix.

| Parameter | Type | Description |
|---|---|---|
| `data` | `Float64Array` | Flattened row-major matrix (length = `rows * cols`) |
| `rows` | `number` | Number of price levels |
| `cols` | `number` | Number of time columns |
| `xStart` | `number` | Timestamp of the first column (seconds) |
| `xStep` | `number` | Time interval between columns (seconds) |
| `yStart` | `number` | Price of the first row (lowest price) |
| `yStep` | `number` | Price interval between rows |

### `appendHeatmapColumn(values, colTimestamp, yStart, yStep)`

Append a single time column to the heatmap.

| Parameter | Type | Description |
|---|---|---|
| `values` | `Float64Array` | Column values (length = `rows`) |
| `colTimestamp` | `number` | Timestamp for this column (seconds) |
| `yStart` | `number` | Price of the first row |
| `yStep` | `number` | Price interval between rows |

### `updateLastHeatmapColumn(values, yStart, yStep)`

Update the most recent heatmap column.

---

## Footprint

### `setChartType(type)`

| Value | Mode |
|---|---|
| `0` | Candlestick (default) |
| `1` | Footprint |

### `setFootprintTickSize(tickSize)`

Set the price increment per footprint row.

### `footprintEnsureLen(count)`

Ensure the footprint buffer can hold `count` bars.

### `footprintSetBar(barIndex, tickSize, prices, bidVolumes, askVolumes)`

Set complete footprint data for one bar.

| Parameter | Type | Description |
|---|---|---|
| `barIndex` | `number` | Candle index (0-based) |
| `tickSize` | `number` | Price increment per row |
| `prices` | `Float64Array` | Price levels |
| `bidVolumes` | `Float64Array` | Bid volume at each level |
| `askVolumes` | `Float64Array` | Ask volume at each level |

### `footprintAddTrade(barIndex, price, volume, isBuyerMaker)`

Add a single trade to a footprint bar. Use for real-time tick data.

### `footprintClear()`

Clear all footprint data.

---

## Indicators

All indicators follow the `enable*()` / `disable*()` pattern.

### Volume

| Method | Description |
|---|---|
| `enableVolume()` | Show volume histogram |
| `disableVolume()` | Hide volume histogram |
| `isVolumeEnabled()` | Returns `boolean` |
| `setVolumeMaPeriod(period)` | Set MA overlay period |

### RSI

| Method | Description |
|---|---|
| `enableRsi()` | Show RSI sub-pane |
| `disableRsi()` | Hide RSI sub-pane |
| `setRsiPeriod(period)` | Set RSI period (default: 14) |
| `setRsiShowSignals(bool)` | Show overbought/oversold markers |
| `setRsiShowDivergence(bool)` | Show divergence lines |

### EMA Structure

| Method | Description |
|---|---|
| `enableEmaStructure()` | Show multi-EMA lines |
| `disableEmaStructure()` | Hide EMA lines |

### VRVP (Visible Range Volume Profile)

| Method | Description |
|---|---|
| `enableVrvp()` | Show volume profile panel |
| `disableVrvp()` | Hide volume profile panel |

### TPO / Market Profile

| Method | Description |
|---|---|
| `enableTpo()` | Show TPO chart |
| `disableTpo()` | Hide TPO chart |

### Smart Ranges (SMC)

| Method | Description |
|---|---|
| `enableSmartRanges()` | Show SMC zones |
| `disableSmartRanges()` | Hide SMC zones |

### Open Interest (data-driven)

| Method | Description |
|---|---|
| `enableOi()` | Show OI sub-pane |
| `disableOi()` | Hide OI sub-pane |
| `setOiDataTs(timestamps, values)` | Feed OI data (parallel arrays) |

### CVD (data-driven)

| Method | Description |
|---|---|
| `enableCvd()` | Show CVD sub-pane |
| `disableCvd()` | Hide CVD sub-pane |
| `setCvdData(timestamps, values)` | Feed CVD data |

### Funding Rate (data-driven)

| Method | Description |
|---|---|
| `enableFundingRate()` | Show funding rate overlay |
| `disableFundingRate()` | Hide funding rate overlay |
| `setFundingRateData(timestamps, rates)` | Feed funding data |

### Large Trades (data-driven)

| Method | Description |
|---|---|
| `enableLargeTrades()` | Show large trade bubbles |
| `disableLargeTrades()` | Hide large trade bubbles |
| `addLargeTrade(timestamp, price, volume, isBuy)` | Add a trade marker |
| `clearLargeTrades()` | Remove all trade markers |

### Liquidation Heatmap (data-driven)

| Method | Description |
|---|---|
| `enableLiqHeatmap()` | Show liquidation heatmap |
| `disableLiqHeatmap()` | Hide liquidation heatmap |
| `setLiqHeatmapData(matrix, rows, cols, xStart, xStep, yStart, yStep)` | Feed liquidation data |

### Live Signals

| Method | Description |
|---|---|
| `enableLiveSignals()` | Show live signal overlay |
| `disableLiveSignals()` | Hide live signal overlay |

---

## Drawing Tools

### Interactive mode

| Method | Parameters | Description |
|---|---|---|
| `startDrawing(tool, style?)` | See tool IDs below | Enter interactive drawing mode |
| `cancelDrawing()` | — | Cancel current drawing |

**Tool IDs:** `'trendline'`, `'hline'`, `'hray'`, `'arrow'`, `'fib'`, `'fibext'`, `'longpos'`, `'shortpos'`, `'avwap'`, `'pricelabel'`, `'elliott'`, `'brush'`

**Style object:**

```javascript
{
  r: 0.04,          // red (0–1)
  g: 0.49,          // green (0–1)
  b: 1.0,           // blue (0–1)
  lineWidth: 2,
  dashed: false,
  fontSize: 12,
}
```

### Programmatic drawing

All methods return a numeric drawing `id`. World coordinates: X = timestamp, Y = price.

| Method | Description |
|---|---|
| `addTrendline(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Two-point line |
| `addHorizontalLine(x, price, r, g, b, lineWidth, dashed, pane?)` | Horizontal level |
| `addArrow(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Arrow |
| `addFibRetracement(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Fibonacci levels |
| `addFibExtension(x1, y1, x2, y2, x3, y3, r, g, b, lineWidth, dashed, pane?)` | Fib extension |
| `addLongPosition(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Long zone |
| `addShortPosition(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Short zone |
| `addAnchoredVwap(anchorX, r, g, b, lineWidth, dashed, pane?)` | Anchored VWAP |
| `addPriceLabel(x, y, r, g, b, fontSize, pane?)` | Text label |
| `addElliottImpulse(x, y, r, g, b, fontSize, pane?)` | Elliott wave |

### Drawing properties

| Method | Description |
|---|---|
| `setDrawingStyle(id, r, g, b, lineWidth)` | Set color and width |
| `setDrawingDashed(id, bool)` | Toggle dashed line |
| `setDrawingHideLabel(id, bool)` | Toggle label visibility |
| `setDrawingFontSize(id, size)` | Set font size |
| `setDrawingText(id, text)` | Set label text |
| `getDrawingColor(id)` | Returns `{ r, g, b, lineWidth }` |
| `getDrawingDashed(id)` | Returns `boolean` |
| `getDrawingText(id)` | Returns `string` |
| `getDrawingFontSize(id)` | Returns `number` |
| `getDrawingKindId(id)` | Returns tool type number |

### Drawing management

| Method | Description |
|---|---|
| `selectDrawing(id)` | Select a drawing (shows handles) |
| `deselectDrawing()` | Deselect the current drawing |
| `getSelectedDrawing()` | Returns selected drawing `id` (or 0) |
| `removeDrawing(id)` | Remove a specific drawing |
| `deleteSelectedDrawing()` | Remove the currently selected drawing |
| `clearDrawings()` | Remove all drawings |
| `drawingCount()` | Returns total number of drawings |

### Drawing serialization

| Method | Description |
|---|---|
| `exportDrawingsJson()` | Export all drawings as JSON string |
| `importDrawingsJson(json)` | Import drawings from JSON string |

---

## Markers (Trade Executions)

| Method | Description |
|---|---|
| `addMarker(timestamp, price, isBid)` | Add a trade marker arrow |
| `clearMarkers()` | Remove all markers |
| `hitTestMarker(screenX, screenY)` | Test if screen point hits a marker |
| `selectMarker(id)` | Select a marker |
| `deselectMarker()` | Deselect marker |
| `getSelectedMarker()` | Returns selected marker `id` |
| `removeMarker(id)` | Remove a marker |
| `deleteSelectedMarker()` | Remove selected marker |

---

## Coordinate Conversion

| Method | Description |
|---|---|
| `screenToWorld(screenX, screenY)` | Returns `{ x: timestamp, y: price }` |
| `worldToScreen(worldX, worldY)` | Returns `{ x: px, y: px }` |

---

## Events

| Method | Callback Signature | Description |
|---|---|---|
| `onTooltip(cb)` | `(data) => void` | Crosshair tooltip data (OHLCV + indicators) |
| `onDrawingComplete(cb)` | `(id, kind, x1, y1, x2, y2) => void` | Drawing finished |
| `onDrawingSelected(cb)` | `(id, screenX, screenY) => void` | Drawing selected |
| `onDrawingDblClick(cb)` | `(id, sx, sy, cx, cy) => void` | Drawing double-clicked |
| `onVrvpHover(cb)` | `(data) => void` | VRVP level hover |
| `onLtHover(cb)` | `(data) => void` | Large trade hover |
| `onPostRender(cb)` | `() => void` | Called after each frame render |

---

## License

| Method/Property | Description |
|---|---|
| `chart.license` | Returns current license info object |
| `setLicenseKey(key)` | Set or update the license key |

### License info object

```javascript
{
  plan: 'pro',
  domain: 'yourapp.com',
  expiry: '2027-01-01',
  valid: true,
  expired: false,
  watermark: false,
}
```

---

## Utility Functions

### `validateLicense(key)`

Validate a license key without creating a chart. Returns the license info object.

### `generateLicenseKey(plan, domain, expiry)`

Generate a license key (for backend use only).
