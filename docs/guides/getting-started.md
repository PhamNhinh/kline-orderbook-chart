# Getting Started

## Requirements

- Node.js 18+ (for npm install)
- Modern browser (Chrome 80+, Firefox 79+, Safari 15.2+)
- A valid MRD Chart Engine license key

## Installation

```bash
npm install @mrd/chart-engine
```

## Basic Setup

### 1. Add a canvas element

```html
<div id="chart-wrapper" style="width: 100%; height: 500px;">
  <canvas id="chart"></canvas>
</div>
```

### 2. Initialize the chart

```javascript
import { MrdChart } from '@mrd/chart-engine'

const chart = await MrdChart.create(document.getElementById('chart'), {
  licenseKey: 'MRD-STD-XXXXXXXX-20270101-XXXXXX',
  theme: 'dark',
  precision: 2,
})
```

### 3. Load data

MRD Chart Engine expects OHLCV data as an array of objects or a typed array:

```javascript
// Object format
chart.setKlines([
  { t: 1710000000, o: 65200, h: 65800, l: 65100, c: 65600, v: 1234.5 },
  { t: 1710003600, o: 65600, h: 66100, l: 65400, c: 65900, v: 987.2 },
  // ...
])
```

| Field | Type | Description |
|-------|------|-------------|
| `t` | `number` | Unix timestamp (seconds) |
| `o` | `number` | Open price |
| `h` | `number` | High price |
| `l` | `number` | Low price |
| `c` | `number` | Close price |
| `v` | `number` | Volume |

### 4. Start the render loop

```javascript
chart.start()
```

### 5. Real-time updates

```javascript
// Update the current (last) candle
chart.updateLastKline({ t: 1710003600, o: 65600, h: 66200, l: 65400, c: 66100, v: 1050.3 })

// Append a new candle
chart.appendKline({ t: 1710007200, o: 66100, h: 66500, l: 65900, c: 66300, v: 876.1 })
```

### 6. Clean up

```javascript
// When unmounting your component / leaving the page
chart.destroy()
```

---

## Next Steps

- [Indicator Guide](./indicators.md) — Enable RSI, OI, CVD, footprint, heatmap
- [Drawing Tools](./drawings.md) — Trendline, Fibonacci, channel, and more
- [Theming](./themes.md) — Customize colors, fonts, dark/light mode
- [API Reference](../api/README.md) — Full method documentation
- [Framework Examples](../examples/) — React, Vue, Svelte integration
