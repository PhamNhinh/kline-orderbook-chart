# API Reference

Complete reference for all public methods on a `MrdChart` instance.

- [Initialization](#initialization)
- [Lifecycle](#lifecycle)
- [Kline Data](#kline-data)
- [Chart Type & Footprint](#chart-type--footprint)
- [Orderbook Heatmap](#orderbook-heatmap)
- [Indicators](#indicators)
- [Drawing Tools](#drawing-tools)
- [Markers](#markers)
- [Theme](#theme)
- [Events & Callbacks](#events--callbacks)
- [Coordinate Conversion](#coordinate-conversion)
- [Custom Indicators](#custom-indicators)
- [License](#license)

---

## Initialization

### `createChartBridge(canvas, options)` → `Promise<MrdChart>`

Creates and initializes a new chart instance. Loads the engine module (cached after first call).

```javascript
import { createChartBridge } from '@mrd/chart-engine'

const chart = await createChartBridge(canvas, {
  licenseKey: 'MRD-PRO-XXXXXXXX-20270101-XXXXXX',
  theme: 'dark',
  precision: 2,
})
```

**Options**

| Option | Type | Default | Description |
|---|---|---|---|
| `licenseKey` | `string` | — | Your MRD license key **(required)** |
| `theme` | `'dark' \| 'light'` | `'dark'` | Initial color theme |
| `precision` | `number` | `2` | Price decimal places |
| `appId` | `string` | — | Mobile app bundle identifier (mobile licenses) |

### `prefetchWasm()`

Starts loading the engine module in the background without blocking. Call during application boot to reduce the perceived load time when the chart is first created.

```javascript
import { prefetchWasm } from '@mrd/chart-engine'

// In your app entry point, before the chart page is shown
prefetchWasm()
```

---

## Lifecycle

| Method | Returns | Description |
|---|---|---|
| `chart.start()` | `void` | Start the render loop |
| `chart.stop()` | `void` | Stop the render loop (does not free resources) |
| `chart.pause()` | `void` | Suspend rendering (e.g. tab hidden) |
| `chart.resume()` | `void` | Resume a paused chart |
| `chart.isPaused` | `boolean` | Whether the chart is currently paused |
| `chart.resize()` | `void` | Recalculate canvas dimensions from parent container |
| `chart.destroy()` | `void` | Free all engine memory and remove event listeners |

> Always call `chart.destroy()` when unmounting. In React use `useEffect` cleanup, in Vue use `onUnmounted`.

---

## Kline Data

### Loading data

| Method | Description |
|---|---|
| `setKlines(ts, o, h, l, c, v)` | Replace the entire dataset. All arguments are `Float64Array` or plain `number[]`. |
| `prependKlines(ts, o, h, l, c, v)` | Prepend historical candles to the left (infinite scroll). |
| `appendKline(ts, o, h, l, c, v)` | Append a single new candle (closed bar). |
| `updateLastKline(ts, o, h, l, c, v)` | Update the current (last) candle in place (real-time tick). |
| `popLastKline()` | Remove the last candle. Returns `true` if successful. |

```javascript
// Bulk load (historical data)
chart.setKlines(timestamps, opens, highs, lows, closes, volumes)

// Real-time tick update
chart.updateLastKline(ts, open, high, low, close, volume)

// New closed candle
chart.appendKline(ts, open, high, low, close, volume)
```

### Reading data

| Method | Returns | Description |
|---|---|---|
| `getKlineCount()` | `number` | Number of loaded candles |
| `getKlineTimestamps()` | `Float64Array \| null` | All timestamps |
| `getKlineOpens()` | `Float64Array \| null` | All open prices |
| `getKlineHighs()` | `Float64Array \| null` | All high prices |
| `getKlineLows()` | `Float64Array \| null` | All low prices |
| `getKlineCloses()` | `Float64Array \| null` | All close prices |
| `getKlineVolumes()` | `Float64Array \| null` | All volumes |
| `getLastClose()` | `number` | Last close price |

### Real timestamps

For charts that display a "display interval" (e.g. 4h candle) but the underlying data aggregates real tick timestamps:

```javascript
chart.setRealTimestamps(realTs)       // Float64Array of actual candle open times
chart.appendRealTimestamp(realTs)     // append one real timestamp
```

### Chart interval

```javascript
// Set the candle interval in seconds (used for time-axis labels)
chart.setCandleInterval(3600)   // e.g. 3600 = 1h
```

---

## Chart Type & Footprint

| Method | Returns | Description |
|---|---|---|
| `setChartType(type)` | `void` | `0` = Candlestick, `1` = Heatmap, `2` = Footprint |
| `getChartType()` | `number` | Current chart type |

### Footprint methods

See the [Indicators Guide → Footprint](../guides/indicators.md#footprint-chart) for full documentation.

| Method | Description |
|---|---|
| `setFootprintTickSize(tick)` | Price granularity per row |
| `footprintEnsureLen(n)` | Reserve buffer for `n` bars |
| `footprintSetBar(barIdx, tickSize, prices, bidVols, askVols)` | Set pre-aggregated bar |
| `footprintAddTrade(barIdx, price, vol, isBuyerMaker)` | Add one trade |
| `footprintAddTradeBatch(flat)` | Add many trades from flat `Float64Array` |
| `footprintClear()` | Clear all footprint data |
| `footprintClearBar(barIdx)` | Clear one bar |
| `footprintPrependEmpty(count)` | Prepend empty bars |
| `footprintSetDisplayMode(mode)` | `0` = Bid/Ask, `1` = Delta, `2` = Volume |
| `footprintGetDisplayMode()` | → `number` |
| `footprintSetShowSignals(bool)` | Imbalance / absorption signals |
| `footprintGetShowSignals()` | → `boolean` |
| `footprintSetShowProfile(bool)` | Composite volume profile |
| `footprintGetShowProfile()` | → `boolean` |
| `footprintProfileHitTest(sx, sy)` | → JSON string or `''` |
| `footprintSignalCount()` | → `number` |
| `enableDeltaHistogram()` | Show delta histogram sub-pane |
| `disableDeltaHistogram()` | Hide delta histogram sub-pane |
| `deltaHistogramEnabled()` | → `boolean` |

---

## Orderbook Heatmap

See the [Indicators Guide → Orderbook Heatmap](../guides/indicators.md#orderbook-heatmap) for full documentation.

| Method | Description |
|---|---|
| `setHeatmap(matrix, rows, cols, xStart, xStep, yStart, yStep)` | Load full matrix |
| `appendHeatmapColumn(values, colTs, yStart, yStep)` | Append new column |
| `updateLastHeatmapColumn(values, yStart, yStep)` | Update current column |
| `updateHeatmapColumnAt(values, ts, yStart, yStep)` | Update column by timestamp |
| `setHeatmapRange(min, max)` | Pin intensity scale |
| `getHeatmapDataRange()` | → `{ min, max }` |
| `getHeatmapLastTimestamp()` | → `number` |
| `getHeatmapXStep()` | → `number` |
| `setHeatmapPrefetchRange(max)` | Reserve columns |
| `clearHeatmapPrefetchRange()` | Clear reservation |
| `getHeatmapPrefetchMax()` | → `number` |

---

## Indicators

For per-indicator method documentation, see the **[Indicators Guide](../guides/indicators.md)**.

### Quick reference

| Indicator | Enable | Disable | Plan |
|---|---|---|---|
| Volume | `enableVolume()` | `disableVolume()` | Standard |
| RSI | `enableRsi()` | `disableRsi()` | Standard |
| Open Interest | `enableOi()` | `disableOi()` | Professional |
| CVD | `enableCvd()` | `disableCvd()` | Professional |
| Funding Rate | `enableFundingRate()` | `disableFundingRate()` | Professional |
| Large Trades | `enableLargeTrades()` | `disableLargeTrades()` | Professional |
| Liq Heatmap | `enableLiqHeatmap()` | `disableLiqHeatmap()` | Professional |
| VRVP | `enableVrvp()` | `disableVrvp()` | Enterprise |
| TPO | `enableTpo()` | `disableTpo()` | Enterprise |
| Smart Ranges | `enableSmartRanges()` | `disableSmartRanges()` | Enterprise |
| EMA Structure | `enableEmaStructure()` | `disableEmaStructure()` | Enterprise |
| VPIN | `enableVpin()` | `disableVpin()` | Enterprise |
| Stops & Icebergs | `enableStopIceberg()` | `disableStopIceberg()` | Enterprise |
| Forex Signals | `enableForexSignals()` | `disableForexSignals()` | Enterprise |
| Live Signals | `enableLiveSignals()` | `disableLiveSignals()` | — |

---

## Drawing Tools

For per-tool documentation, see the **[Drawings Guide](../guides/drawings.md)**.

### Drawing mode

| Method | Description |
|---|---|
| `startDrawing(tool, style?)` | Enter interactive drawing mode |
| `cancelDrawing()` | Cancel active drawing mode |

**Tool IDs:** `'trendline'`, `'hline'`, `'arrow'`, `'priceLabel'`, `'fibonacci'`, `'fibExtension'`, `'longPosition'`, `'shortPosition'`, `'anchoredVwap'`, `'elliott'`

### Programmatic creation

| Method | Returns | Plan |
|---|---|---|
| `addTrendline(x1,y1,x2,y2, r,g,b, lw, dash, pane)` | `number` id | Standard |
| `addHorizontalLine(x, price, r,g,b, lw, dash, pane)` | `number` id | Standard |
| `addArrow(x1,y1,x2,y2, r,g,b, lw, dash, pane)` | `number` id | Standard |
| `addPriceLabel(x, y, r,g,b, fontSize, pane)` | `number` id | Standard |
| `addFibRetracement(x1,y1,x2,y2, r,g,b, lw, dash, pane)` | `number` id | Professional |
| `addFibExtension(x1,y1,x2,y2,x3,y3, r,g,b, lw, dash, pane)` | `number` id | Professional |
| `addLongPosition(x1,y1,x2,y2, r,g,b, lw, dash, pane)` | `number` id | Professional |
| `addShortPosition(x1,y1,x2,y2, r,g,b, lw, dash, pane)` | `number` id | Professional |
| `addAnchoredVwap(anchorX, r,g,b, lw, dash, pane)` | `number` id | Professional |
| `addElliottImpulse(x, y, r,g,b, fontSize, pane)` | `number` id | Professional |

### Style & properties

| Method | Description |
|---|---|
| `setDrawingStyle(id, r, g, b, lineWidth)` | Update color and width |
| `setDrawingDashed(id, bool)` | Toggle dashed style |
| `setDrawingText(id, text)` | Set label text |
| `setDrawingFontSize(id, size)` | Set label font size |
| `setDrawingHideLabel(id, bool)` | Hide/show label |
| `getDrawingColor(id)` | → `{ r, g, b, lineWidth }` |
| `getDrawingDashed(id)` | → `boolean` |
| `getDrawingText(id)` | → `string` |
| `getDrawingFontSize(id)` | → `number` |
| `getDrawingHideLabel(id)` | → `boolean` |
| `getDrawingKindId(id)` | → `number` |

### Management

| Method | Description |
|---|---|
| `removeDrawing(id)` | Remove one drawing |
| `clearDrawings()` | Remove all drawings |
| `drawingCount()` | → `number` |
| `selectDrawing(id)` | Select a drawing |
| `deselectDrawing()` | Clear selection |
| `getSelectedDrawing()` | → `number` (id or 0) |
| `deleteSelectedDrawing()` | Remove selected, returns id |
| `exportDrawingsJson()` | → JSON `string` |
| `importDrawingsJson(json)` | Restore drawings from JSON |

### Preview

| Method | Description |
|---|---|
| `setDrawingPreview(kind, x1,y1,x2,y2, r,g,b, lw, dash, pane)` | Show ghost preview |
| `clearDrawingPreview()` | Remove preview |
| `cancelBrush()` | Cancel brush/path mid-stroke |

---

## Markers

| Method | Returns | Description |
|---|---|---|
| `addMarker(ts, price, isBid)` | `void` | Add a buy/sell marker |
| `removeMarker(id)` | `void` | Remove a marker |
| `clearMarkers()` | `void` | Remove all markers |
| `hitTestMarker(sx, sy)` | `number` | Marker id at screen pos, or 0 |
| `selectMarker(id)` | `void` | Select a marker |
| `deselectMarker()` | `void` | Clear marker selection |
| `getSelectedMarker()` | `number` | Selected marker id, or 0 |
| `deleteSelectedMarker()` | `number` | Remove selected, returns id |

---

## Theme

| Method | Returns | Description |
|---|---|---|
| `setTheme(theme)` | `void` | `'dark'`, `'light'`, or theme config object |
| `getTheme()` | `'dark' \| 'light'` | Current theme name |
| `setPrecision(decimals)` | `void` | Update price decimal places |

---

## Events & Callbacks

### Crosshair / Tooltip

```javascript
// Called whenever the crosshair moves to a new bar
// json: serialized tooltip data string, or null when crosshair leaves chart
chart.onTooltip((json, screenX, screenY) => {
  if (json) {
    const data = JSON.parse(json)
    // data contains: time, open, high, low, close, volume, indicators...
    showTooltipUI(data, screenX, screenY)
  } else {
    hideTooltipUI()
  }
})
```

### Drawing events

```javascript
chart.onDrawingComplete(callback)      // () => void
chart.onDrawingCancel(callback)        // () => void
chart.onDrawingSelected(callback)      // (id, cx, cy) => void
chart.onDrawingDblClick(callback)      // (id, sx, sy, cx, cy) => void
chart.onMarkerSelected(callback)       // (id) => void
```

### Hover events

```javascript
// Called when the cursor hovers over a large trade bubble
chart.onLtHover((json) => {
  // json: trade info string or ''
})

// Called when the cursor hovers over a VRVP bar
chart.onVrvpHover((screenX, screenY) => {})

// Called when user long-presses a liquidation annotation (mobile)
chart.onLiqAnnotationPin((screenX, screenY) => {})
```

### Post-render

```javascript
// Called after every rendered frame — useful for custom Canvas2D overlays
chart.onPostRender(() => {
  const ctx2d = canvas.getContext('2d')
  // draw custom UI over the chart
})
```

---

## Coordinate Conversion

```javascript
// Screen pixel → world (time/price)
const { x, y } = chart.screenToWorld(screenX, screenY)
// x = unix timestamp (seconds), y = price

// World → screen pixel
const screen = chart.worldToScreen(timestamp, price)
// → { x, y } | null if out of visible range
```

### Price interaction

```javascript
// Show a horizontal hover price line at `price`
chart.setHoverPrice(price)
chart.clearHoverPrice()

// Returns hit zone at screen position
// 0 = main, 1 = sub-pane, 2 = x-axis, 3 = y-axis
chart.hitZone(x, y)
```

---

## Replay Mode

```javascript
// active: bool — whether replay is active
// current: current replay bar index
// total: total bars in replay range
chart.setReplayState(active, current, total)

chart.setReplayHovered(true)          // highlight replay cursor
chart.setReplayPreview(screenX)       // show preview line at screenX
```

---

## Custom Indicators

*Requires: Enterprise plan*

See the **[Custom Indicators Guide](../guides/custom-indicators.md)** for a full walkthrough.

| Method | Returns | Description |
|---|---|---|
| `addIndicator(config)` | `number \| null` | Register a custom indicator, returns id |
| `removeIndicator(id)` | `void` | Unregister a custom indicator |
| `updateIndicatorParams(id, params)` | `void` | Update params and trigger recompute |
| `setIndicatorEnabled(id, enabled)` | `void` | Toggle visibility |
| `listIndicators()` | `Array` | List all registered custom indicators |
| `invalidateCustomIndicators()` | `void` | Force recompute all custom indicators |

### Config object

```typescript
interface CustomIndicatorConfig {
  name?: string
  params: Record<string, any>
  compute?(ohlcv: OhlcvArrays, params: Record<string, any>): Record<string, number[]>
  render(draw: DrawAPI, computed: Record<string, number[]>, ohlcv: OhlcvArrays): void
}
```

---

## License

```javascript
// Read license info
const { plan, valid, expired, watermark, daysLeft, features } = chart.license

// Hot-swap the license key at runtime (returns Promise<boolean>)
const ok = await chart.setLicenseKey(newEd25519TokenFromBE)
```

**Plan values:** `'free'`, `'trial'`, `'standard'`, `'professional'`, `'enterprise'`

---

## TypeScript Types

```typescript
interface OhlcvArrays {
  timestamps: number[]
  open: number[]
  high: number[]
  low: number[]
  close: number[]
  volume: number[]
  length: number
}

interface DrawStyle {
  r: number         // 0–255
  g: number         // 0–255
  b: number         // 0–255
  lineWidth: number
  dashed: boolean
  pane?: number
}

interface DrawingColor {
  r: number
  g: number
  b: number
  lineWidth: number
}

interface HeatmapDataRange {
  min: number
  max: number
}
```
