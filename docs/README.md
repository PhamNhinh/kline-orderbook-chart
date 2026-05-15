# Kline Orderbook Chart — Documentation

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs](https://mrd-indicators.com/docs)** — this Markdown mirror is kept for offline / GitHub browsing.


Welcome to the official documentation for **Kline Orderbook Chart**, the only chart library that combines candlestick charts with real-time orderbook heatmap, footprint chart, and liquidation heatmap — all in a single `<canvas>`.

---

## Tutorials

| # | Guide | Description |
|---|---|---|
| 1 | [Getting Started](guides/getting-started.md) | Installation, creating your first chart, loading data, starting the render loop |
| 2 | [Core Concepts & Architecture](guides/architecture.md) | Architecture overview, native engine, command buffer pipeline, responsibility model |
| 3 | [Framework Integration](examples/framework-integration.md) | Complete examples for React, Vue 3, Svelte, Vanilla JS with SSR handling |

## Data & Chart Types

| # | Guide | Description |
|---|---|---|
| 4 | [Candlestick Data](guides/data.md) | OHLCV data format, real-time updates, append/prepend, chart types |
| 5 | [Orderbook Heatmap](guides/orderbook-heatmap.md) | Depth matrix setup, real-time streaming, range configuration, prefetch |
| 6 | [Footprint Chart](guides/footprint-chart.md) | Trade stream ingestion, display modes, delta histogram, signals |
| 7 | [Chart Aggregation](guides/chart-aggregation.md) | Renko, Range, and Tick chart construction from OHLCV data |

## Indicators & Analysis

| # | Guide | Description |
|---|---|---|
| 8 | [Built-in Indicators](guides/indicators.md) | All 14+ indicators — RSI, CVD, OI, Funding Rate, VRVP, TPO, VPIN, Smart Ranges, EMA Structure |
| 9 | [Custom Indicators](guides/custom-indicators.md) | Plugin API with `compute` + `render`, engine-backed drawing primitives |

## Drawing & Interaction

| # | Guide | Description |
|---|---|---|
| 10 | [Drawing Tools](guides/drawings.md) | All 10+ tools, programmatic creation, styling, JSON serialization |
| 11 | [Events & Tooltips](guides/tooltip.md) | Tooltip callback, drawing events, hover hit tests, crosshair data |
| 12 | [Viewport & Interaction](guides/viewport-interaction.md) | Pan, zoom, pinch gestures, bar replay, crosshair sync, Y-axis scaling |

## Configuration

| # | Guide | Description |
|---|---|---|
| 13 | [Theming](guides/themes.md) | Dark/light mode, framework theme synchronization |
| 14 | [Advanced Topics](guides/advanced.md) | Iceberg detection, licensing, performance optimization, memory management |

## Reference

| Resource | Description |
|---|---|
| [API Reference](api/README.md) | Complete method & event documentation |
| [React Integration](examples/react.md) | Hooks, resize, WebSocket |
| [Vue 3 Integration](examples/vue.md) | Composables, theme switching |
| [Svelte Integration](examples/framework-integration.md#svelte) | SvelteKit setup |
| [Performance Guide](guides/performance.md) | Benchmarks, memory profile, optimization best practices |

## Quick Links

- **I want to display a basic candlestick chart** → [Getting Started](guides/getting-started.md)
- **I want to add an orderbook heatmap behind candles** → [Orderbook Heatmap](guides/orderbook-heatmap.md)
- **I want to show a footprint chart** → [Footprint Chart](guides/footprint-chart.md)
- **I want to enable RSI / CVD / Volume indicators** → [Built-in Indicators](guides/indicators.md)
- **I want to build my own custom indicator** → [Custom Indicators](guides/custom-indicators.md)
- **I want to add drawing tools (Fibonacci, trendlines)** → [Drawing Tools](guides/drawings.md)
- **I want to integrate with React / Vue / Svelte** → [Framework Integration](examples/framework-integration.md)
- **I want to detect iceberg orders** → [Advanced Topics](guides/advanced.md#iceberg-order-detection)
- **I want to build Renko / Range / Tick charts** → [Chart Aggregation](guides/chart-aggregation.md)

---

- [Live Demo](https://app.mrd-indicators.com/trading/chart-terminal) — Full-featured demo with real market data
- [npm Package](https://www.npmjs.com/package/kline-orderbook-chart)
- [GitHub Repository](https://github.com/PhamNhinh/kline-orderbook-chart)
- [Discord Community](https://discord.gg/buX2h5ZZm)
- [Contact Sales](mailto:support@mrd-indicators.com)
