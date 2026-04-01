# Indicators

MRD Chart Engine includes 12+ professional indicators computed entirely in the native engine for maximum performance.

## Enabling Indicators

```javascript
chart.indicators.enable('rsi', { period: 14, showSignals: true })
chart.indicators.enable('volume')
```

## Disabling Indicators

```javascript
chart.indicators.disable('rsi')
```

## Updating Parameters

```javascript
chart.indicators.update('rsi', { period: 21 })
```

---

## Available Indicators

### Core (Standard tier)

| Indicator | ID | Parameters | Description |
|---|---|---|---|
| **Volume** | `volume` | `showClimax: bool` | Volume histogram with climax detection |
| **RSI** | `rsi` | `period: number, showSignals: bool, showDivergence: bool` | Relative Strength Index with signal overlays |
| **EMA Structure** | `ema` | `periods: number[]` | Multi-EMA trend structure |

### Crypto / Derivatives (Professional tier)

| Indicator | ID | Data Required | Description |
|---|---|---|---|
| **Open Interest** | `openInterest` | OI array | OI with delta tracking |
| **CVD** | `cvd` | Trade data | Cumulative Volume Delta |
| **Funding Rate** | `fundingRate` | Funding array | Perpetual funding overlay |
| **Large Trades** | `largeTrades` | Trade feed | Bubble visualization of whale orders |
| **VRVP** | `vrvp` | -- (computed from klines) | Visible Range Volume Profile |
| **TPO** | `tpo` | -- (computed from klines) | Market Profile / time-at-price |
| **Orderbook Heatmap** | `heatmap` | Depth matrix | Real-time orderbook depth visualization |
| **Footprint** | `footprint` | Tick data | Bid/ask volume at each price level |

### Enterprise tier

| Indicator | ID | Description |
|---|---|---|
| **Liquidation Heatmap** | `liqHeatmap` | Estimated liquidation level clusters |
| **Live Signals** | `liveSignals` | Real-time trading signal overlay |
| **Smart Ranges (SMC)** | `smartRanges` | Smart Money Concepts zones |

---

## Data-driven Indicators

Some indicators require external data feeds. Use the data API:

```javascript
// Open Interest
chart.indicators.setData('openInterest', [
  { t: 1710000000, value: 15000000, delta: 250000 },
  // ...
])

// CVD
chart.indicators.setData('cvd', {
  takerBuyVolume: [...],
  totalVolume: [...],
})

// Funding Rate
chart.indicators.setData('fundingRate', [
  { t: 1710000000, rate: 0.0001 },
  // ...
])

// Heatmap (orderbook depth matrix)
chart.setHeatmap({
  data: Float32Array,    // flattened row-major matrix
  rows: 200,             // price levels
  cols: 100,             // time columns
  priceMin: 64000,
  priceMax: 66000,
  timeStart: 1710000000,
  timeEnd: 1710050000,
})
```

---

## Custom Indicators (Plugin API)

Create your own indicators using the plugin system:

```javascript
chart.plugins.register('myVWAP', {
  pane: 'main',         // 'main' for overlay, 'sub' for separate pane
  params: {
    period: { default: 20, min: 1, max: 200 },
    color: { default: '#ff9800' },
  },
  compute(klines, params) {
    // Your calculation logic
    return {
      series: [{ time, value }],
      bands: [{ time, upper, lower }],
    }
  },
})
```

See [Custom Indicator Examples](../examples/custom-indicators.md) for full implementations.
