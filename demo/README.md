# MRD Chart Engine — Real-time Multi-Exchange Demo

A production-grade demo application showcasing **@mrd/chart-engine** with live market data from Binance Futures and Bybit Linear.

## What This Demo Shows

| Feature | Description |
|---------|-------------|
| **Orderbook Heatmap** | L2 depth aggregated into price-bucketed time columns, ~6 updates/sec |
| **Candlestick Chart** | 1m klines, 1500 bars historical backfill + real-time |
| **Footprint Chart** | aggTrade stream split into bid/ask volume per price level |
| **RSI Indicator** | 14-period RSI with signals, divergence, traps, EMA overlay |
| **Open Interest** | Historical 5m OI aligned to kline bars + real-time polling |
| **Volume Indicator** | Per-bar volume with bull/bear coloring |
| **Drawing Tools** | 13 tools — trendline, fib, channel, long/short, VWAP, freehand, etc. |
| **Heatmap Intensity** | Adjustable colormap range via top slider bar |
| **Multi-Exchange** | Binance Futures + Bybit Linear, 5 symbols each |

## Architecture

```
┌──────────────┐   WebSocket    ┌───────────────┐   WebSocket    ┌──────────────┐
│  Binance /   │ ◄──────────── │  Demo Server   │ ─────────────► │  Vue 3 App   │
│  Bybit APIs  │  aggTrade     │  Node.js :4400 │  kline, trade  │  + WASM      │
│              │  depth@100ms  │                │  heatmap, oi   │  Chart Engine│
│              │  kline_1m     │                │                │              │
└──────────────┘               └───────────────┘                └──────────────┘
```

**Server** connects to exchange WebSocket streams, maintains a local orderbook, aggregates depth into heatmap columns, polls OI every 5s, and broadcasts everything to connected clients.

**Client** receives data via WebSocket, feeds it into the WASM chart engine using RAF-batched calls for optimal rendering performance.

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
│   └── components/
│       ├── ChartView.vue     # Canvas wrapper + resize observer
│       ├── ControlBar.vue    # Exchange/symbol/chart type/indicator controls
│       ├── DrawingToolbar.vue# Drawing tool buttons (13 tools)
│       └── HeatmapSlider.vue # Heatmap intensity range slider
├── index.html
├── vite.config.js
└── package.json
```

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

- **Chart Engine**: @mrd/chart-engine (Rust → WASM → Canvas 2D)
- **Frontend**: Vue 3 + Vite
- **Server**: Node.js + ws (WebSocket)
- **Data Sources**: Binance/Bybit public WebSocket + REST APIs

## License

This demo is provided as a reference implementation for @mrd/chart-engine integration. The chart engine itself requires a license key.
