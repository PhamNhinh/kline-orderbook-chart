# Getting Started

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/getting-started](https://mrd-indicators.com/docs/getting-started)** — this Markdown mirror is kept for offline / GitHub browsing.


This tutorial walks you through installing kline-orderbook-chart, creating your first candlestick chart, and starting the real-time render loop — in under 5 minutes.

**Prerequisites:** Node.js 16+ and a modern browser (Chrome 80+, Firefox 79+, Safari 15.2+).

---

## 1. Installation

```bash
npm install kline-orderbook-chart
```

The package ships as a single ES module (`dist/mrd-chart-engine.mjs`) with the native engine binary included. No additional loaders or plugins are required.

| What you get | Size |
|---|---|
| JS bridge + native engine | ~380 KB gzip |
| Runtime dependencies | 0 |

---

## 2. Obtain a License Key

A license key is required. You can start with a **free 14-day trial** (no credit card):

[Request a trial key →](https://app.mrd-indicators.com/charting-library/pricing)

The trial key enables all features with a small watermark overlay.

---

## 3. Create a Canvas Element

The chart renders into a standard HTML `<canvas>` element. The canvas should be inside a container that defines its size:

```html
<div id="chart-container" style="width: 100%; height: 600px;">
  <canvas id="chart" style="width: 100%; height: 100%; display: block;"></canvas>
</div>
```

> **Important:** The canvas must have `display: block` and its parent must have a non-zero size before `createChartBridge` is called. The engine uses `getBoundingClientRect()` to determine the initial pixel dimensions.

---

## 4. Initialize the Chart

```javascript
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

// Step 1: Prefetch the engine binary in the background (optional but recommended)
// Call this as early as possible — e.g. when the app mounts, not when the chart page loads
prefetchEngine()
```

`prefetchEngine()` starts downloading and compiling the native engine module immediately. It is fire-and-forget — no await needed. When `createChartBridge` is called later, it reuses the already-loaded module.

```javascript
// Step 2: Create the chart bridge
const canvas = document.getElementById('chart')

const chart = await createChartBridge(canvas, {
  licenseKey: 'MRD-XXXX-XXXX-XXXX-20270101',   // your license key
})

// Step 3: Configure display settings
chart.setTheme('dark')          // 'dark' or 'light'
chart.setPrecision(2)           // decimal places on price axis
chart.setCandleInterval(3600)   // candle interval in seconds (1h = 3600)
```

### `createChartBridge(canvas, options)` — Options

| Option | Type | Description |
|---|---|---|
| `licenseKey` | `string` | License key string (also accepts `key` as alias) |
| `appId` | `string` | Optional mobile app identifier for mobile license validation |

The function returns a `Promise` that resolves to the chart API object. It performs these steps internally:

1. Validates the license key
2. Loads and compiles the native engine module (reuses prefetch if available)
3. Reads canvas dimensions via `getBoundingClientRect()`
4. Creates the native `ChartEngine` instance
5. Sets up mouse, touch, and keyboard event listeners
6. Returns the complete chart API

---

## 5. Load Candlestick Data

The engine expects OHLCV data as six parallel arrays. Timestamps must be **Unix seconds** (not milliseconds).

```javascript
// Example: Loading data from a Binance-style API
const res = await fetch('/api/klines?symbol=BTCUSDT&interval=1h&limit=1000')
const raw = await res.json()   // [[openTime, open, high, low, close, volume, ...], ...]

const len = raw.length
const timestamps = new Float64Array(len)
const open       = new Float64Array(len)
const high       = new Float64Array(len)
const low        = new Float64Array(len)
const close      = new Float64Array(len)
const volume     = new Float64Array(len)

for (let i = 0; i < len; i++) {
  timestamps[i] = raw[i][0] / 1000    // Binance uses ms → convert to seconds
  open[i]       = +raw[i][1]
  high[i]       = +raw[i][2]
  low[i]        = +raw[i][3]
  close[i]      = +raw[i][4]
  volume[i]     = +raw[i][5]
}

chart.setKlines(timestamps, open, high, low, close, volume)
```

> **Data types:** Arrays can be `Float64Array`, `Float32Array`, or plain `number[]`. The engine internally converts to `Float64Array`.

---

## 6. Enable Indicators

```javascript
// Volume histogram (included in all plans)
chart.enableVolume()

// RSI sub-pane (included in all plans)
chart.enableRsi()
chart.setRsiPeriod(14)

// CVD sub-pane (Professional+ plan)
// Requires taker buy volume and total volume arrays
chart.setCvdData(takerBuyVolumes, totalVolumes)
chart.enableCvd()
```

See [Built-in Indicators](./indicators.md) for the complete list.

---

## 7. Start the Render Loop

```javascript
chart.start()
```

This begins the `requestAnimationFrame` loop. The engine only re-renders when data changes (dirty flag system), so idle frames cost near zero CPU.

---

## 8. Real-time Updates

Connect to a WebSocket for live candlestick updates:

```javascript
const ws = new WebSocket('wss://stream.binance.com/ws/btcusdt@kline_1h')

ws.onmessage = (event) => {
  const { k } = JSON.parse(event.data)

  if (k.x) {
    // Bar closed — append a new candle
    chart.appendKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
  } else {
    // Bar still forming — update the last candle
    chart.updateLastKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
  }
}
```

---

## 9. Handle Resize

```javascript
const ro = new ResizeObserver(() => chart.resize())
ro.observe(canvas.parentElement)
```

`chart.resize()` reads the new canvas dimensions and recalculates the viewport. It handles DPR (Retina) scaling automatically.

---

## 10. Pause When Hidden & Cleanup

```javascript
// Pause rendering when the browser tab is hidden
document.addEventListener('visibilitychange', () => {
  document.hidden ? chart.pause() : chart.resume()
})

// Destroy the chart when unmounting
function cleanup() {
  ro.disconnect()
  ws.close()
  chart.destroy()   // frees engine memory, removes all event listeners
}
```

---

## Complete Working Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MRD Chart Engine — Quick Start</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0f0f14; }
    #chart-container { width: 100vw; height: 100vh; }
    canvas { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <div id="chart-container">
    <canvas id="chart"></canvas>
  </div>

  <script type="module">
    import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

    prefetchEngine()

    const canvas = document.getElementById('chart')
    const chart  = await createChartBridge(canvas, {
      licenseKey: 'MRD-XXXX-XXXX-XXXX-20270101',
    })

    chart.setTheme('dark')
    chart.setPrecision(2)
    chart.setCandleInterval(3600)

    // Load historical data
    const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=1000')
    const raw = await res.json()
    const len = raw.length

    const ts = new Float64Array(raw.map(k => k[0] / 1000))
    const o  = new Float64Array(raw.map(k => +k[1]))
    const h  = new Float64Array(raw.map(k => +k[2]))
    const l  = new Float64Array(raw.map(k => +k[3]))
    const c  = new Float64Array(raw.map(k => +k[4]))
    const v  = new Float64Array(raw.map(k => +k[5]))

    chart.setKlines(ts, o, h, l, c, v)
    chart.enableVolume()
    chart.start()

    // Live updates
    const ws = new WebSocket('wss://stream.binance.com/ws/btcusdt@kline_1h')
    ws.onmessage = (e) => {
      const { k } = JSON.parse(e.data)
      if (k.x) chart.appendKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
      else     chart.updateLastKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
    }

    // Responsive resize
    new ResizeObserver(() => chart.resize()).observe(canvas.parentElement)

    // Pause when hidden
    document.addEventListener('visibilitychange', () => {
      document.hidden ? chart.pause() : chart.resume()
    })
  </script>
</body>
</html>
```

---

## What's Next?

| Topic | Link |
|---|---|
| Understand the architecture | [Core Concepts](./architecture.md) |
| Add an orderbook heatmap | [Orderbook Heatmap](./orderbook-heatmap.md) |
| Enable footprint chart | [Footprint Chart](./footprint-chart.md) |
| Configure all indicators | [Built-in Indicators](./indicators.md) |
| Add drawing tools | [Drawing Tools](./drawings.md) |
| Integrate with React/Vue/Svelte | [Framework Integration](../examples/framework-integration.md) |
