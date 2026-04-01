# Drawing Tools

Kline Orderbook Chart includes 10+ professional drawing tools with full JSON serialization for persistence.

## Interactive drawing mode

The easiest way to let users draw is to use the interactive mode. Call `startDrawing(tool)` — the chart listens for mouse/touch events and creates the drawing as the user clicks:

```javascript
chart.startDrawing('trendline')
```

Cancel the active drawing mode:

```javascript
chart.cancelDrawing()
```

### Available tool IDs

| Tool | ID | Points | Description |
|---|---|---|---|
| **Trendline** | `'trendline'` | 2 | Line between two price/time points |
| **Horizontal Line** | `'hline'` | 1 | Horizontal price level (extends full width) |
| **Horizontal Ray** | `'hray'` | 1 | One-directional horizontal ray |
| **Arrow** | `'arrow'` | 2 | Directional arrow between two points |
| **Fibonacci Retracement** | `'fib'` | 2 | Fibonacci retracement levels |
| **Fibonacci Extension** | `'fibext'` | 3 | Fibonacci extension (3 anchor points) |
| **Long Position** | `'longpos'` | 2 | Long trade entry/exit zone |
| **Short Position** | `'shortpos'` | 2 | Short trade entry/exit zone |
| **Anchored VWAP** | `'avwap'` | 1 | VWAP anchored from a specific candle |
| **Price Label** | `'pricelabel'` | 1 | Text label at a price/time point |
| **Elliott Impulse** | `'elliott'` | 1 | Elliott wave count label |
| **Brush** | `'brush'` | Freehand | Freehand drawing |

### Custom style

Pass a style object as the second argument:

```javascript
chart.startDrawing('trendline', {
  r: 1.0,            // red (0–1)
  g: 0.6,            // green (0–1)
  b: 0.0,            // blue (0–1)
  lineWidth: 2,
  dashed: false,
  fontSize: 12,
})
```

## Programmatic drawing

Create drawings programmatically without user interaction. Coordinates use **world space** (timestamp for X, price for Y):

```javascript
const id = chart.addTrendline(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane)
```

### All programmatic methods

| Method | Parameters |
|---|---|
| `addTrendline(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Two-point line |
| `addHorizontalLine(x, price, r, g, b, lineWidth, dashed, pane?)` | Horizontal level |
| `addArrow(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Directional arrow |
| `addFibRetracement(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Fibonacci levels |
| `addFibExtension(x1, y1, x2, y2, x3, y3, r, g, b, lineWidth, dashed, pane?)` | Fib extension |
| `addLongPosition(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Long trade zone |
| `addShortPosition(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` | Short trade zone |
| `addAnchoredVwap(anchorX, r, g, b, lineWidth, dashed, pane?)` | Anchored VWAP |
| `addPriceLabel(x, y, r, g, b, fontSize, pane?)` | Text label |
| `addElliottImpulse(x, y, r, g, b, fontSize, pane?)` | Elliott wave |

All methods return a numeric `id` for the created drawing.

### Color format

Colors use floating-point 0–1 values:

```javascript
{ r: 0.04, g: 0.49, b: 1.0 }   // #0a7dff (blue)
{ r: 1.0,  g: 0.6,  b: 0.0 }   // #ff9900 (orange)
{ r: 0.0,  g: 0.83, b: 0.67 }   // #00d4aa (green)
```

## Modifying drawings

### Style

```javascript
chart.setDrawingStyle(id, r, g, b, lineWidth)
chart.setDrawingDashed(id, true)
chart.setDrawingHideLabel(id, false)
chart.setDrawingFontSize(id, 14)
chart.setDrawingText(id, 'Wave 3')
```

### Read properties

```javascript
const color = chart.getDrawingColor(id)    // { r, g, b, lineWidth }
const dashed = chart.getDrawingDashed(id)
const text = chart.getDrawingText(id)
const fontSize = chart.getDrawingFontSize(id)
const kind = chart.getDrawingKindId(id)
```

## Selection and deletion

```javascript
chart.selectDrawing(id)
chart.deselectDrawing()
const selectedId = chart.getSelectedDrawing()

chart.removeDrawing(id)
chart.deleteSelectedDrawing()
chart.clearDrawings()
```

## Events

Listen for drawing events:

```javascript
chart.onDrawingComplete((id, kind, x1, y1, x2, y2) => {
  console.log(`Drawing ${id} (type ${kind}) completed`)
})

chart.onDrawingSelected((id, screenX, screenY) => {
  // show context menu at (screenX, screenY)
})

chart.onDrawingDblClick((id, screenX, screenY, chartX, chartY) => {
  // open properties dialog
})
```

## Serialization (Export / Import)

All drawings can be serialized to JSON for storage:

```javascript
// Save
const json = chart.exportDrawingsJson()
localStorage.setItem(`drawings:${symbol}`, json)

// Restore
const saved = localStorage.getItem(`drawings:${symbol}`)
if (saved) {
  chart.importDrawingsJson(saved)
}
```

## Markers (trade executions)

Plot trade execution markers (arrows) on the chart:

```javascript
chart.addMarker(timestamp, price, isBid)   // isBid = true for buy
chart.clearMarkers()

const hitId = chart.hitTestMarker(screenX, screenY)
chart.selectMarker(hitId)
chart.deselectMarker()
chart.removeMarker(hitId)
```

## Coordinate conversion

Convert between screen pixels and chart coordinates:

```javascript
const { x: worldX, y: worldY } = chart.screenToWorld(screenX, screenY)
const { x: screenX, y: screenY } = chart.worldToScreen(worldX, worldY)
```

---

## Next steps

- [Getting Started](getting-started.md) — Basic chart setup
- [Themes](themes.md) — Dark/light mode
- [API Reference](../api/README.md) — Full method signatures
