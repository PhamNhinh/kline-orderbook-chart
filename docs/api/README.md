# API Reference

## MrdChart

### `MrdChart.create(canvas, options)` → `Promise<MrdChart>`

Creates and initializes a new chart instance.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `canvas` | `HTMLCanvasElement` | Yes | The canvas element to render on |
| `options.licenseKey` | `string` | Yes | Your MRD license key |
| `options.theme` | `string \| ThemeConfig` | No | `'dark'` (default), `'light'`, or custom theme object |
| `options.precision` | `number` | No | Price decimal places (default: 2) |
| `options.locale` | `string` | No | Locale for number formatting (default: `'en'`) |
| `options.timezone` | `string` | No | IANA timezone string |

---

### Lifecycle

| Method | Description |
|---|---|
| `chart.start()` | Start the render loop |
| `chart.stop()` | Stop the render loop |
| `chart.pause()` | Pause rendering (e.g., when tab is hidden) |
| `chart.resume()` | Resume rendering |
| `chart.resize(width?, height?)` | Recalculate dimensions. Auto-detects from parent if no args. |
| `chart.destroy()` | Free all resources. Must be called on unmount. |

---

### Data

| Method | Description |
|---|---|
| `chart.setKlines(data)` | Set full OHLCV dataset |
| `chart.appendKline(kline)` | Append a new candle |
| `chart.updateLastKline(kline)` | Update the last candle (real-time) |
| `chart.prependKlines(data)` | Prepend historical candles (infinite scroll) |
| `chart.setHeatmap(config)` | Set orderbook depth matrix |
| `chart.updateHeatmapColumn(col, data)` | Update a single heatmap column |

---

### Indicators

| Method | Description |
|---|---|
| `chart.indicators.enable(id, params?)` | Enable an indicator |
| `chart.indicators.disable(id)` | Disable an indicator |
| `chart.indicators.update(id, params)` | Update indicator parameters |
| `chart.indicators.setData(id, data)` | Feed external data to a data-driven indicator |
| `chart.indicators.list()` | Get list of enabled indicators |

---

### Drawings

| Method | Description |
|---|---|
| `chart.drawings.setTool(toolId, style?)` | Set active drawing tool (null to cancel) |
| `chart.drawings.cancel()` | Cancel current drawing |
| `chart.drawings.remove(id)` | Remove a specific drawing |
| `chart.drawings.removeAll()` | Remove all drawings |
| `chart.drawings.setProperties(id, props)` | Update drawing style/properties |
| `chart.drawings.exportJSON()` | Export all drawings as JSON string |
| `chart.drawings.importJSON(json)` | Import drawings from JSON string |
| `chart.drawings.onComplete(cb)` | Callback when a drawing is completed |
| `chart.drawings.onSelected(cb)` | Callback when a drawing is selected |
| `chart.drawings.onDoubleClick(cb)` | Callback when a drawing is double-clicked |

---

### Viewport

| Method | Description |
|---|---|
| `chart.viewport.fitContent()` | Fit all data in view |
| `chart.viewport.showLatest()` | Scroll to the latest candle |
| `chart.viewport.setVisibleRange(start, end)` | Set visible time range (unix timestamps) |
| `chart.viewport.zoom(factor)` | Zoom in (`> 1`) or out (`< 1`) |

---

### Theme

| Method | Description |
|---|---|
| `chart.setTheme(theme)` | Set theme: `'dark'`, `'light'`, or `ThemeConfig` object |
| `chart.getTheme()` | Get current theme name |

---

### Events

```javascript
chart.on(event, callback)
chart.off(event, callback)
```

| Event | Callback Signature | Description |
|---|---|---|
| `'tooltip'` | `(data: TooltipData) => void` | Crosshair tooltip data |
| `'click'` | `(point: { price, time, x, y }) => void` | Chart click |
| `'drawingComplete'` | `(drawing: Drawing) => void` | Drawing tool completed |
| `'drawingSelected'` | `(id: string, x: number, y: number) => void` | Drawing selected |
| `'visibleRangeChange'` | `(range: { start, end }) => void` | Visible time range changed |
| `'ready'` | `() => void` | Chart fully initialized |

---

### Custom Indicators (Plugin)

```javascript
chart.plugins.register(id, config)
chart.plugins.unregister(id)
```

| Config Field | Type | Description |
|---|---|---|
| `pane` | `'main' \| 'sub'` | Render on main chart or sub-pane |
| `params` | `Record<string, ParamDef>` | Parameter definitions |
| `compute(klines, params)` | `Function` | Computation function returning series data |

---

### Types

```typescript
interface OHLCV {
  t: number    // Unix timestamp (seconds)
  o: number    // Open
  h: number    // High
  l: number    // Low
  c: number    // Close
  v: number    // Volume
}

interface ThemeConfig {
  background: string
  text: string
  textSecondary: string
  bullCandle: string
  bearCandle: string
  grid: string
  crosshair: string
  // ... see Theming guide for full spec
}

interface HeatmapConfig {
  data: Float32Array
  rows: number
  cols: number
  priceMin: number
  priceMax: number
  timeStart: number
  timeEnd: number
}
```
