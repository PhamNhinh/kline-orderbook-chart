# Real-Time Data

This guide shows how to connect the chart to a live data source using WebSocket. We use Binance as the example, but the pattern applies to any exchange API.

## Architecture

```
Exchange REST API ──→ setKlines()          (historical load)
Exchange WebSocket ──→ updateLastKline()   (tick-by-tick updates)
                   ──→ appendKline()       (new candle opens)
```

1. Fetch historical candles via REST to populate the chart
2. Connect a WebSocket for real-time kline updates
3. Call `updateLastKline()` on every tick, `appendKline()` when a new candle opens

## Binance REST — Load historical candles

```javascript
const REST = 'https://api.binance.com/api/v3'

async function fetchKlines(symbol, interval, limit = 1000) {
  const url = `${REST}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  const res = await fetch(url)
  const data = await res.json()

  return {
    timestamps: data.map(k => Math.floor(k[0] / 1000)),
    opens:      data.map(k => +k[1]),
    highs:      data.map(k => +k[2]),
    lows:       data.map(k => +k[3]),
    closes:     data.map(k => +k[4]),
    volumes:    data.map(k => +k[5]),
  }
}

const data = await fetchKlines('BTCUSDT', '5m', 1000)
chart.setKlines(data.timestamps, data.opens, data.highs, data.lows, data.closes, data.volumes)
chart.setCandleInterval(300)
chart.setPrecision(1)
chart.start()
```

### Paginated loading (10 000+ candles)

Binance returns a maximum of 1 000 candles per request. To load more, paginate backwards using the `endTime` parameter:

```javascript
async function fetchManyKlines(symbol, interval, total = 10000) {
  const batch = 1000
  let all = []
  let endTime = null

  while (all.length < total) {
    let url = `${REST}/klines?symbol=${symbol}&interval=${interval}&limit=${batch}`
    if (endTime) url += `&endTime=${endTime}`

    const res = await fetch(url)
    const data = await res.json()
    if (!data.length) break

    all = data.concat(all)           // prepend older candles
    endTime = data[0][0] - 1         // 1 ms before the earliest candle
    if (data.length < batch) break   // no more data available
  }

  return all.slice(-total)
}
```

## Binance WebSocket — Real-time updates

```javascript
const WS = 'wss://stream.binance.com:9443/ws'

let lastTimestamp = data.timestamps[data.timestamps.length - 1]

const ws = new WebSocket(`${WS}/btcusdt@kline_5m`)

ws.onmessage = (event) => {
  const { k } = JSON.parse(event.data)
  const ts = Math.floor(k.t / 1000)
  const o = +k.o, h = +k.h, l = +k.l, c = +k.c, v = +k.v

  if (ts > lastTimestamp) {
    chart.appendKline(ts, o, h, l, c, v)
    lastTimestamp = ts
  } else {
    chart.updateLastKline(ts, o, h, l, c, v)
  }
}
```

### Auto-reconnect

```javascript
function connect(symbol, interval) {
  const ws = new WebSocket(`${WS}/${symbol.toLowerCase()}@kline_${interval}`)

  ws.onclose = () => {
    setTimeout(() => connect(symbol, interval), 3000)
  }

  ws.onmessage = (event) => {
    // ... same handler as above
  }

  return ws
}
```

## Switching symbols / timeframes

When the user switches to a different symbol or timeframe:

1. Close the existing WebSocket
2. Fetch new historical data
3. Call `setKlines()` with the new data (replaces all existing candles)
4. Update `setCandleInterval()` and `setPrecision()`
5. Connect a new WebSocket

```javascript
async function loadSymbol(symbol, intervalSec, intervalStr) {
  ws?.close()

  const data = await fetchKlines(symbol, intervalStr, 10000)
  chart.setKlines(data.timestamps, data.opens, data.highs, data.lows, data.closes, data.volumes)
  chart.setCandleInterval(intervalSec)
  chart.setPrecision(detectPrecision(data.closes[data.closes.length - 1]))

  lastTimestamp = data.timestamps[data.timestamps.length - 1]
  ws = connect(symbol, intervalStr)
}
```

## Infinite scroll (prepend history)

Load older candles when the user scrolls to the left edge. Use `prependKlines()` to add data before the existing range:

```javascript
chart.prependKlines(olderTimestamps, olderOpens, olderHighs, olderLows, olderCloses, olderVolumes)
```

---

## Next steps

- [Getting Started](getting-started.md) — Basic setup
- [Orderbook Heatmap](orderbook-heatmap.md) — Stream depth data
- [Indicators](indicators.md) — Enable RSI, OI, CVD
- [API Reference](../api/README.md) — Full method documentation
