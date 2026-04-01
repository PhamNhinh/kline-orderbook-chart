# Footprint Chart

The footprint chart shows bid/ask volume at every price level within each candle. It includes delta coloring, imbalance detection, POC (Point of Control) highlighting, and a Volume Profile (VRVP) panel.

<p align="center">
  <img src="../../assets/media/footprint-chart.png" alt="Footprint chart with bid/ask volume" width="100%" />
</p>

## Enabling footprint mode

Switch the chart to footprint mode using `setChartType(1)`:

```javascript
chart.setChartType(1)    // 1 = Footprint mode
```

Switch back to normal candlestick mode:

```javascript
chart.setChartType(0)    // 0 = Candlestick mode
chart.footprintClear()   // clear footprint data
```

## Setting the tick size

The tick size determines the price increment for each footprint row. Choose a value appropriate for your instrument:

```javascript
chart.setFootprintTickSize(10)   // $10 per level (e.g., BTCUSDT)
```

A smaller tick size shows finer detail but requires more rows per candle.

### Dynamic tick size from ATR

For adaptive tick sizes, calculate from ATR (Average True Range):

```javascript
function calculateTickSize(highs, lows, closes, period = 14) {
  let atr = 0
  for (let i = closes.length - period; i < closes.length; i++) {
    const tr = Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1]))
    atr += tr
  }
  atr /= period

  const target = atr / 10
  const mag = Math.pow(10, Math.floor(Math.log10(target)))
  return Math.max(mag, Math.round(target / mag) * mag)
}

const tick = calculateTickSize(highs, lows, closes)
chart.setFootprintTickSize(tick)
```

## Feeding footprint data

### From real tick/trade data

If you have access to individual trades (e.g., from a WebSocket `aggTrade` stream):

```javascript
chart.footprintAddTrade(
  barIndex,        // candle index (0-based from the start of setKlines)
  price,           // trade price
  volume,          // trade volume
  isBuyerMaker,    // true if the buyer is the maker (sell market order)
)
```

### From aggregated bid/ask volume

If you already have aggregated bid/ask volume per price level for a candle, use `footprintSetBar()`:

```javascript
chart.footprintEnsureLen(barCount)   // ensure space for N bars

chart.footprintSetBar(
  barIndex,       // candle index
  tickSize,       // price increment per row
  prices,         // Float64Array — price levels
  bidVolumes,     // Float64Array — bid volume at each level
  askVolumes,     // Float64Array — ask volume at each level
)
```

### Building footprint from OHLCV (synthetic)

If you only have OHLCV data (no tick data), you can build an approximation by distributing volume across price levels:

```javascript
function buildFootprint(chart, klines, tick) {
  chart.setFootprintTickSize(tick)
  chart.footprintEnsureLen(klines.length)

  for (let i = 0; i < klines.length; i++) {
    const { o, h, l, c, v } = klines[i]
    const low = Math.floor(l / tick) * tick
    const high = Math.ceil(h / tick) * tick
    const n = Math.max(1, Math.round((high - low) / tick) + 1)

    const prices = new Float64Array(n)
    const bids = new Float64Array(n)
    const asks = new Float64Array(n)

    for (let j = 0; j < n; j++) {
      const p = low + j * tick
      prices[j] = p
      const share = v / n
      if (c >= o) {
        bids[j] = share * 0.6
        asks[j] = share * 0.4
      } else {
        bids[j] = share * 0.4
        asks[j] = share * 0.6
      }
    }

    chart.footprintSetBar(i, tick, prices, bids, asks)
  }
}
```

## Clearing footprint data

```javascript
chart.footprintClear()
```

## What the footprint shows

| Element | Description |
|---|---|
| **Bid volume** (left column) | Volume from limit buy orders at each price level |
| **Ask volume** (right column) | Volume from limit sell orders at each price level |
| **Delta** | Ask volume minus bid volume per level — positive = buying pressure |
| **POC** (Point of Control) | Price level with the highest total volume — highlighted |
| **Imbalance dots** | Levels where bid/ask ratio exceeds a threshold |
| **VRVP panel** | Volume profile on the right side of the chart |

---

## Next steps

- [Orderbook Heatmap](orderbook-heatmap.md) — Combine with heatmap for full depth view
- [Indicators](indicators.md) — Add RSI, OI, CVD overlays
- [API Reference](../api/README.md) — Complete footprint method docs
