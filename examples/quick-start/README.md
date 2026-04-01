# Kline Orderbook Chart — Quick Start Demo

Run this project locally to see the chart engine in action.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What you'll see

- Candlestick chart with real-time simulated updates
- Toggle indicators: Volume, RSI, Open Interest, Footprint, Orderbook Heatmap
- Drawing tools: Trendline, Fibonacci, Channel
- Dark / Light theme switching
- Multiple symbols & timeframes

No API keys needed — uses synthetic sample data.

## Full live demo

For the complete experience with real market data and live orderbook streaming:

**https://app.mrd-indicators.com/trading/chart-terminal**

## Project structure

```
quick-start/
├── lib/                          # Pre-built chart engine (do not modify)
│   ├── mrd-chart-engine.mjs      # Library bundle
│   ├── chart_engine.js           # WebAssembly glue
│   ├── chart_engine_bg.wasm      # WebAssembly binary
│   └── index.d.ts                # TypeScript declarations
├── src/
│   ├── main.js                   # Demo app code
│   └── sample-data.js            # Synthetic data generators
├── index.html
├── vite.config.js
└── package.json
```

## License

Runs in trial mode (14-day, with watermark). Purchase a license key for production use.
