# Getting Started

This guide walks you through installing the library, creating your first chart, loading candle data, and enabling indicators.

## Requirements

- **Node.js 18+** (for npm install and bundlers)
- **Modern browser**: Chrome 80+, Firefox 79+, Safari 15.2+, Edge 80+
- A `<canvas>` element in your page

## Installation

```bash
npm install kline-orderbook-chart
```

## Step 1 — Add a canvas

The chart renders everything into a single `<canvas>`. Place it inside a container that defines the chart's dimensions:

```html
<div id="chart-container" style="width: 100%; height: 600px;">
  <canvas id="chart"></canvas>
</div>
```

Style the canvas to fill its parent:

```css
#chart {
  width: 100%;
  height: 100%;
  display: block;
}
```

## Step 2 — Initialize the chart

```javascript
import { createChartBridge, prefetchWasm } from 'kline-orderbook-chart'

// Optional: start loading the engine immediately for faster first render
prefetchWasm()

const canvas = document.getElementById('chart')
const chart = await createChartBridge(canvas, {
  licenseKey: 'YOUR_LICENSE_KEY',   // omit or pass 'trial' for 14-day trial
})
```

| Option | Type | Default | Description |
|---|---|---|---|
| `licenseKey` | `string` | `'trial'` | License key. Omit for trial mode (14-day, with watermark). |

`createChartBridge` returns a Promise that resolves once the engine is loaded and the canvas is sized.

## Step 3 — Load candle data

The chart expects OHLCV data as **six separate arrays** — timestamps, opens, highs, lows, closes, and volumes:

```javascript
const timestamps = [1710000000, 1710003600, 1710007200]
const opens      = [65200, 65600, 66100]
const highs      = [65800, 66100, 66500]
const lows       = [65100, 65400, 65900]
const closes     = [65600, 65900, 66300]
const volumes    = [1234.5, 987.2, 876.1]

chart.setKlines(timestamps, opens, highs, lows, closes, volumes)
chart.setCandleInterval(3600)   // candle interval in seconds (1h)
chart.setPrecision(1)           // price decimal places
```

> **Tip:** If your data comes as an array of objects `[{t, o, h, l, c, v}, ...]`, decompose it before passing:
>
> ```javascript
> function feedKlines(chart, klines) {
>   chart.setKlines(
>     klines.map(k => k.t),
>     klines.map(k => k.o),
>     klines.map(k => k.h),
>     klines.map(k => k.l),
>     klines.map(k => k.c),
>     klines.map(k => k.v),
>   )
> }
> ```

## Step 4 — Start rendering

```javascript
chart.enableVolume()   // show volume histogram
chart.start()          // begin the render loop
```

The chart is now visible and interactive — you can pan, zoom, and use the crosshair.

## Step 5 — Real-time updates

Feed live candle data as it arrives from your WebSocket:

```javascript
// Update the current (still-open) candle
chart.updateLastKline(timestamp, open, high, low, close, volume)

// When a new candle opens
chart.appendKline(timestamp, open, high, low, close, volume)
```

See the [Real-Time Data](real-time-data.md) guide for a complete Binance WebSocket example.

## Step 6 — Clean up

Always destroy the chart when your component unmounts or the page unloads:

```javascript
chart.destroy()
```

This stops the render loop, removes event listeners, and frees engine memory.

## Complete example

```javascript
import { createChartBridge, prefetchWasm } from 'kline-orderbook-chart'

prefetchWasm()

async function init() {
  const chart = await createChartBridge(document.getElementById('chart'))

  // Fetch historical data
  const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=1000')
  const raw = await res.json()

  chart.setKlines(
    raw.map(k => Math.floor(k[0] / 1000)),
    raw.map(k => +k[1]),
    raw.map(k => +k[2]),
    raw.map(k => +k[3]),
    raw.map(k => +k[4]),
    raw.map(k => +k[5]),
  )
  chart.setCandleInterval(300)
  chart.setPrecision(1)
  chart.enableVolume()
  chart.start()

  // Handle resize
  window.addEventListener('resize', () => chart.resize())
}

init()
```

---

## Next steps

- [Real-Time Data](real-time-data.md) — Binance WebSocket integration
- [Orderbook Heatmap](orderbook-heatmap.md) — Render depth data behind candles
- [Indicators](indicators.md) — RSI, OI, CVD, VRVP, and more
- [Drawing Tools](drawings.md) — Interactive trendlines, Fibonacci, channels
- [Themes](themes.md) — Dark/light mode switching
- [API Reference](../api/README.md) — Full method documentation
