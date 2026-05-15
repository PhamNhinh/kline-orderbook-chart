# Custom Indicators

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/indicators](https://mrd-indicators.com/docs/indicators)** — this Markdown mirror is kept for offline / GitHub browsing.


The Custom Indicator API lets you create your own indicators with a `compute` + `render` plugin interface. Custom indicators render through the native command buffer pipeline — the same path as built-in indicators — ensuring pixel-perfect alignment and consistent performance.

**Plan requirement:** Enterprise.

---

## How It Works

A custom indicator has two phases:

1. **`compute(ohlcv, params)`** — receives OHLCV data and parameters, returns computed values (e.g. SMA values, signal points). Runs once when data changes.

2. **`render(draw, computed, ohlcv)`** — receives an engine-backed drawing API and the computed values. Called every frame.

```
  Data changes → compute() → cached result
                                   │
  Each frame  → render(draw, cached) → native command buffer → Canvas 2D
```

---

## Quick Start: Simple Moving Average

```javascript
const smaId = chart.addIndicator({
  name: 'SMA 20',
  params: { period: 20, color: '#e8a04a', lineWidth: 1.5 },

  compute(ohlcv, params) {
    const { close } = ohlcv
    const sma = new Array(close.length)
    for (let i = 0; i < close.length; i++) {
      if (i < params.period - 1) {
        sma[i] = NaN
        continue
      }
      let sum = 0
      for (let j = i - params.period + 1; j <= i; j++) sum += close[j]
      sma[i] = sum / params.period
    }
    return { sma }
  },

  render(draw, computed) {
    draw.seriesLine(computed.sma, this.params.color, this.params.lineWidth)
  },
})
```

---

## API

### `chart.addIndicator(config)` → `number | null`

Registers a new custom indicator. Returns an integer ID, or `null` if the feature is gated.

| Property | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | No | Display name (default: "Custom N") |
| `params` | `object` | No | Key-value parameters accessible via `this.params` in render |
| `compute` | `function` | No | `(ohlcv, params) → object` — computation function |
| `render` | `function` | **Yes** | `(draw, computed, ohlcv) → void` — rendering function |

### `chart.removeIndicator(id)`

Unregisters and removes a custom indicator.

```javascript
chart.removeIndicator(smaId)
```

### `chart.updateIndicatorParams(id, params)`

Updates the parameter object and triggers recomputation.

```javascript
chart.updateIndicatorParams(smaId, { period: 50 })   // change SMA to 50
chart.updateIndicatorParams(smaId, { color: '#26a69a' })   // change color
```

### `chart.setIndicatorEnabled(id, enabled)`

Toggles visibility without removing the indicator.

```javascript
chart.setIndicatorEnabled(smaId, false)   // hide
chart.setIndicatorEnabled(smaId, true)    // show
```

### `chart.listIndicators()` → `Array`

Returns all registered custom indicators.

```javascript
const indicators = chart.listIndicators()
// → [{ id: 1, name: 'SMA 20', params: { period: 20, ... }, enabled: true }]
```

### `chart.invalidateCustomIndicators()`

Forces recomputation of all custom indicators on the next frame.

```javascript
chart.invalidateCustomIndicators()
```

---

## The `compute` Function

```typescript
compute(ohlcv: OHLCV, params: object): object
```

### `ohlcv` Parameter

| Property | Type | Description |
|---|---|---|
| `timestamps` | `number[]` | Unix timestamps (seconds) |
| `open` | `number[]` | Open prices |
| `high` | `number[]` | High prices |
| `low` | `number[]` | Low prices |
| `close` | `number[]` | Close prices |
| `volume` | `number[]` | Volume |
| `length` | `number` | Number of candles |

### When `compute` Runs

- After `setKlines()` (data replaced)
- After `appendKline()` (new candle)
- After `updateLastKline()` (last close changes)
- After `updateIndicatorParams()` (params changed)
- After `invalidateCustomIndicators()`

The result is **cached** and reused across frames until data changes.

### Return Value

Return any object — its properties will be passed to `render` as the second argument.

```javascript
compute(ohlcv, params) {
  return {
    sma: [...],
    signals: [...],
    level: 67500,
  }
}
```

---

## The `render` Function

```typescript
render(draw: DrawAPI, computed: object, ohlcv: OHLCV): void
```

The `render` function is called **every frame** when the indicator is enabled. Inside `render`, `this` refers to the indicator object — use `this.params` to access parameters.

The `draw` object provides engine-backed drawing primitives.

---

## Drawing API (`draw`)

### Series Drawing

#### `draw.seriesLine(series, color?, lineWidth?)`

Draw a data series as a smooth polyline aligned to kline timestamps. `NaN` values create gaps.

```javascript
draw.seriesLine(computed.sma, '#e8a04a', 1.5)
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `series` | `number[]` | — | Values aligned to kline indices |
| `color` | `string` | `'#ffffff99'` | CSS color: `'#rrggbb'`, `'#rrggbbaa'`, `'rgba(r,g,b,a)'` |
| `lineWidth` | `number` | `1.5` | Line width in pixels |

#### `draw.seriesDashedLine(series, color?, lineWidth?, dash?, gap?)`

Dashed variant of `seriesLine`.

```javascript
draw.seriesDashedLine(computed.signal, '#ffffff66', 1, 4, 4)
```

#### `draw.band(upper, lower, fillColor?)`

Filled band between two series (e.g. Bollinger Bands, Keltner Channel).

```javascript
draw.band(computed.upperBB, computed.lowerBB, 'rgba(100, 149, 237, 0.08)')
```

### Horizontal Lines

#### `draw.hline(price, color?, lineWidth?)`

Horizontal line across the entire chart at a price level.

```javascript
draw.hline(67500, '#ffffff66', 1)
```

#### `draw.dashedHline(price, color?, lineWidth?, dash?, gap?)`

Dashed horizontal line.

```javascript
draw.dashedHline(67500, '#ffffff66', 1, 6, 4)
```

### Point Markers

#### `draw.marker(index, price, color?, radius?)`

Circle marker at a candle index and price.

```javascript
draw.marker(42, 67500, '#e8a04a', 3)
```

#### `draw.markerUp(index, price, color?, size?)`

Up-triangle marker (buy signal).

```javascript
draw.markerUp(42, 67200, '#26a69a', 5)
```

#### `draw.markerDown(index, price, color?, size?)`

Down-triangle marker (sell signal).

```javascript
draw.markerDown(42, 68100, '#ef5350', 5)
```

### Text

#### `draw.text(index, price, text, color?, fontSize?, align?)`

Text at a candle index and price level.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `index` | `number` | — | Candle index (0-based) |
| `price` | `number` | — | Price level |
| `text` | `string` | — | Text content |
| `color` | `string` | `'#ffffffaa'` | Text color |
| `fontSize` | `number` | `10` | Font size in pixels |
| `align` | `string` | `'center'` | `'left'`, `'center'`, `'right'` |

```javascript
draw.text(42, 67500, 'Buy', '#26a69a', 10, 'center')
```

#### `draw.priceLabel(price, text, color?, fontSize?)`

Text label on the right edge of the chart (price axis area).

```javascript
draw.priceLabel(67500, 'SMA(20)', '#e8a04a', 10)
```

### Screen-Coordinate Primitives

For low-level drawing in pixel coordinates:

#### `draw.linePx(x1, y1, x2, y2, color, lineWidth?)`

```javascript
draw.linePx(100, 200, 400, 200, '#ffffff66', 1)
```

#### `draw.fillRectPx(x, y, w, h, color)`

```javascript
draw.fillRectPx(100, 200, 50, 20, 'rgba(255, 255, 255, 0.1)')
```

#### `draw.strokeRectPx(x, y, w, h, color, lineWidth?)`

```javascript
draw.strokeRectPx(100, 200, 50, 20, '#ffffff66', 1)
```

#### `draw.textPx(x, y, text, color, fontSize?, align?)`

```javascript
draw.textPx(100, 200, 'Label', '#ffffffaa', 10, 'left')
```

### Coordinate Helpers

#### `draw.worldToScreenX(worldX)` → `number`

#### `draw.worldToScreenY(worldY)` → `number`

#### `draw.screenToWorldX(screenX)` → `number`

#### `draw.screenToWorldY(screenY)` → `number`

Convert between world (timestamp/price) and screen (pixel) coordinates.

```javascript
const sx = draw.worldToScreenX(1710000000)
const sy = draw.worldToScreenY(67500)
```

#### `draw.chartArea()` → `{ x, y, w, h }`

Returns the pixel bounds of the chart plotting area (excluding axes).

```javascript
const area = draw.chartArea()
// → { x: 0, y: 0, w: 800, h: 500 }
```

---

## Complete Examples

### Bollinger Bands

```javascript
chart.addIndicator({
  name: 'Bollinger Bands',
  params: { period: 20, multiplier: 2, color: '#6495ED' },

  compute(ohlcv, params) {
    const { close } = ohlcv
    const len = close.length
    const middle = new Array(len)
    const upper = new Array(len)
    const lower = new Array(len)

    for (let i = 0; i < len; i++) {
      if (i < params.period - 1) {
        middle[i] = upper[i] = lower[i] = NaN
        continue
      }
      let sum = 0, sumSq = 0
      for (let j = i - params.period + 1; j <= i; j++) {
        sum += close[j]
        sumSq += close[j] * close[j]
      }
      const mean = sum / params.period
      const std = Math.sqrt(sumSq / params.period - mean * mean)
      middle[i] = mean
      upper[i] = mean + params.multiplier * std
      lower[i] = mean - params.multiplier * std
    }
    return { middle, upper, lower }
  },

  render(draw, computed) {
    const color = this.params.color
    draw.band(computed.upper, computed.lower, color + '14')
    draw.seriesLine(computed.upper, color + '66', 1)
    draw.seriesLine(computed.lower, color + '66', 1)
    draw.seriesLine(computed.middle, color, 1.5)
  },
})
```

### EMA Crossover Signals

```javascript
chart.addIndicator({
  name: 'EMA Cross',
  params: { fast: 9, slow: 21 },

  compute(ohlcv, params) {
    const { close } = ohlcv
    const fastEma = ema(close, params.fast)
    const slowEma = ema(close, params.slow)
    const buySignals = []
    const sellSignals = []

    for (let i = 1; i < close.length; i++) {
      if (fastEma[i - 1] <= slowEma[i - 1] && fastEma[i] > slowEma[i]) {
        buySignals.push(i)
      }
      if (fastEma[i - 1] >= slowEma[i - 1] && fastEma[i] < slowEma[i]) {
        sellSignals.push(i)
      }
    }
    return { fastEma, slowEma, buySignals, sellSignals }
  },

  render(draw, computed, ohlcv) {
    draw.seriesLine(computed.fastEma, '#26a69a', 1.5)
    draw.seriesLine(computed.slowEma, '#ef5350', 1.5)

    for (const i of computed.buySignals) {
      draw.markerUp(i, ohlcv.low[i], '#26a69a', 6)
    }
    for (const i of computed.sellSignals) {
      draw.markerDown(i, ohlcv.high[i], '#ef5350', 6)
    }
  },
})

function ema(data, period) {
  const k = 2 / (period + 1)
  const result = new Array(data.length)
  result[0] = data[0]
  for (let i = 1; i < data.length; i++) {
    result[i] = data[i] * k + result[i - 1] * (1 - k)
  }
  return result
}
```

### Custom Dashboard Panel

```javascript
chart.addIndicator({
  name: 'Stats Panel',
  params: {},

  compute(ohlcv) {
    const c = ohlcv.close
    const len = c.length
    const last = c[len - 1]
    const change24h = len > 24 ? ((last - c[len - 25]) / c[len - 25] * 100).toFixed(2) : '—'
    const high24h = len > 24 ? Math.max(...c.slice(-24)) : last
    const low24h = len > 24 ? Math.min(...c.slice(-24)) : last
    return { last, change24h, high24h, low24h }
  },

  render(draw, computed) {
    const area = draw.chartArea()
    const x = area.x + 10
    let y = area.y + 20

    draw.fillRectPx(x - 5, y - 15, 160, 70, 'rgba(0,0,0,0.5)')
    draw.textPx(x, y, `Last: ${computed.last.toFixed(2)}`, '#ffffffcc', 11, 'left')
    y += 16
    draw.textPx(x, y, `24h: ${computed.change24h}%`, '#ffffffaa', 10, 'left')
    y += 16
    draw.textPx(x, y, `H: ${computed.high24h.toFixed(2)}`, '#26a69a', 10, 'left')
    y += 16
    draw.textPx(x, y, `L: ${computed.low24h.toFixed(2)}`, '#ef5350', 10, 'left')
  },
})
```

---

## Performance Tips

| Tip | Why |
|---|---|
| Keep `compute` fast | It blocks the main thread. Use typed arrays for math. |
| Cache expensive calculations | Return object is cached until data changes. |
| Minimize `draw` calls in `render` | Each call writes to the native command buffer. |
| Use `NaN` for gaps | `seriesLine` skips NaN values efficiently. |
| Avoid DOM access in `render` | `render` is called every frame — keep it pure. |

---

## Next Steps

| Topic | Link |
|---|---|
| Handle events & tooltips | [Events & Tooltips](./tooltip.md) |
| All built-in indicators | [Built-in Indicators](./indicators.md) |
| Drawing tools | [Drawing Tools](./drawings.md) |
