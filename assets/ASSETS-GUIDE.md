# Assets Guide

This document describes all image assets needed for the README and demo site.
Take screenshots from the actual running app to fill these.

## Required Images

### 1. `hero-banner.png` (1200 x 400)
Full-width banner showing the chart in action.
- **Content:** Dark theme chart with BTC/USDT, showing candlesticks + volume + a couple of indicators
- **Style:** Slight gradient overlay on edges, logo in top-left corner
- **Tip:** Take a screenshot of ChartTerminal with footprint + heatmap enabled, crop to 3:1 ratio

### 2. `demo-dark.png` (600 x 380)
Dark theme chart screenshot.
- **Content:** BTC/USDT chart with footprint bars, orderbook heatmap background, RSI panel below
- **Tip:** Enable footprint + heatmap + RSI, take screenshot of the chart area

### 3. `demo-light.png` (600 x 380)
Light theme chart screenshot.
- **Content:** Same view as demo-dark but in light theme
- **Tip:** Switch to light theme, keep same indicators enabled

### 4. `card-footprint.png` (400 x 225)
Close-up of footprint chart feature.
- **Content:** Zoomed in on footprint bars showing bid/ask volume, delta, imbalance dots, POC line
- **Aspect ratio:** 16:9

### 5. `card-heatmap.png` (400 x 225)
Close-up of orderbook heatmap.
- **Content:** Heatmap matrix behind candlesticks, showing depth visualization with color gradient
- **Aspect ratio:** 16:9

### 6. `card-indicators.png` (400 x 225)
Multiple indicators panel.
- **Content:** Chart showing RSI panel + OI panel + volume, demonstrating multi-pane layout
- **Aspect ratio:** 16:9

### 7. `card-drawings.png` (400 x 225)
Drawing tools showcase.
- **Content:** Chart with Fibonacci retracement + trendline + horizontal line drawn on it
- **Aspect ratio:** 16:9

### 8. `card-perf.png` (400 x 225)
Performance visualization.
- **Content:** Either a chart with 100K candles loaded smoothly, or a benchmark bar chart
- **Alternative:** Create this as a styled HTML/CSS performance comparison graphic

### 9. `card-frameworks.png` (400 x 225)
Framework logos.
- **Content:** Logos of React, Vue, Svelte, Angular, vanilla JS arranged in a clean grid
- **Alternative:** Create with CSS/SVG

## Screenshot Tips

1. Use **2x DPI** (Retina) for sharp images
2. Crop to exact dimensions listed above
3. Use the actual running app — real data looks much better than mock data
4. For dark theme images, ensure the background is `#0b0e14` (matches README)
5. Save as PNG with moderate compression (aim for < 500 KB per image)

## Demo Site Assets (in `demo/assets/`)

These are the same images but used by the demo page. Copy them there:
- `card-footprint.png`
- `card-heatmap.png`
- `card-indicators.png`
- `card-drawings.png`
- `card-perf.png`
- `card-frameworks.png`
