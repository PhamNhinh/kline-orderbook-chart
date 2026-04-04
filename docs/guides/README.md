# @mrd/chart-engine — Documentation

**Version 0.1.0** · [Live Demo](https://app.mrd-indicators.com/trading/chart-terminal) · [Pricing](https://app.mrd-indicators.com/charting-library/pricing) · [Discord](https://discord.gg/buX2h5ZZm)

---

## What is @mrd/chart-engine?

**@mrd/chart-engine** is a high-performance 2D charting library designed for financial trading applications. It renders candlestick charts, orderbook heatmaps, footprint charts, liquidation heatmaps, and 14+ technical indicators — all inside a single `<canvas>` element, powered by a native high-performance computation engine.

Unlike traditional JavaScript charting libraries, the entire computation pipeline — heatmap color mapping, indicator math, viewport transforms, hit testing — runs inside compiled native code. JavaScript only dispatches Canvas 2D draw calls from a binary command buffer, achieving 60 fps with 250,000+ heatmap cells, 10,000+ candles, and multiple indicators simultaneously.

### Key Characteristics

| Property | Value |
|---|---|
| **Rendering** | Canvas 2D (draw calls dispatched from native binary buffer) |
| **Engine** | Native compiled (high-performance binary module) |
| **Bundle size** | ~380 KB gzip (engine + JS bridge) |
| **Dependencies** | Zero runtime dependencies |
| **Framework** | Agnostic — works with React, Vue, Svelte, or Vanilla JS |
| **Browser support** | Chrome 80+, Firefox 79+, Safari 15.2+, Mobile Chrome/Safari |

---

## Table of Contents

### Tutorials

| # | Page | Description |
|---|---|---|
| 1 | [Getting Started](./getting-started.md) | Installation, creating your first chart, loading data, starting the render loop |
| 2 | [Core Concepts](./architecture.md) | Architecture overview, native engine, command buffer pipeline, responsibility model |
| 3 | [Framework Integration](../examples/framework-integration.md) | Complete examples for React, Vue 3, Svelte, Vanilla JS with SSR handling |

### Data & Chart Types

| # | Page | Description |
|---|---|---|
| 4 | [Candlestick Data](./data.md) | OHLCV data format, real-time updates, chart types (Candlestick, Heikin-Ashi, Line, Area) |
| 5 | [Orderbook Heatmap](./orderbook-heatmap.md) | Depth matrix setup, real-time streaming, range configuration, prefetch |
| 6 | [Footprint Chart](./footprint-chart.md) | Trade stream ingestion, display modes, delta histogram, signals |
| 7 | [Chart Aggregation](./chart-aggregation.md) | Renko, Range, and Tick chart construction from OHLCV data |

### Indicators & Analysis

| # | Page | Description |
|---|---|---|
| 8 | [Built-in Indicators](./indicators.md) | All 14+ indicators — RSI, CVD, OI, Funding Rate, VRVP, TPO, VPIN, EMA Structure, Smart Ranges, and more |
| 9 | [Custom Indicators](./custom-indicators.md) | Plugin API with `compute` + `render`, engine-backed drawing primitives, coordinate helpers |

### Drawing & Interaction

| # | Page | Description |
|---|---|---|
| 10 | [Drawing Tools](./drawings.md) | Trendline, Fibonacci, Elliott Wave, Positions, VWAP — creation, styling, serialization |
| 11 | [Events & Tooltips](./tooltip.md) | Tooltip callback, drawing events, hover hit tests, crosshair data |
| 12 | [Viewport & Interaction](./viewport-interaction.md) | Pan, zoom, pinch gestures, bar replay, crosshair sync, Y-axis scaling |

### Configuration

| # | Page | Description |
|---|---|---|
| 13 | [Theming](./themes.md) | Dark mode, light mode, framework theme synchronization |
| 14 | [Advanced Topics](./advanced.md) | Iceberg order detection, licensing, performance optimization, memory management |

---

## Quick Links

- **I want to display a basic candlestick chart** → [Getting Started](./getting-started.md)
- **I want to add an orderbook heatmap behind candles** → [Orderbook Heatmap](./orderbook-heatmap.md)
- **I want to show a footprint chart** → [Footprint Chart](./footprint-chart.md)
- **I want to enable RSI / CVD / Volume indicators** → [Built-in Indicators](./indicators.md)
- **I want to build my own custom indicator** → [Custom Indicators](./custom-indicators.md)
- **I want to add drawing tools (Fibonacci, trendlines)** → [Drawing Tools](./drawings.md)
- **I want to integrate with React / Vue / Svelte** → [Framework Integration](../examples/framework-integration.md)
- **I want to detect iceberg orders from orderbook data** → [Advanced Topics](./advanced.md#iceberg-order-detection)
- **I want to build Renko / Range / Tick charts** → [Chart Aggregation](./chart-aggregation.md)

---

## Licensing

@mrd/chart-engine is commercial software. A valid license key is required for production use.

| Plan | Key Features |
|---|---|
| **Standard** | Candlestick + Volume, RSI + EMA, 5 drawing tools |
| **Professional** | + Orderbook Heatmap, Footprint, Liquidation, OI, CVD, Funding Rate, Large Trades, all drawing tools |
| **Enterprise** | + VRVP, TPO, Smart Money Concepts, VPIN, Stops & Icebergs, Custom Indicator Plugin, white-label |

A **14-day free trial** is available with no credit card required. Trial builds render correctly but display a watermark.

[Request a trial key →](https://app.mrd-indicators.com/charting-library/pricing)
