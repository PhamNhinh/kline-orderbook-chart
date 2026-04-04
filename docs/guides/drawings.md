# Drawing Tools

@mrd/chart-engine provides 10+ drawing tools for technical analysis — trendlines, Fibonacci retracements, position boxes, anchored VWAP, Elliott Wave counts, and more. Drawings support programmatic creation, interactive mode, per-drawing styling, selection, and JSON serialization.

---

## Drawing Tool Overview

| Tool | Plan | Points | Description |
|---|---|---|---|
| **Trendline** | All | 2 | Straight line between two points |
| **Horizontal Line** | All | 1 | Infinite horizontal line at a price level |
| **Arrow** | All | 2 | Directional arrow between two points |
| **Price Label** | All | 1 | Text annotation at a price/time point |
| **Fibonacci Retracement** | Professional+ | 2 | Fibonacci levels between swing high/low |
| **Fibonacci Extension** | Professional+ | 3 | Fibonacci extension from three points |
| **Long Position** | Professional+ | 2 | Entry/TP/SL position box (long) |
| **Short Position** | Professional+ | 2 | Entry/TP/SL position box (short) |
| **Anchored VWAP** | Professional+ | 1 | Volume-weighted average price from anchor |
| **Elliott Impulse** | Professional+ | 1 | Elliott Wave count (5-wave impulse) |
| **Circle** | All | 1 | Circle marker |
| **Arrow Up / Arrow Down** | All | 1 | Directional markers |
| **Text Note** | All | 1 | Free text annotation |
| **Channel** | Professional+ | 3 | Parallel channel |
| **Brush / Path** | All | N | Freehand drawing |

---

## Interactive Drawing Mode

The simplest way to add drawings is through interactive mode — the user clicks/taps on the chart to place points.

### `startDrawing(tool, style?)`

Enters drawing mode. The user clicks on the chart to place anchor points.

| Parameter | Type | Description |
|---|---|---|
| `tool` | `string` | Tool name from the registry (see below) |
| `style` | `object` | Optional: `{ r, g, b, lineWidth, dashed }` |

**Available tool names:** `trendline`, `arrow`, `measure`, `fib`, `long`, `short`, `hline`, `vwap`, `pricelabel`, `circle`, `arrowup`, `arrowdown`, `textnote`, `channel`, `fibext`, `brush`, `path`, `elliott`, `elliottauto`

```javascript
// Enter trendline drawing mode
chart.startDrawing('trendline', {
  r: 255, g: 255, b: 255,
  lineWidth: 1.5,
  dashed: false,
})

// Enter Fibonacci drawing mode
chart.startDrawing('fib', {
  r: 200, g: 150, b: 50,
  lineWidth: 1,
  dashed: false,
})
```

### `cancelDrawing()`

Exits drawing mode without completing the drawing.

```javascript
chart.cancelDrawing()
```

### Drawing Completion Callback

```javascript
chart.onDrawingComplete(() => {
  console.log('Drawing completed')
  // The tool automatically resets to pan mode
})

chart.onDrawingCancel(() => {
  console.log('Drawing cancelled')
})
```

---

## Programmatic Drawing Creation

Create drawings directly without interactive mode.

### `addTrendline(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` → `number`

Creates a trendline. Returns the drawing ID.

| Parameter | Type | Description |
|---|---|---|
| `x1`, `y1` | `number` | Start point (world coordinates: timestamp, price) |
| `x2`, `y2` | `number` | End point (world coordinates) |
| `r`, `g`, `b` | `number` | Color (0–255 each) |
| `lineWidth` | `number` | Line width in pixels |
| `dashed` | `boolean` | Dashed line style |
| `pane` | `number` | Pane index (default: 0 = main chart) |

```javascript
const id = chart.addTrendline(
  1710000000, 67500,     // start: timestamp, price
  1710036000, 68200,     // end: timestamp, price
  255, 255, 255,         // white
  1.5,                   // line width
  false,                 // solid line
  0                      // main pane
)
```

### `addHorizontalLine(x, price, r, g, b, lineWidth, dashed, pane?)` → `number`

```javascript
const id = chart.addHorizontalLine(
  1710000000, 67500,     // anchor timestamp, price
  255, 200, 50,          // golden color
  1, true, 0             // thin dashed line on main pane
)
```

### `addArrow(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` → `number`

```javascript
const id = chart.addArrow(
  1710000000, 67500, 1710036000, 68200,
  0, 200, 100, 2, false, 0
)
```

### `addFibRetracement(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` → `number`

**Plan:** Professional+.

```javascript
const id = chart.addFibRetracement(
  1710000000, 65000,     // swing low
  1710072000, 70000,     // swing high
  200, 150, 50, 1, false, 0
)
```

### `addFibExtension(x1, y1, x2, y2, x3, y3, r, g, b, lineWidth, dashed, pane?)` → `number`

Three-point Fibonacci extension. **Plan:** Professional+.

```javascript
const id = chart.addFibExtension(
  1710000000, 65000,     // point A
  1710036000, 70000,     // point B
  1710054000, 67500,     // point C
  200, 150, 50, 1, false, 0
)
```

### `addLongPosition(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` → `number`

### `addShortPosition(x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)` → `number`

Position boxes for long/short trade visualization. **Plan:** Professional+.

```javascript
const longId = chart.addLongPosition(
  1710000000, 67500,     // entry time/price
  1710036000, 69000,     // target time/price
  38, 166, 154, 1.5, false, 0
)
```

### `addAnchoredVwap(anchorX, r, g, b, lineWidth, dashed, pane?)` → `number`

Anchored VWAP starting from a specific timestamp. **Plan:** Professional+.

```javascript
const id = chart.addAnchoredVwap(
  1710000000,            // anchor timestamp
  100, 149, 237,         // cornflower blue
  1.5, false, 0
)
```

### `addPriceLabel(x, y, r, g, b, fontSize, pane?)` → `number`

Text label at a world coordinate.

```javascript
const id = chart.addPriceLabel(
  1710000000, 67500,     // position
  255, 255, 255,         // white
  12, 0                  // font size, pane
)
chart.setDrawingText(id, 'Support zone')
```

### `addElliottImpulse(x, y, r, g, b, fontSize, pane?)` → `number`

Elliott Wave impulse count. **Plan:** Professional+.

```javascript
const id = chart.addElliottImpulse(
  1710000000, 67500,
  200, 150, 50, 14, 0
)
```

---

## Color Input

Colors accept both **integer (0–255)** and **float (0.0–1.0)** ranges. The bridge auto-detects:

```javascript
// Integer format (0-255)
chart.addTrendline(x1, y1, x2, y2, 255, 100, 50, 1.5, false)

// Float format (0.0-1.0)
chart.addTrendline(x1, y1, x2, y2, 1.0, 0.39, 0.20, 1.5, false)
```

---

## Drawing Properties

### `setDrawingStyle(id, r, g, b, lineWidth)`

Change the color and line width of an existing drawing.

```javascript
chart.setDrawingStyle(id, 255, 0, 0, 2)   // change to red, thicker
```

### `getDrawingColor(id)` → `{ r, g, b, lineWidth } | null`

```javascript
const style = chart.getDrawingColor(id)
// → { r: 255, g: 100, b: 50, lineWidth: 1.5 }
```

### `setDrawingDashed(id, dashed)` / `getDrawingDashed(id)`

```javascript
chart.setDrawingDashed(id, true)   // make dashed
```

### `setDrawingText(id, text)` / `getDrawingText(id)`

Set/get text content for labels and annotations.

```javascript
chart.setDrawingText(id, 'Key resistance level')
const text = chart.getDrawingText(id)
```

### `setDrawingFontSize(id, fontSize)` / `getDrawingFontSize(id)`

```javascript
chart.setDrawingFontSize(id, 14)
```

### `setDrawingHideLabel(id, hide)` / `getDrawingHideLabel(id)`

Hide the price label on a drawing.

```javascript
chart.setDrawingHideLabel(id, true)
```

### `getDrawingKindId(id)` → `number`

Returns the internal type ID of the drawing.

---

## Selection & Deletion

### `selectDrawing(id)` / `deselectDrawing()` / `getSelectedDrawing()` → `number`

```javascript
chart.selectDrawing(42)
const selected = chart.getSelectedDrawing()   // → 42
chart.deselectDrawing()
```

### `deleteSelectedDrawing()` → `number`

Removes the currently selected drawing. Returns the ID of the removed drawing.

```javascript
const removedId = chart.deleteSelectedDrawing()
```

### `removeDrawing(id)`

Remove a specific drawing by ID.

```javascript
chart.removeDrawing(42)
```

### `clearDrawings()`

Remove all drawings.

```javascript
chart.clearDrawings()
```

### `drawingCount()` → `number`

```javascript
const count = chart.drawingCount()
```

---

## Selection Events

```javascript
chart.onDrawingSelected((id, cx, cy) => {
  console.log(`Drawing ${id} selected at canvas (${cx}, ${cy})`)
  // Show a context menu or style editor
})

chart.onDrawingDblClick((id, sx, sy, cx, cy) => {
  console.log(`Drawing ${id} double-clicked`)
  // Open text editor for labels
})
```

---

## Markers

Markers are lightweight point annotations (e.g. trade execution points).

### `addMarker(timestamp, price, isBid)` / `removeMarker(id)` / `clearMarkers()`

```javascript
chart.addMarker(1710000000, 67500, true)    // bid marker (buy)
chart.addMarker(1710003600, 68200, false)   // ask marker (sell)
chart.clearMarkers()
```

### `hitTestMarker(sx, sy)` → `number`

Returns marker ID at screen coordinates (0 if none).

### `selectMarker(id)` / `deselectMarker()` / `getSelectedMarker()` / `deleteSelectedMarker()`

```javascript
chart.onMarkerSelected((id) => {
  console.log(`Marker ${id} selected`)
})
```

---

## JSON Serialization

### `exportDrawingsJson()` → `string`

Exports all drawings as a JSON string. Use this to save drawings to a backend.

```javascript
const json = chart.exportDrawingsJson()
localStorage.setItem('chart-drawings', json)
```

### `importDrawingsJson(json)`

Restores drawings from a JSON string.

```javascript
const saved = localStorage.getItem('chart-drawings')
if (saved) chart.importDrawingsJson(saved)
```

### Save/Load Example

```javascript
// Save
function saveDrawings() {
  const json = chart.exportDrawingsJson()
  fetch('/api/drawings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol: 'BTCUSDT', timeframe: '1h', drawings: json }),
  })
}

// Load
async function loadDrawings() {
  const res = await fetch('/api/drawings?symbol=BTCUSDT&timeframe=1h')
  const data = await res.json()
  if (data.drawings) chart.importDrawingsJson(data.drawings)
}
```

---

## Coordinate Conversion

### `screenToWorld(sx, sy)` → `{ x, y }`

Converts screen pixel coordinates to world coordinates (timestamp, price).

```javascript
const world = chart.screenToWorld(400, 300)
// → { x: 1710036000, y: 67850 }
```

### `worldToScreen(wx, wy)` → `{ x, y } | null`

Converts world coordinates to screen pixel coordinates.

```javascript
const screen = chart.worldToScreen(1710036000, 67850)
// → { x: 400, y: 300 }
```

---

## Drawing Preview

### `setDrawingPreview(kind, x1, y1, x2, y2, r, g, b, lineWidth, dashed, pane?)`

Shows a preview of a drawing without committing it. Used internally by the interactive mode.

### `clearDrawingPreview()`

Removes the drawing preview.

### `cancelBrush()`

Cancels an in-progress freehand brush drawing.

---

## Next Steps

| Topic | Link |
|---|---|
| Build custom indicators | [Custom Indicators](./custom-indicators.md) |
| Handle events & tooltips | [Events & Tooltips](./tooltip.md) |
| Viewport interaction | [Viewport & Interaction](./viewport-interaction.md) |
