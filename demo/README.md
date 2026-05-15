# Kline Orderbook Chart — Real-time Multi-Exchange Demo

A production-grade demo application showcasing **[kline-orderbook-chart](https://www.npmjs.com/package/kline-orderbook-chart)** with live market data from Binance Futures and Bybit Linear.

> **📖 Looking for the full docs?** Read them at **[mrd-indicators.com/docs/getting-started](https://mrd-indicators.com/docs/getting-started)** — install, lifecycle, data loading, footprint, orderbook heatmap, indicators, drawing tools, and framework integrations.

## What This Demo Shows

| Feature | Description |
|---------|-------------|
| **Orderbook Heatmap** | L2 depth aggregated into price-bucketed time columns, ~6 updates/sec |
| **Candlestick Chart** | 1m klines, 1500 bars historical backfill + real-time |
| **Footprint Chart** | aggTrade stream split into bid/ask volume per price level |
| **RSI Indicator** | 14-period RSI with signals, divergence, traps, EMA overlay |
| **Open Interest** | Historical 5m OI aligned to kline bars + real-time polling |
| **Volume Indicator** | Per-bar volume with bull/bear coloring |
| **AlphaTrend (custom)** | Plain-JS custom indicator template — toggled via the **ALPHA** button |
| **Drawing Tools** | 13 tools — trendline, fib, channel, long/short, VWAP, freehand, etc. |
| **Heatmap Intensity** | Adjustable colormap range via top slider bar |
| **Multi-Exchange** | Binance Futures + Bybit Linear, 5 symbols each |

## Architecture

```
┌──────────────┐   WebSocket    ┌───────────────┐   WebSocket    ┌──────────────┐
│  Binance /   │ ◄──────────── │  Demo Server   │ ─────────────► │  Vue 3 App   │
│  Bybit APIs  │  aggTrade     │  Node.js :4400 │  kline, trade  │  + Native    │
│              │  depth@100ms  │                │  heatmap, oi   │  Chart Engine│
│              │  kline_1m     │                │                │              │
└──────────────┘               └───────────────┘                └──────────────┘
```

**Server** connects to exchange WebSocket streams, maintains a local orderbook, aggregates depth into heatmap columns, polls OI every 5s, and broadcasts everything to connected clients.

**Client** receives data via WebSocket, feeds it into the native chart engine using RAF-batched calls for optimal rendering performance.

## Quick Start

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Start both server and frontend
npm start
```

Open **http://localhost:5180** in your browser.

Or start them separately:

```bash
node server/index.js    # Data server on ws://localhost:4400
npm run dev             # Vue frontend on http://localhost:5180
```

## Project Structure

```
demo/
├── server/
│   ├── index.js              # WebSocket server + heatmap aggregation
│   ├── exchanges/
│   │   ├── binance.js        # Binance Futures adapter (REST + WS)
│   │   └── bybit.js          # Bybit Linear adapter (REST + WS)
│   └── package.json
├── src/
│   ├── App.vue               # Root component, event wiring
│   ├── main.js               # Vue entry point
│   ├── composables/
│   │   ├── useChart.js       # Chart engine bridge wrapper
│   │   └── useMarketData.js  # WebSocket client to demo server
│   ├── indicators/
│   │   └── alphaTrend.js     # Custom indicator example — copy this as
│   │                         #   the starting template for your own
│   └── components/
│       ├── ChartView.vue     # Canvas wrapper + resize observer
│       ├── ControlBar.vue    # Exchange/symbol/chart type/indicator controls
│       ├── DrawingToolbar.vue# Drawing tool buttons (13 tools)
│       └── HeatmapSlider.vue # Heatmap intensity range slider
├── index.html
├── vite.config.js
└── package.json
```

## Writing your own indicator

This demo ships **AlphaTrend** as a reference — a complete custom
indicator written in ~150 lines of plain JS. It's a good template
to copy when you want to add your own analysis on top of the chart.

| File | What it shows |
|---|---|
| [`src/indicators/alphaTrend.js`](./src/indicators/alphaTrend.js) | The `compute` + `render` plugin shape using only public API (`draw.seriesLine`, `draw.markerUp`, `draw.markerDown`, `draw.priceLabel`) |
| [`src/composables/useChart.js`](./src/composables/useChart.js) | How to register the indicator on `bridge.addIndicator(...)` and toggle visibility with `bridge.setIndicatorEnabled(id, on)` |
| [`src/components/ControlBar.vue`](./src/components/ControlBar.vue) | The **ALPHA** toggle button wired into the demo UI |

Full reference for every `draw.*` helper, lifecycle of `compute`,
parameter hot-reloading, and performance tips lives in
[`docs/guides/custom-indicators.md`](../docs/guides/custom-indicators.md).

## Supported Exchanges & Symbols

| Exchange | Type | Symbols |
|----------|------|---------|
| **Binance** | Futures (USDT-M) | BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, XRPUSDT |
| **Bybit** | Linear (USDT) | BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, XRPUSDT |

## Configuration

**Server** (`server/index.js`):
- `EXCHANGES` — add/remove exchanges and symbols
- `getTickSize()` — price bucketing resolution per symbol
- `MAX_HEATMAP_ROWS` / `HEATMAP_PAD_ROWS` — heatmap matrix size
- OI poll interval (default 5s)

**Client** (`src/composables/useChart.js`):
- `_candleSec` — candle interval (default 60s)
- RSI parameters (period, smoothing, signals)
- Drawing tool color styles (`DRAWING_STYLES`)

## Tech Stack

- **Chart Engine**: kline-orderbook-chart (native-speed engine, Canvas 2D)
- **Frontend**: Vue 3 + Vite
- **Server**: Node.js + ws (WebSocket)
- **Data Sources**: Binance/Bybit public WebSocket + REST APIs

## License

This demo is provided as a reference implementation for `kline-orderbook-chart` integration. The chart engine itself requires a license key — the demo runs in 14-day watermarked trial mode (`licenseKey: 'trial'`). Get a real key at [mrd-indicators.com](https://app.mrd-indicators.com/charting-library/pricing).
