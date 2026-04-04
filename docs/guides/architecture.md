# Core Concepts

This page explains the architecture of @mrd/chart-engine — how the native computation engine, JavaScript bridge, and Canvas 2D renderer work together to deliver 60 fps financial charting.

---

## Architecture Overview

```
  ┌─────────────────────────────────────────────────────────┐
  │  Your Application (React / Vue / Svelte / Vanilla JS)   │
  │                                                         │
  │   import { createChartBridge } from '@mrd/chart-engine' │
  │   const chart = await createChartBridge(canvas, opts)   │
  └────────────────────┬────────────────────────────────────┘
                       │
  ┌────────────────────▼────────────────────────────────────┐
  │  JS Bridge Layer (@mrd/chart-engine)                    │
  │                                                         │
  │  ┌──────────────────────────────────────────────┐       │
  │  │  Native Computation Engine                   │       │
  │  │                                              │       │
  │  │  • Kline storage & viewport transforms       │       │
  │  │  • Indicator math (RSI, CVD, OI, VPIN...)    │       │
  │  │  • Heatmap matrix & color mapping            │       │
  │  │  • Footprint bar aggregation                 │       │
  │  │  • Drawing hit-test & geometry               │       │
  │  │  • Y-axis auto-scaling                       │       │
  │  │  • Crosshair & tooltip data                  │       │
  │  │                                              │       │
  │  │  Output: Binary Command Buffer               │       │
  │  │  ┌──────────────────────────────────┐        │       │
  │  │  │ FILL_RECT │ STROKE │ TEXT │ ...  │        │       │
  │  │  └──────────────┬───────────────────┘        │       │
  │  └─────────────────┼───────────────────────────┘       │
  │                    │ zero-copy read                     │
  │  ┌─────────────────▼───────────────────────────┐       │
  │  │  Canvas 2D Renderer (canvasRenderer.js)      │       │
  │  │  Reads binary opcodes → ctx.fillRect(),      │       │
  │  │  ctx.strokeRect(), ctx.fillText(), etc.      │       │
  │  └──────────────────────────────────────────────┘       │
  └─────────────────────────────────────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  <canvas> DOM   │
              │  (single elem)  │
              └─────────────────┘
```

---

## The Three Layers

### 1. Native Computation Engine

The core computation engine is written in a compiled systems language and delivered as a high-performance binary module. It handles:

- **Data storage:** OHLCV arrays, heatmap matrices, footprint bar data, indicator series
- **Viewport math:** Pan/zoom transforms, visible range calculation, bar width, pixel mapping
- **Indicator computation:** RSI, EMA, CVD, VPIN, and all other built-in indicators
- **Drawing geometry:** Trendline/Fibonacci/Elliott intersection, hit testing, drag anchors
- **Rendering:** Converts the visual state into a flat binary command buffer

The engine never touches the DOM or Canvas API directly. It produces a **binary command buffer** — a compact sequence of draw instructions encoded as opcodes + parameters.

### 2. JS Bridge (`bridge.js` + modules)

The bridge layer provides the public JavaScript API. It:

- **Loads and initializes** the native engine module
- **Wraps engine methods** with JavaScript-friendly signatures (e.g. `chart.enableRsi()` → `engine.enable_rsi()`)
- **Manages the render loop** via `requestAnimationFrame`
- **Sets up input events** (mouse, touch, keyboard) and translates them into engine calls
- **Feature-gates** methods based on the license plan
- **Manages the dirty flag** — the engine only re-renders when data actually changes

The bridge is split into focused modules:

| Module | Responsibility |
|---|---|
| `bridge.js` | Lifecycle, render loop, event wiring, custom indicators |
| `bridgeData.js` | Kline CRUD, heatmap, footprint, chart type |
| `bridgeIndicators.js` | All 14+ indicator enable/disable/configure methods |
| `bridgeDrawing.js` | Drawing tools, markers, coordinate conversion |
| `eventHandler.js` | Shared pointer state, keyboard shortcuts |
| `eventMouse.js` | Mouse wheel zoom, drag, drawing interactions |
| `eventTouch.js` | Pinch zoom, long-press, tap patterns |
| `canvasRenderer.js` | Binary command buffer → Canvas 2D calls |
| `customIndicators.js` | Plugin indicator registry with native draw API |

### 3. Canvas 2D Renderer (`canvasRenderer.js`)

The renderer reads the binary command buffer from engine shared memory and translates each opcode into native Canvas 2D calls:

| Opcode | Canvas call |
|---|---|
| `FILL_RECT (0x01)` | `ctx.fillRect(x, y, w, h)` |
| `STROKE_RECT (0x02)` | `ctx.strokeRect(x, y, w, h)` |
| `FILL_TEXT (0x03)` | `ctx.fillText(text, x, y)` |
| `LINE (0x04)` | `ctx.beginPath(); ctx.moveTo(); ctx.lineTo(); ctx.stroke()` |
| `POLYLINE (0x05)` | Multi-point line (indicator curves) |
| `CIRCLE (0x06)` | `ctx.arc()` |
| `SET_COLOR (0x07)` | `ctx.fillStyle = ...; ctx.strokeStyle = ...` |
| `SET_FONT (0x08)` | `ctx.font = ...` |
| `CLIP_RECT (0x09)` | `ctx.save(); ctx.beginPath(); ctx.rect(); ctx.clip()` |
| `RESTORE_CLIP (0x0A)` | `ctx.restore()` |
| `IMAGE_DATA (0x0B)` | `ctx.putImageData()` (heatmap tiles) |
| `GRADIENT_RECT (0x0C)` | `ctx.createLinearGradient()` |
| `DASHED_LINE (0x0D)` | `ctx.setLineDash()` |
| `TRIANGLE (0x0E)` | Filled triangle (markers) |
| `DASHED_POLYLINE (0x0F)` | Dashed multi-point line |
| `END_FRAME (0xFF)` | Marks end of command buffer |

This zero-copy approach means JavaScript never builds intermediate data structures — it reads opcodes directly from engine linear memory.

---

## Render Loop

The render loop follows a dirty-flag pattern:

```
1. User action or data update
   → bridge method calls markDirty()

2. scheduleRender()
   → requests next RAF if not already scheduled
   → on mobile: enforces 30fps throttle (33ms min frame)

3. renderFrame() (called by RAF)
   → checks: dirty || engine.is_dirty()
   → if nothing changed: skip (zero cost)
   → if dirty:
      a. engine.render()           → fills command buffer
      b. dispatchCommands(ctx, …)  → draws to canvas
      c. customIndicators.renderAll(ctx)
      d. flush tooltip data
      e. draw watermark (if trial)
      f. check if still dirty → schedule another frame
```

### Why Dirty Flags Matter

Unlike libraries that re-render on every frame, @mrd/chart-engine only renders when the visual state has changed. This means:

- **Idle CPU usage is near zero** — no animation frames when the chart is static
- **Battery-friendly** on mobile devices
- **Multiple data updates per frame are batched** — calling `updateLastKline()` 10 times before the next frame only triggers one render

---

## Memory Model

The native engine owns all chart data in linear memory. When you call `chart.setKlines(...)`, the data is copied from JavaScript arrays into engine memory. After that, the engine owns the data.

### Key memory characteristics:

| Aspect | Detail |
|---|---|
| **OHLCV storage** | 6 × Float64Array (48 bytes/candle) |
| **Heatmap matrix** | rows × cols × 8 bytes |
| **Command buffer** | ~200KB per frame (reused each render) |
| **Custom indicator buffer** | Separate buffer, also reused per frame |
| **Total at 10K candles + 500-row heatmap** | ~20 MB |

### Cleanup

Always call `chart.destroy()` when unmounting. This:
1. Stops the render loop
2. Removes all DOM event listeners
3. Calls `engine.free()` to release engine memory

Failure to call `destroy()` will leak engine memory (it is not garbage-collected).

---

## Responsibility Model

### What the library handles:

- Canvas rendering (all draw calls)
- All indicator math and visualization
- Viewport transforms (pan, zoom, auto-scale)
- Drawing tool geometry, hit testing, serialization
- Touch gesture recognition (pinch, long-press, tap)
- Crosshair and tooltip data computation
- Theme color mapping
- DPR/Retina scaling

### What you provide:

- **Kline data source** — REST API, WebSocket, or local data
- **WebSocket connection** — for real-time candle updates
- **Heatmap matrix aggregation** — aggregate L2 orderbook depth into a price×time matrix
- **Trade stream** — for footprint chart (aggTrade WebSocket)
- **Indicator data feeds** — OI, funding rate, CVD volumes from your data source
- **UI chrome** — toolbar, settings panel, symbol selector, timeframe picker
- **Error handling** — network errors, reconnection logic

---

## Module Loading

The engine module is loaded lazily on first use:

```javascript
// Option A: Eager prefetch (recommended)
import { prefetchWasm } from '@mrd/chart-engine'
prefetchWasm()   // starts download + compile immediately, no await needed

// Option B: Lazy load (on first createChartBridge call)
const chart = await createChartBridge(canvas, options)
// Engine loads here if not already prefetched
```

The module is loaded **once** and cached globally. Multiple `createChartBridge` calls share the same engine instance. Each chart gets its own `ChartEngine` object but shares the compiled module.

---

## Next Steps

| Topic | Link |
|---|---|
| Load and update candlestick data | [Candlestick Data](./data.md) |
| Add orderbook heatmap | [Orderbook Heatmap](./orderbook-heatmap.md) |
| Configure indicators | [Built-in Indicators](./indicators.md) |
