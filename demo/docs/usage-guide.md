# Demo Usage Guide

This guide walks through setting up and using the MRD Chart Engine real-time demo application.

## Prerequisites

- **Node.js** 18+ (for the data server)
- **npm** 9+ (for dependency management)
- Internet connection (to reach Binance/Bybit public APIs)

## Installation

```bash
cd demo

# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

## Running the Demo

### Option A: Single command

```bash
npm start
```

This starts both the data server (`ws://localhost:4400`) and the Vue dev server (`http://localhost:5180`) using `concurrently`.

### Option B: Separate terminals

Terminal 1 — Data server:

```bash
node server/index.js
```

Terminal 2 — Frontend:

```bash
npm run dev
```

Open **http://localhost:5180** in your browser.

## UI Overview

### Control Bar (top)

The top bar provides:

- **Exchange selector** — Switch between Binance Futures and Bybit Linear
- **Symbol selector** — Choose from BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, XRPUSDT
- **Chart type** — Toggle between Candlestick and Footprint modes
- **Indicator toggles** — Enable/disable Volume (VOL), RSI, and Open Interest (OI) panels
- **Live stats** — Trade count, depth update count, connection status

### Heatmap Slider (below control bar)

A horizontal bar to adjust the heatmap colormap sensitivity:

- Drag the slider **left** to increase contrast (highlight smaller orders)
- Drag the slider **right** to decrease contrast (only show large orders)
- The value and data range are displayed beside the slider
- See [Heatmap Slider Documentation](./heatmap-slider.md) for details

### Drawing Toolbar (left side)

A vertical toolbar with 13 drawing tools:

| Tool | Shortcut | Description |
|------|----------|-------------|
| Trendline | — | Draw a line between two price/time points |
| Horizontal Line | — | Draw an infinite horizontal line at a price level |
| Arrow | — | Directional arrow between two points |
| Fibonacci | — | Fibonacci retracement levels between two price points |
| Price Range | — | Measure price range between two points |
| Circle | — | Draw an ellipse around a price area |
| Channel | — | Parallel channel between two trendlines |
| Long Position | — | Annotate a long trade entry with TP/SL |
| Short Position | — | Annotate a short trade entry with TP/SL |
| Anchored VWAP | — | Volume-weighted average price from an anchor point |
| Freehand | — | Free-form brush drawing |
| Polyline | — | Multi-segment connected lines |
| Text Note | — | Place a text label on the chart |

**Keyboard shortcuts:**
- `Escape` — Cancel active drawing
- `Delete` / `Backspace` — Delete selected drawing

### Chart Area

The main chart canvas supports:

- **Mouse wheel** — Zoom in/out
- **Click + drag** — Pan left/right
- **Crosshair** — Follows the cursor with price/time readout

## Data Flow

### On Subscribe

1. Client sends `subscribe` with exchange + symbol
2. Server fetches 1500 historical klines via REST
3. Server fetches 500 historical OI data points (Binance only, 5m intervals)
4. Server sends `history` message with klines + OI + tick size
5. Client renders historical data and begins receiving real-time updates

### Real-time Updates

| Message Type | Source | Frequency | Client Action |
|-------------|--------|-----------|---------------|
| `kline` | Exchange WS | Per candle update | `appendKline` / `updateLastKline` |
| `trade` | Exchange WS | Per trade | RAF-batched `footprintAddTradeBatch` |
| `heatmap` | Server aggregation | ~6/sec (throttled) | `updateHeatmapColumnAt` |
| `heatmap_frozen` | Server aggregation | 1/min (on candle close) | `appendHeatmapColumn` |
| `oi` | REST polling | Every 5s | `setOiData` (update last bar) |

### Heatmap Aggregation

The server builds heatmap columns from live orderbook depth:

1. Depth updates arrive every 100ms from the exchange
2. Bid/ask prices are rounded to `tickSize` and grouped into buckets
3. Within each 1-minute candle window, the **maximum** quantity per price level is tracked
4. When a candle closes, the column is "frozen" and sent as `heatmap_frozen`
5. The current (forming) column is sent as `heatmap` at ~150ms throttle intervals
6. Price range is determined dynamically from actual orderbook data, with padding rows

## Troubleshooting

### Server won't start

- Ensure ports 4400 (WebSocket) and 5180 (Vite) are free
- Check Node.js version: `node --version` (must be 18+)
- Verify internet access to `fapi.binance.com` and `api.bybit.com`

### No data / chart is empty

- Check the browser console for WebSocket connection errors
- Verify the data server is running: `ws://localhost:4400`
- Try a different symbol — some may have lower liquidity

### Heatmap too sparse / too dense

- Adjust the heatmap slider to change colormap sensitivity
- The heatmap range auto-adjusts to actual orderbook depth
- Tick sizes in `server/index.js` (`getTickSize()`) control price bucket resolution

### OI shows flat line

- OI history is only available on Binance (API limitation)
- Bybit OI only has real-time polling, no historical backfill
- Wait a few minutes for real-time OI values to accumulate
