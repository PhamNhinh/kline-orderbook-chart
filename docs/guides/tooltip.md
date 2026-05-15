# Events & Tooltips

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/chart-instance](https://mrd-indicators.com/docs/chart-instance)** — this Markdown mirror is kept for offline / GitHub browsing.


This page covers all event callbacks, the tooltip system, and hit testing APIs.

---

## Tooltip Callback

### `chart.onTooltip(callback)`

The tooltip callback fires when the crosshair moves over candle data. Use it to build a custom tooltip UI.

```javascript
chart.onTooltip((json, screenX, screenY) => {
  if (!json) {
    // Crosshair hidden or moved off data area
    hideTooltip()
    return
  }

  const data = JSON.parse(json)
  showTooltip(data, screenX, screenY)
})
```

### Tooltip Data Structure

The `json` string contains OHLCV data and active indicator values at the crosshair position:

```json
{
  "t": 1710000000,
  "o": 67500.0,
  "h": 67890.0,
  "l": 67400.0,
  "c": 67800.0,
  "v": 125.5,
  "rsi": 58.3,
  "oi": 510000.0,
  "fr": 0.0001,
  "cvd": 1234.5
}
```

Fields depend on which indicators are enabled. Only active indicators appear in the payload.

### Performance Note

The tooltip callback is **deferred to the render frame** — it does not fire on every mouse event. This avoids expensive internal JSON serialization (`get_tooltip_data`) on every pixel of mouse movement. The engine batches movement and only queries tooltip data once per frame.

The callback only fires when the crosshair is in the **main chart zone** (zone 0) or **volume zone** (zone 1).

---

## Drawing Events

### `chart.onDrawingComplete(callback)`

Fires when the user finishes placing a drawing in interactive mode.

```javascript
chart.onDrawingComplete(() => {
  console.log('Drawing completed')

  // Save drawings to backend
  const json = chart.exportDrawingsJson()
  saveToServer(json)
})
```

### `chart.onDrawingCancel(callback)`

Fires when the user cancels a drawing (Escape key or `cancelDrawing()`).

```javascript
chart.onDrawingCancel(() => {
  // Reset toolbar state
  toolbar.setActiveButton(null)
})
```

### `chart.onDrawingSelected(callback)`

Fires when the user clicks on an existing drawing.

```javascript
chart.onDrawingSelected((drawingId, canvasX, canvasY) => {
  // Show context menu at click position
  showContextMenu({
    x: canvasX,
    y: canvasY,
    drawingId,
    onDelete: () => chart.removeDrawing(drawingId),
    onStyle: () => showStyleEditor(drawingId),
  })
})
```

### `chart.onDrawingDblClick(callback)`

Fires when the user double-clicks an existing drawing.

```javascript
chart.onDrawingDblClick((drawingId, screenX, screenY, canvasX, canvasY) => {
  // Open text editor for labels
  const text = chart.getDrawingText(drawingId)
  const newText = prompt('Edit text:', text)
  if (newText !== null) {
    chart.setDrawingText(drawingId, newText)
  }
})
```

### `chart.onMarkerSelected(callback)`

Fires when the user clicks on a marker.

```javascript
chart.onMarkerSelected((markerId) => {
  // Show marker details
  console.log(`Marker ${markerId} selected`)
})
```

---

## Hover Hit Testing

### VRVP Hover

#### `chart.onVrvpHover(callback)`

Fires when the crosshair moves over the VRVP (Visible Range Volume Profile) area.

```javascript
chart.onVrvpHover((screenX, screenY) => {
  const info = chart.vrvpHitTest(screenX, screenY)
  if (info) {
    showVrvpTooltip(JSON.parse(info))
  }
})
```

### Large Trade Hover

#### `chart.onLtHover(callback)`

Fires when the crosshair moves near large trade bubbles. Throttled to ~80ms intervals.

```javascript
chart.onLtHover((json) => {
  if (!json) {
    hideLtTooltip()
    return
  }
  const trade = JSON.parse(json)
  showLtTooltip(trade)
})
```

### Liquidation Annotation Pin

#### `chart.onLiqAnnotationPin(callback)`

Fires when the user long-presses on a liquidation zone (mobile gesture).

```javascript
chart.onLiqAnnotationPin((screenX, screenY) => {
  const info = chart.liqHeatmapHitTest(screenX, screenY)
  if (info) showLiqAnnotation(JSON.parse(info), screenX, screenY)
})
```

---

## Post-Render Callback

### `chart.onPostRender(callback)`

Called after each rendered frame. Use this for synchronizing external UI, overlaying custom DOM elements, or triggering side effects.

```javascript
chart.onPostRender(() => {
  // Update external price display
  const lastClose = chart.getLastClose()
  document.getElementById('price').textContent = lastClose.toFixed(2)
})
```

> **Warning:** This runs on every frame. Keep the callback fast.

---

## Hit Zone Detection

### `chart.hitZone(x, y)` → `number`

Returns the zone ID at the given screen coordinates. Use this to determine which part of the chart the user is interacting with.

| Zone ID | Constant | Description |
|---|---|---|
| 0 | `ZONE_MAIN` | Main candlestick area |
| 1 | `ZONE_VOLUME` | Volume histogram area |
| 2 | `ZONE_XAXIS` | Time axis (bottom) |
| 3 | `ZONE_YAXIS` | Price axis (right) |
| 4 | `ZONE_RSI` | RSI sub-pane |
| 5 | `ZONE_RSI_SEP` | RSI separator (drag to resize) |
| 6 | `ZONE_OI` | Open Interest sub-pane |
| 7 | `ZONE_OI_SEP` | OI separator |
| 8 | `ZONE_FR` | Funding Rate sub-pane |
| 9 | `ZONE_FR_SEP` | FR separator |
| 10 | `ZONE_CVD` | CVD sub-pane |
| 11 | `ZONE_CVD_SEP` | CVD separator |
| 12 | `ZONE_VPIN` | VPIN sub-pane |
| 13 | `ZONE_VPIN_SEP` | VPIN separator |
| 14 | `ZONE_RSI_YAXIS` | RSI Y-axis |
| 15 | `ZONE_OI_YAXIS` | OI Y-axis |
| 16 | `ZONE_FR_YAXIS` | FR Y-axis |
| 17 | `ZONE_CVD_YAXIS` | CVD Y-axis |
| 18 | `ZONE_VPIN_YAXIS` | VPIN Y-axis |

```javascript
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const zone = chart.hitZone(x, y)

  if (zone === 0) console.log('Clicked on main chart')
  if (zone === 4) console.log('Clicked on RSI pane')
})
```

---

## Crosshair Sync

### `chart.setHoverPrice(price)` / `chart.clearHoverPrice()`

For multi-chart setups, sync the crosshair price between charts:

```javascript
// Chart A: when tooltip fires, broadcast to Chart B
chartA.onTooltip((json) => {
  if (!json) {
    chartB.clearHoverPrice()
    return
  }
  const data = JSON.parse(json)
  chartB.setHoverPrice(data.c)
})

// Chart B: same in reverse
chartB.onTooltip((json) => {
  if (!json) {
    chartA.clearHoverPrice()
    return
  }
  const data = JSON.parse(json)
  chartA.setHoverPrice(data.c)
})
```

---

## Keyboard Shortcuts

The engine handles these keyboard events automatically when the canvas has focus:

| Key | Action |
|---|---|
| `Escape` | Cancel active drawing / deselect |
| `Delete` / `Backspace` | Delete selected drawing |

---

## Event Cleanup

All event listeners are automatically removed when you call `chart.destroy()`. You do not need to manually remove callbacks set via `onTooltip`, `onDrawingComplete`, etc.

---

## Next Steps

| Topic | Link |
|---|---|
| Theming | [Theming](./themes.md) |
| Viewport & interaction | [Viewport & Interaction](./viewport-interaction.md) |
| Drawing tools | [Drawing Tools](./drawings.md) |
