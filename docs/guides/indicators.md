# Indicators

Kline Orderbook Chart includes 12+ professional indicators. All computations run inside the native engine for maximum performance — enabling multiple indicators adds negligible overhead.

## Pattern

Every indicator follows the same enable/disable pattern:

```javascript
chart.enableRsi()      // turn on
chart.disableRsi()     // turn off
```

Indicators that require external data (OI, CVD, Funding Rate, Large Trades) have a separate `set*Data()` method.

---

## Built-in Indicators

### Volume

Volume histogram rendered below the candles. Bars are colored by candle direction. Includes optional climax detection and moving average.

```javascript
chart.enableVolume()
chart.disableVolume()

chart.setVolumeMaPeriod(20)   // moving average overlay on volume bars
```

### RSI (Relative Strength Index)

Classic momentum oscillator rendered in a sub-pane. Supports overbought/oversold signals and divergence detection.

```javascript
chart.enableRsi()
chart.disableRsi()

chart.setRsiPeriod(14)
chart.setRsiShowSignals(true)      // show overbought/oversold markers
chart.setRsiShowDivergence(true)   // show divergence lines
```

### EMA Structure

Multi-period EMA (Exponential Moving Average) lines on the main chart, showing trend structure at multiple timeframes.

```javascript
chart.enableEmaStructure()
chart.disableEmaStructure()
```

### VRVP (Visible Range Volume Profile)

Horizontal volume profile for the visible price range, drawn as a panel on the right side. Computed automatically from loaded kline data.

```javascript
chart.enableVrvp()
chart.disableVrvp()
```

### TPO / Market Profile

Time-at-price distribution showing how long price spent at each level.

```javascript
chart.enableTpo()
chart.disableTpo()
```

### Smart Ranges (SMC)

Smart Money Concepts zones — order blocks, fair value gaps, and institutional ranges.

```javascript
chart.enableSmartRanges()
chart.disableSmartRanges()
```

---

## Data-Driven Indicators

These indicators require external data that you feed from your backend or exchange API.

### Open Interest

Open interest line in a sub-pane. Requires OI data as two parallel arrays:

```javascript
chart.enableOi()
chart.disableOi()

const timestamps = [1710000000, 1710003600, 1710007200]
const values     = [15000000, 15250000, 15100000]
chart.setOiDataTs(timestamps, values)
```

### CVD (Cumulative Volume Delta)

Shows cumulative buying vs selling pressure. Feed data from your trade aggregator:

```javascript
chart.enableCvd()
chart.disableCvd()

chart.setCvdData(timestamps, values)
```

### Funding Rate

Perpetual futures funding rate overlay.

```javascript
chart.enableFundingRate()
chart.disableFundingRate()

chart.setFundingRateData(timestamps, rates)
```

### Large Trades

Bubble visualization of large (whale) trades on the chart. Bubble size is proportional to trade volume.

```javascript
chart.enableLargeTrades()
chart.disableLargeTrades()

chart.addLargeTrade(timestamp, price, volume, isBuy)
chart.clearLargeTrades()
```

### Liquidation Heatmap

Estimated leveraged liquidation level clusters rendered as a heat overlay. Shows where cascading liquidations may trigger.

```javascript
chart.enableLiqHeatmap()
chart.disableLiqHeatmap()

chart.setLiqHeatmapData(matrix, rows, cols, xStart, xStep, yStart, yStep)
```

### Live Signals

Real-time trading signal overlay — shows buy/sell arrows with configurable logic.

```javascript
chart.enableLiveSignals()
chart.disableLiveSignals()
```

---

## Multiple indicators

Enable as many indicators as needed — the native engine handles them all efficiently:

```javascript
chart.enableVolume()
chart.enableRsi()
chart.setRsiPeriod(14)
chart.enableOi()
chart.setOiDataTs(oiTimestamps, oiValues)
chart.enableVrvp()
chart.enableEmaStructure()
chart.enableCvd()
chart.setCvdData(cvdTimestamps, cvdValues)
```

Even with 8 indicators active on 10K candles, rendering stays at **6,000+ fps** (see [Benchmarks](../../README.md#benchmark)).

---

## Indicator plan tiers

| Indicator | Standard | Professional | Enterprise |
|---|---|---|---|
| Volume | Yes | Yes | Yes |
| RSI | Yes | Yes | Yes |
| EMA Structure | Yes | Yes | Yes |
| Open Interest | — | Yes | Yes |
| CVD | — | Yes | Yes |
| Funding Rate | — | Yes | Yes |
| Large Trades | — | Yes | Yes |
| VRVP | — | Yes | Yes |
| TPO | — | Yes | Yes |
| Orderbook Heatmap | — | Yes | Yes |
| Footprint | — | Yes | Yes |
| Liquidation Heatmap | — | — | Yes |
| Live Signals | — | — | Yes |
| Smart Ranges (SMC) | — | — | Yes |

---

## Next steps

- [Orderbook Heatmap](orderbook-heatmap.md) — Depth matrix rendering
- [Footprint Chart](footprint-chart.md) — Bid/ask volume per level
- [Drawing Tools](drawings.md) — Trendline, Fibonacci, serialization
- [API Reference](../api/README.md) — Complete method signatures
