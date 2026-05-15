# Viewport & Interaction

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/chart-instance](https://mrd-indicators.com/docs/chart-instance)** — this Markdown mirror is kept for offline / GitHub browsing.


This page covers the chart's viewport system — how panning, zooming, touch gestures, bar replay, and sub-pane resizing work.

---

## Built-in Interactions

The chart engine sets up all input event listeners automatically when you call `createChartBridge()`. The following interactions work out of the box:

### Mouse

| Action | Behavior |
|---|---|
| **Drag** on main chart | Pan (horizontal scroll through time) |
| **Drag** on Y-axis | Manual Y-axis scaling (vertical zoom) |
| **Scroll wheel** on chart | Zoom in/out (time axis) |
| **Scroll wheel** on Y-axis | Zoom Y-axis |
| **Click** on drawing | Select drawing |
| **Double-click** on drawing | Trigger `onDrawingDblClick` callback |
| **Right-click** | Context menu event (if configured) |
| **Drag** on separator line | Resize sub-panes (RSI, OI, CVD, etc.) |

### Touch (Mobile/Tablet)

| Gesture | Behavior |
|---|---|
| **Single finger drag** | Pan |
| **Pinch** (two fingers) | Zoom |
| **Long press** (300ms) | Enable crosshair mode |
| **Tap** on drawing | Select drawing |
| **Double tap** | Fit content / reset zoom |
| **Drag** on separator | Resize sub-panes |
| **Long press** (700ms) on liq zone | Pin liquidation annotation |

### Keyboard

| Key | Behavior |
|---|---|
| `Escape` | Cancel drawing / deselect |
| `Delete` / `Backspace` | Delete selected drawing |

---

## Lifecycle Methods

### `chart.start()`

Begins the `requestAnimationFrame` render loop. The chart only renders when the dirty flag is set.

```javascript
chart.start()
```

### `chart.stop()`

Stops the render loop completely. The chart freezes.

```javascript
chart.stop()
```

### `chart.pause()` / `chart.resume()`

Temporarily halts rendering without stopping the loop. Use this when the browser tab is hidden.

```javascript
document.addEventListener('visibilitychange', () => {
  document.hidden ? chart.pause() : chart.resume()
})
```

### `chart.isPaused` → `boolean`

```javascript
if (chart.isPaused) {
  console.log('Chart is paused')
}
```

---

## Resize

### `chart.resize(retries?)`

Recalculates canvas dimensions from the DOM and updates the viewport.

```javascript
chart.resize()
```

Handles:
- Reading new `getBoundingClientRect()` dimensions
- Updating canvas pixel size (width/height attributes)
- DPR/Retina scaling via `devicePixelRatio`
- Calling `engine.resize()` to update the engine viewport
- Scheduling a re-render

If the canvas has zero size (e.g. during a CSS transition), the method automatically retries up to 8 times with 250ms intervals.

### Responsive Setup

```javascript
const ro = new ResizeObserver(() => chart.resize())
ro.observe(canvas.parentElement)

// Cleanup
ro.disconnect()
```

---

## Synchronous Render

### `chart.renderSync()` → `number`

Forces an immediate render outside the RAF loop. Returns the number of commands rendered. Use sparingly — mainly for screenshot/export scenarios.

```javascript
const cmdCount = chart.renderSync()
```

---

## Bar Replay

The bar replay system lets you step through historical data one candle at a time, simulating live market playback.

### `chart.setReplayState(active, current, total)`

Activates or deactivates replay mode.

| Parameter | Type | Description |
|---|---|---|
| `active` | `boolean` | Enable/disable replay mode |
| `current` | `number` | Current bar index (0-based) |
| `total` | `number` | Total number of bars |

```javascript
// Start replay at bar 500 out of 1000
chart.setReplayState(true, 500, 1000)

// Step forward
chart.setReplayState(true, 501, 1000)

// Stop replay
chart.setReplayState(false, 0, 0)
```

### `chart.setReplayHovered(hovered)`

Sets the hover state for the replay progress bar.

```javascript
chart.setReplayHovered(true)
```

### `chart.setReplayPreview(screenX)`

Shows a preview marker at the given screen X position on the replay progress bar.

```javascript
chart.setReplayPreview(400)   // preview at pixel 400
```

### Complete Replay Example

```javascript
let replayIndex = 0
const totalBars = chart.getKlineCount()
let replayTimer = null

function startReplay() {
  replayIndex = 0
  chart.setReplayState(true, replayIndex, totalBars)

  replayTimer = setInterval(() => {
    replayIndex++
    if (replayIndex >= totalBars) {
      stopReplay()
      return
    }
    chart.setReplayState(true, replayIndex, totalBars)
  }, 500)   // 500ms per bar
}

function stopReplay() {
  clearInterval(replayTimer)
  chart.setReplayState(false, 0, 0)
}

function seekReplay(index) {
  replayIndex = Math.max(0, Math.min(index, totalBars - 1))
  chart.setReplayState(true, replayIndex, totalBars)
}
```

---

## Sub-pane Resize

Indicator sub-panes (RSI, OI, CVD, Funding Rate, VPIN) can be resized by dragging the separator line between panes. This is handled automatically by the event system.

Pane height ratios can also be set programmatically:

```javascript
chart.setRsiRatio(0.15)    // RSI takes 15% of chart height
chart.setOiRatio(0.12)     // OI takes 12%
```

### Pane IDs

| ID | Pane |
|---|---|
| 0 | `PANE_MAIN` |
| 1 | `PANE_RSI` |
| 2 | `PANE_OI` |
| 3 | `PANE_FR` |
| 4 | `PANE_CVD` |
| 5 | `PANE_VPIN` |

---

## Coordinate Conversion

### `chart.screenToWorld(sx, sy)` → `{ x, y }`

Convert screen (pixel) coordinates to world (timestamp, price) coordinates.

```javascript
const { x: timestamp, y: price } = chart.screenToWorld(400, 300)
```

### `chart.worldToScreen(wx, wy)` → `{ x, y } | null`

Convert world coordinates to screen coordinates. Returns `null` if the point is outside the visible area.

```javascript
const pos = chart.worldToScreen(1710000000, 67500)
if (pos) {
  overlay.style.left = pos.x + 'px'
  overlay.style.top  = pos.y + 'px'
}
```

---

## Mobile Optimizations

The engine automatically detects touch devices and applies these optimizations:

| Optimization | Detail |
|---|---|
| **30fps throttle** | Mobile renders at max 30fps (33ms min frame) vs. 60fps desktop |
| **Momentum scrolling** | Inertial panning after finger lift |
| **Long-press crosshair** | 300ms hold enables crosshair mode |
| **Pinch zoom** | Two-finger zoom with center preservation |
| **Tap thresholds** | 10px tap threshold, 350ms double-tap window |

Detection criteria: `'ontouchstart' in window` and `window.innerWidth <= 1399`.

---

## Cleanup

### `chart.destroy()`

Frees all resources:

1. Stops the render loop (`cancelAnimationFrame`)
2. Clears throttle timers
3. Removes all DOM event listeners (mouse, touch, keyboard, resize)
4. Calls `engine.free()` to release engine memory

```javascript
chart.destroy()
```

> **Important:** After `destroy()`, the chart object is unusable. All method calls will fail silently or throw.

---

## Next Steps

| Topic | Link |
|---|---|
| Chart aggregation (Renko/Range/Tick) | [Chart Aggregation](./chart-aggregation.md) |
| Theming | [Theming](./themes.md) |
| Advanced topics | [Advanced Topics](./advanced.md) |
