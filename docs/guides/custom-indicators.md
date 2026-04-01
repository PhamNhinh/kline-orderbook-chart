# Custom Indicators (Plugin API)

Build your own indicators using the plugin system. Custom indicators render through the same native pipeline as built-in indicators — pixel-perfect alignment, consistent performance, and automatic viewport synchronization.

## How it works

1. You register an indicator with a `compute` function and a `render` function
2. When kline data changes, the engine calls `compute` with OHLCV data and your parameters
3. On each frame, the engine calls `render` with a drawing API and the computed results
4. All drawing commands are dispatched through the native command buffer — not Canvas2D overlay

## Quick example: SMA (Simple Moving Average)

```javascript
const id = chart.addIndicator({
  name: 'SMA 20',
  params: { period: 20, color: '#e8a04a', lineWidth: 1.5 },

  compute(ohlcv, params) {
    const sma = []
    const { close } = ohlcv
    for (let i = 0; i < close.length; i++) {
      if (i < params.period - 1) { sma.push(NaN); continue }
      let sum = 0
      for (let j = i - params.period + 1; j <= i; j++) sum += close[j]
      sma.push(sum / params.period)
    }
    return { sma }
  },

  render(draw, computed) {
    draw.seriesLine(computed.sma, this.params.color, this.params.lineWidth)
  },
})
```

## Indicator lifecycle

### Register

```javascript
const id = chart.addIndicator({
  name: 'My Indicator',        // display name
  params: { period: 14 },      // your custom parameters
  compute(ohlcv, params) {},    // computation logic
  render(draw, computed) {},    // drawing logic
})
```

### Update parameters

```javascript
chart.updateIndicatorParams(id, { period: 50 })
```

This triggers a recomputation on the next frame.

### Enable / Disable

```javascript
chart.setIndicatorEnabled(id, false)   // hide without removing
chart.setIndicatorEnabled(id, true)    // show again
```

### Remove

```javascript
chart.removeIndicator(id)
```

### List all

```javascript
const indicators = chart.listIndicators()
// [{ id: 1, name: 'SMA 20', params: { period: 20, ... }, enabled: true }]
```

---

## The `compute` function

Called automatically when kline data changes. Receives:

| Parameter | Type | Description |
|---|---|---|
| `ohlcv` | `object` | Contains `timestamps`, `open`, `high`, `low`, `close`, `volume` arrays and `length` |
| `params` | `object` | Your indicator's current parameters |

Returns an object with computed data (any shape you want). This object is passed to `render`.

```javascript
compute(ohlcv, params) {
  const { close, high, low, length } = ohlcv

  // Access individual candles
  for (let i = 0; i < length; i++) {
    const c = close[i]
    const h = high[i]
    const l = low[i]
  }

  // Return computed data for render
  return { myLine: [...], mySignals: [...] }
}
```

### OHLCV data object

```javascript
{
  timestamps: number[],   // unix timestamps (seconds)
  open: number[],
  high: number[],
  low: number[],
  close: number[],
  volume: number[],
  length: number,         // array length
}
```

---

## The `render` function

Called on every frame. Receives a `draw` API and the object returned by `compute`.

Inside render, `this` refers to the indicator object, so you can access `this.params`.

```javascript
render(draw, computed, ohlcv) {
  // draw.seriesLine, draw.marker, draw.hline, etc.
  // `ohlcv` is also available if needed
}
```

---

## Drawing API reference

### Series (data-aligned)

These methods draw data aligned to kline timestamps. Array values correspond to candle indices.

| Method | Description |
|---|---|
| `draw.seriesLine(values, color?, lineWidth?)` | Smooth polyline. `NaN` = gap. |
| `draw.seriesDashedLine(values, color?, lineWidth?, dash?, gap?)` | Dashed polyline |
| `draw.band(upper, lower, fillColor?)` | Filled area between two series |

```javascript
draw.seriesLine(sma, '#e8a04a', 1.5)
draw.seriesDashedLine(signal, '#ffffff66', 1, 4, 4)
draw.band(bbUpper, bbLower, 'rgba(100,149,237,0.08)')
```

### Horizontal lines

| Method | Description |
|---|---|
| `draw.hline(price, color?, lineWidth?)` | Solid horizontal line |
| `draw.dashedHline(price, color?, lineWidth?, dash?, gap?)` | Dashed horizontal line |

```javascript
draw.hline(70, '#ff4757', 1)              // RSI overbought
draw.dashedHline(30, '#26a69a', 1, 6, 4)  // RSI oversold
```

### Markers (at candle index + price)

| Method | Description |
|---|---|
| `draw.marker(index, price, color?, radius?)` | Circle marker |
| `draw.markerUp(index, price, color?, size?)` | Up-triangle (buy signal) |
| `draw.markerDown(index, price, color?, size?)` | Down-triangle (sell signal) |

```javascript
draw.markerUp(i, ohlcv.low[i], '#26a69a', 5)    // buy signal below candle
draw.markerDown(i, ohlcv.high[i], '#ef5350', 5)  // sell signal above candle
```

### Text

| Method | Description |
|---|---|
| `draw.text(index, price, text, color?, fontSize?, align?)` | Text at candle index + price |
| `draw.priceLabel(price, text, color?, fontSize?)` | Label at the right price axis |

```javascript
draw.text(i, price, 'BUY', '#26a69a', 10, 'center')
draw.priceLabel(65000, 'Support', '#e8a04a', 10)
```

### Low-level (screen pixel coordinates)

For custom layouts that don't align to candle data:

| Method | Description |
|---|---|
| `draw.linePx(x1, y1, x2, y2, color, lineWidth?)` | Line in pixels |
| `draw.fillRectPx(x, y, w, h, color)` | Filled rectangle in pixels |
| `draw.strokeRectPx(x, y, w, h, color, lineWidth?)` | Stroked rectangle in pixels |
| `draw.textPx(x, y, text, color, fontSize?, align?)` | Text in pixels |

### Coordinate conversion

| Method | Description |
|---|---|
| `draw.worldToScreenX(timestamp)` | Convert timestamp → screen X pixel |
| `draw.worldToScreenY(price)` | Convert price → screen Y pixel |
| `draw.screenToWorldX(px)` | Convert screen X → timestamp |
| `draw.screenToWorldY(py)` | Convert screen Y → price |
| `draw.chartArea()` | Returns `{ x, y, w, h }` of the chart drawing area |

---

## Color format

Colors accept these formats:

```javascript
'#ff9800'                 // hex RGB
'#ff980080'               // hex RGBA
'rgba(255, 152, 0, 0.5)'  // CSS rgba
'rgb(255, 152, 0)'        // CSS rgb (fully opaque)
```

---

## Full examples

### Bollinger Bands

```javascript
chart.addIndicator({
  name: 'Bollinger Bands',
  params: { period: 20, stdDev: 2, color: '#6366f1' },

  compute(ohlcv, params) {
    const { close, length } = ohlcv
    const mid = [], upper = [], lower = []

    for (let i = 0; i < length; i++) {
      if (i < params.period - 1) {
        mid.push(NaN); upper.push(NaN); lower.push(NaN)
        continue
      }
      let sum = 0
      for (let j = i - params.period + 1; j <= i; j++) sum += close[j]
      const avg = sum / params.period

      let variance = 0
      for (let j = i - params.period + 1; j <= i; j++) variance += (close[j] - avg) ** 2
      const std = Math.sqrt(variance / params.period)

      mid.push(avg)
      upper.push(avg + params.stdDev * std)
      lower.push(avg - params.stdDev * std)
    }
    return { mid, upper, lower }
  },

  render(draw, computed) {
    const { color } = this.params
    draw.band(computed.upper, computed.lower, color + '15')
    draw.seriesLine(computed.upper, color + '80', 1)
    draw.seriesLine(computed.lower, color + '80', 1)
    draw.seriesLine(computed.mid, color, 1.5)
  },
})
```

### RSI with signals

```javascript
chart.addIndicator({
  name: 'Custom RSI',
  params: { period: 14, overbought: 70, oversold: 30 },

  compute(ohlcv, params) {
    const { close, length } = ohlcv
    const rsi = []
    let gains = 0, losses = 0

    for (let i = 0; i < length; i++) {
      if (i === 0) { rsi.push(NaN); continue }
      const change = close[i] - close[i - 1]
      if (i <= params.period) {
        if (change > 0) gains += change; else losses -= change
        if (i === params.period) {
          gains /= params.period; losses /= params.period
          rsi.push(100 - 100 / (1 + gains / (losses || 1e-10)))
        } else { rsi.push(NaN) }
      } else {
        gains = (gains * (params.period - 1) + Math.max(change, 0)) / params.period
        losses = (losses * (params.period - 1) + Math.max(-change, 0)) / params.period
        rsi.push(100 - 100 / (1 + gains / (losses || 1e-10)))
      }
    }

    const signals = []
    for (let i = 1; i < length; i++) {
      if (rsi[i - 1] > params.overbought && rsi[i] <= params.overbought) {
        signals.push({ index: i, type: 'sell' })
      } else if (rsi[i - 1] < params.oversold && rsi[i] >= params.oversold) {
        signals.push({ index: i, type: 'buy' })
      }
    }
    return { rsi, signals }
  },

  render(draw, computed, ohlcv) {
    draw.dashedHline(this.params.overbought, '#ff475766', 1, 6, 4)
    draw.dashedHline(this.params.oversold, '#26a69a66', 1, 6, 4)

    for (const s of computed.signals) {
      if (s.type === 'buy') {
        draw.markerUp(s.index, ohlcv.low[s.index], '#26a69a', 6)
      } else {
        draw.markerDown(s.index, ohlcv.high[s.index], '#ef5350', 6)
      }
    }
  },
})
```

### EMA Crossover

```javascript
chart.addIndicator({
  name: 'EMA Cross',
  params: { fast: 9, slow: 21 },

  compute(ohlcv, params) {
    const { close } = ohlcv
    const fast = ema(close, params.fast)
    const slow = ema(close, params.slow)

    const crosses = []
    for (let i = 1; i < close.length; i++) {
      if (fast[i - 1] <= slow[i - 1] && fast[i] > slow[i]) {
        crosses.push({ index: i, type: 'bullish' })
      } else if (fast[i - 1] >= slow[i - 1] && fast[i] < slow[i]) {
        crosses.push({ index: i, type: 'bearish' })
      }
    }
    return { fast, slow, crosses }
  },

  render(draw, computed, ohlcv) {
    draw.seriesLine(computed.fast, '#26a69a', 1.5)
    draw.seriesLine(computed.slow, '#ef5350', 1.5)

    for (const c of computed.crosses) {
      const price = ohlcv.close[c.index]
      if (c.type === 'bullish') {
        draw.markerUp(c.index, ohlcv.low[c.index] * 0.999, '#26a69a', 6)
      } else {
        draw.markerDown(c.index, ohlcv.high[c.index] * 1.001, '#ef5350', 6)
      }
    }
  },
})

function ema(data, period) {
  const k = 2 / (period + 1)
  const result = [data[0]]
  for (let i = 1; i < data.length; i++) {
    result.push(data[i] * k + result[i - 1] * (1 - k))
  }
  return result
}
```

### Custom watermark / info panel

Use screen-coordinate primitives for UI overlays:

```javascript
chart.addIndicator({
  name: 'Info Panel',
  params: {},
  compute() { return {} },

  render(draw, _, ohlcv) {
    const { x, y } = draw.chartArea()
    const last = ohlcv.close[ohlcv.length - 1]
    const first = ohlcv.close[0]
    const change = ((last - first) / first * 100).toFixed(2)

    draw.fillRectPx(x + 10, y + 10, 140, 50, 'rgba(0,0,0,0.5)')
    draw.textPx(x + 20, y + 30, `Price: ${last.toFixed(2)}`, '#e8eaed', 12, 'left')
    draw.textPx(x + 20, y + 48, `Change: ${change}%`, change >= 0 ? '#26a69a' : '#ef5350', 11, 'left')
  },
})
```

---

## Tips

- **Return `NaN` for gaps** — The series methods skip `NaN` values, creating gaps in the line.
- **Use `this.params`** — Access your parameters in `render` via `this.params` instead of hardcoding values.
- **Avoid heavy computation in `render`** — `compute` is only called when data changes; `render` is called every frame. Keep `render` fast.
- **Multiple indicators** — Register as many as you need. They all render through the same native pipeline.
- **Colors with alpha** — Use `#rrggbbaa` format or `rgba()` for semi-transparent overlays.

---

## Next steps

- [Indicators](indicators.md) — Built-in indicators
- [Drawing Tools](drawings.md) — Interactive drawing tools
- [API Reference](../api/README.md) — Full method documentation
