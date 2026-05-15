# Performance & Optimization

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/intro](https://mrd-indicators.com/docs/intro)** — this Markdown mirror is kept for offline / GitHub browsing.


Kline Orderbook Chart is built for high-frequency, data-intensive charting. This guide covers how the engine achieves its performance and best practices for your application.

## Architecture overview

```
┌─────────────────────────────────────┐
│  Native Engine (compiled)           │
│  All computation: indicators, hit   │
│  testing, heatmap color mapping,    │
│  viewport transforms                │
│         │                           │
│         ▼ Binary command buffer     │
│  ───────────────────────────────    │
│  Canvas 2D Renderer (JS)           │
│  Dispatches draw opcodes:           │
│  fillRect, stroke, fillText         │
└─────────────────────────────────────┘
```

- The **native engine** handles all computation. JavaScript never touches indicator math, hit testing, or heatmap rendering.
- The engine outputs a **binary command buffer** containing Canvas 2D draw operations.
- A lightweight JS renderer dispatches these commands to the browser's Canvas API.
- This architecture means **near-zero garbage collection pressure** — no intermediate objects or arrays are created per frame.

## Benchmark results

Measured on a standard desktop (M-series Mac, Chrome):

| Metric | Result |
|---|---|
| Engine init | 6 ms |
| Peak FPS | 29,412 fps |
| Render (all indicators) | 0.10 ms/frame |
| First render (10K candles) | 2.1 ms |
| First render (50K candles) | 9.1 ms |
| Memory (50K candles) | ~12 MB |

### Real-time streaming (10K candles, RSI + Volume)

| Operation | FPS | Latency |
|---|---|---|
| Kline tick update | 711 fps | 1.41 ms |
| New candle append | 696 fps | 1.44 ms |
| Heatmap update | 5,792 fps | 0.17 ms |
| Combined stress | 653 fps | 1.53 ms |

### Scaling with data

| Candle count | FPS (RSI + Volume) |
|---|---|
| 100 | 29,412 |
| 1K | 11,628 |
| 10K | 12,195 |
| 50K | 11,905 |
| 100K | 11,628 |

FPS remains above 11,000 even at 100K candles — no performance degradation at scale.

## Best practices

### 1. Use `prefetchEngine()` for faster first render

Call `prefetchEngine()` as early as possible (e.g., when your app loads, before the user navigates to the chart page). This pre-downloads and compiles the engine binary so `createChartBridge()` is instant.

```javascript
import { prefetchEngine } from 'kline-orderbook-chart'

// Call on app init — the engine will be ready when the chart page loads
prefetchEngine()
```

### 2. Pause rendering when hidden

If the chart is in a hidden tab or off-screen, pause it to save CPU:

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    chart.pause()
  } else {
    chart.resume()
  }
})
```

### 3. Handle resize efficiently

Call `chart.resize()` in response to window resize events. Debounce if needed:

```javascript
window.addEventListener('resize', () => chart.resize())
```

The engine automatically reads the canvas dimensions — no arguments needed.

### 4. Batch data loading

When loading large datasets, call `setKlines()` once with all data rather than calling `appendKline()` in a loop:

```javascript
// Good — single call
chart.setKlines(timestamps, opens, highs, lows, closes, volumes)

// Bad — N calls, N re-renders
for (const k of klines) {
  chart.appendKline(k.t, k.o, k.h, k.l, k.c, k.v)  // triggers render each time
}
```

### 5. Use typed arrays for heatmap data

Heatmap methods accept `Float64Array`. Avoid creating regular arrays and converting:

```javascript
// Good — allocate once
const column = new Float64Array(rows)
column[idx] = value

// Bad — create array then convert
const arr = []
arr.push(value)
chart.appendHeatmapColumn(new Float64Array(arr), ...)  // unnecessary copy
```

### 6. Destroy when done

Always call `chart.destroy()` when the chart component unmounts. This frees engine memory and stops the render loop:

```javascript
chart.destroy()
```

## Memory profile

| Candle count | Approximate memory |
|---|---|
| 1K | ~2 MB |
| 10K | ~5 MB |
| 50K | ~12 MB |
| 100K | ~22 MB |

For comparison, JavaScript-only charting libraries typically use 50–120 MB at 50K candles.

---

## Next steps

- [Getting Started](getting-started.md) — Basic setup
- [Candlestick Data](data.md) — Data format, real-time updates, WebSocket integration
- [API Reference](../api/README.md) — Full method documentation
