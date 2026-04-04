<h1 align="center">@mrd/chart-engine</h1>

<p align="center">
  <strong>Candlestick chart with built-in orderbook heatmap, footprint chart, and liquidation heatmap.<br/>Native high-performance engine. 60 fps. Zero dependencies.</strong>
</p>

<p align="center">
  <a href="https://app.mrd-indicators.com/trading/chart-terminal">Live Demo</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/PhamNhinh/kline-orderbook-chart/tree/main/docs">Documentation</a>
  &nbsp;·&nbsp;
  <a href="https://app.mrd-indicators.com/charting-library/pricing">Pricing</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/buX2h5ZZm">Discord</a>
</p>

<p align="center">
  <img alt="bundle" src="https://img.shields.io/badge/bundle-380KB_gzip-0a7cff" />
  <img alt="zero dependencies" src="https://img.shields.io/badge/dependencies-0-brightgreen" />
  <img alt="framework agnostic" src="https://img.shields.io/badge/framework-agnostic-blueviolet" />
  <img alt="license" src="https://img.shields.io/badge/license-commercial-orange" />
</p>

---

## Install

```bash
npm install @mrd/chart-engine
```

---

## Quick Start

```javascript
import { createChartBridge, prefetchWasm } from '@mrd/chart-engine'

prefetchWasm()

const chart = await createChartBridge(document.getElementById('chart'), {
  licenseKey: 'MRD-XXXX-XXXX-XXXX-20270101',
  theme: 'dark',
  precision: 2,
  intervalSec: 3600,
})

const len = rawKlines.length
const timestamps = new Float64Array(rawKlines.map(k => k[0] / 1000))
const open       = new Float64Array(rawKlines.map(k => +k[1]))
const high       = new Float64Array(rawKlines.map(k => +k[2]))
const low        = new Float64Array(rawKlines.map(k => +k[3]))
const close      = new Float64Array(rawKlines.map(k => +k[4]))
const volume     = new Float64Array(rawKlines.map(k => +k[5]))

chart.setKlines(timestamps, open, high, low, close, volume)

chart.enableVolume(true)
chart.enableRsi(true, 14)
chart.enableCvd(true)

chart.start()

ws.onmessage = (e) => {
  const { k } = JSON.parse(e.data)
  if (k.x) chart.appendKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
  else      chart.updateLastKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
}

new ResizeObserver(() => chart.resize()).observe(canvas.parentElement)

chart.destroy()
```

---

## Real-time Demo (Recommended)

The [`demo/`](./demo) directory contains a **full-featured real-time demo** with live market data from Binance Futures and Bybit Linear.

| Feature | Description |
|---------|-------------|
| Orderbook Heatmap | L2 depth aggregated into price-bucketed time columns |
| Candlestick + Footprint | 1m klines with bid/ask volume per price level |
| RSI, Volume, Open Interest | Built-in indicator panels with toggle controls |
| Drawing Tools | 13 tools — trendline, fib, channel, long/short, VWAP, etc. |
| Heatmap Intensity Slider | Adjustable colormap range |
| Multi-Exchange | Binance Futures + Bybit Linear, 5 symbols each |

```bash
cd demo
npm install
cd server && npm install && cd ..
npm start
```

Open **http://localhost:5180** — see [demo/README.md](./demo/README.md) for full documentation.

---

## Orderbook Heatmap

```javascript
chart.setHeatmap(matrix, rows, cols, xStart, xStep, yStart, yStep)
chart.enableHeatmap(true)
chart.appendHeatmapColumn(colData, colTimestamp, yStart, yStep)
chart.updateLastHeatmapColumn(colData, yStart, yStep)
```

---

## Footprint Chart

```javascript
chart.setChartType(2)
chart.setFootprintTickSize(10)
chart.footprintEnsureLen(timestamps.length)
chart.footprintAddTradeBatch(flat)
```

---

## Drawing Tools

```javascript
chart.setDrawingTool('fibonacci')

chart.getDrawingsJson()
chart.setDrawingsJson(json)

chart.onDrawingComplete = (id, type, points) => { /* persist */ }
```

---

## Features

| | Standard | Professional | Enterprise |
|---|:---:|:---:|:---:|
| Candlestick + Volume | ✓ | ✓ | ✓ |
| RSI + EMA | ✓ | ✓ | ✓ |
| 5 drawing tools | ✓ | ✓ | ✓ |
| All 10+ drawing tools | — | ✓ | ✓ |
| Orderbook Heatmap | — | ✓ | ✓ |
| Footprint Chart | — | ✓ | ✓ |
| Liquidation Heatmap | — | ✓ | ✓ |
| OI / CVD / Funding Rate | — | ✓ | ✓ |
| Large Trade Bubbles | — | ✓ | ✓ |
| VRVP / TPO | — | — | ✓ |
| Smart Money Concepts | — | — | ✓ |
| VPIN / Stops & Icebergs | — | — | ✓ |
| Custom Indicator Plugin | — | — | ✓ |
| White-label | — | — | ✓ |

[View full pricing →](https://app.mrd-indicators.com/charting-library/pricing)

---

## Browser Support

Chrome 80+ · Firefox 79+ · Safari 15.2+ · Edge 80+ · Mobile Chrome · Mobile Safari

---

## Documentation

[Getting Started](./docs/guides/getting-started.md) · [API Reference](./docs/api/README.md) · [Data Guide](./docs/guides/data.md) · [Indicators](./docs/guides/indicators.md) · [Drawings](./docs/guides/drawings.md) · [Heatmap](./docs/guides/orderbook-heatmap.md) · [Footprint](./docs/guides/footprint-chart.md) · [Themes](./docs/guides/themes.md) · [Architecture](./docs/guides/architecture.md)

---

## License

Commercial software. A valid license key is required for production use.  
**14-day free trial available** — [get a trial key](https://app.mrd-indicators.com/charting-library/pricing).

---

<p align="center">
  <sub>© 2026 MRD Technologies · <a href="https://app.mrd-indicators.com">app.mrd-indicators.com</a> · <a href="https://discord.gg/buX2h5ZZm">Discord</a></sub>
</p>
