# React Integration

This guide shows how to use Kline Orderbook Chart in a React application with proper lifecycle management.

## Installation

```bash
npm install kline-orderbook-chart
```

## Basic setup

```jsx
import { useEffect, useRef } from 'react'
import { createChartBridge, prefetchWasm } from 'kline-orderbook-chart'

prefetchWasm()

export function Chart({ licenseKey }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    let destroyed = false

    async function init() {
      const chart = await createChartBridge(canvasRef.current, {
        licenseKey,
      })
      if (destroyed) { chart.destroy(); return }

      chartRef.current = chart
      chart.enableVolume()
      chart.start()
    }

    init()

    return () => {
      destroyed = true
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [licenseKey])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}
```

## Loading data

```jsx
export function Chart({ symbol, interval, licenseKey }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    let destroyed = false

    async function init() {
      const chart = await createChartBridge(canvasRef.current, { licenseKey })
      if (destroyed) { chart.destroy(); return }
      chartRef.current = chart

      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`
      )
      const raw = await res.json()

      chart.setKlines(
        raw.map(k => Math.floor(k[0] / 1000)),
        raw.map(k => +k[1]),
        raw.map(k => +k[2]),
        raw.map(k => +k[3]),
        raw.map(k => +k[4]),
        raw.map(k => +k[5]),
      )

      const lastTs = Math.floor(raw[raw.length - 1][0] / 1000)
      chart.setCandleInterval(intervalToSeconds(interval))
      chart.setPrecision(1)
      chart.enableVolume()
      chart.start()

      // WebSocket for real-time updates
      const stream = `${symbol.toLowerCase()}@kline_${interval}`
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`)
      wsRef.current = ws

      let currentTs = lastTs
      ws.onmessage = (e) => {
        const { k } = JSON.parse(e.data)
        const ts = Math.floor(k.t / 1000)
        if (ts > currentTs) {
          chart.appendKline(ts, +k.o, +k.h, +k.l, +k.c, +k.v)
          currentTs = ts
        } else {
          chart.updateLastKline(ts, +k.o, +k.h, +k.l, +k.c, +k.v)
        }
      }
    }

    init()

    return () => {
      destroyed = true
      wsRef.current?.close()
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [symbol, interval, licenseKey])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

function intervalToSeconds(interval) {
  const map = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400, '1d': 86400 }
  return map[interval] || 300
}
```

## Handling resize

```jsx
import { useEffect, useRef, useCallback } from 'react'

export function Chart({ licenseKey }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const handleResize = useCallback(() => {
    chartRef.current?.resize()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // ... init and cleanup same as above

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}
```

## Using `ResizeObserver` for container resize

If your chart container can resize independently of the window (e.g., sidebar toggle, split pane):

```jsx
useEffect(() => {
  const container = canvasRef.current?.parentElement
  if (!container) return

  const observer = new ResizeObserver(() => {
    chartRef.current?.resize()
  })
  observer.observe(container)

  return () => observer.disconnect()
}, [])
```

## Theme switching

```jsx
export function Chart({ theme, licenseKey }) {
  const chartRef = useRef(null)

  useEffect(() => {
    chartRef.current?.setTheme(theme)
  }, [theme])

  // ... init

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}
```

## Drawing tools toolbar

```jsx
function DrawingToolbar({ chart }) {
  const tools = [
    { id: 'trendline', label: 'Trendline' },
    { id: 'hline', label: 'H-Line' },
    { id: 'fib', label: 'Fibonacci' },
    { id: 'arrow', label: 'Arrow' },
  ]

  return (
    <div className="toolbar">
      {tools.map(t => (
        <button key={t.id} onClick={() => chart.startDrawing(t.id)}>
          {t.label}
        </button>
      ))}
      <button onClick={() => chart.cancelDrawing()}>Cancel</button>
      <button onClick={() => chart.clearDrawings()}>Clear All</button>
    </div>
  )
}
```

## Custom hook

```jsx
import { useEffect, useRef, useState } from 'react'
import { createChartBridge, prefetchWasm } from 'kline-orderbook-chart'

prefetchWasm()

export function useChart(canvasRef, options = {}) {
  const chartRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    let destroyed = false

    createChartBridge(canvasRef.current, options).then((chart) => {
      if (destroyed) { chart.destroy(); return }
      chartRef.current = chart
      chart.start()
      setReady(true)
    })

    return () => {
      destroyed = true
      chartRef.current?.destroy()
      chartRef.current = null
      setReady(false)
    }
  }, [canvasRef.current, options.licenseKey])

  return { chart: chartRef.current, ready }
}
```

Usage:

```jsx
function MyChart() {
  const canvasRef = useRef(null)
  const { chart, ready } = useChart(canvasRef, { licenseKey: 'YOUR_KEY' })

  useEffect(() => {
    if (!ready) return
    chart.setKlines(timestamps, opens, highs, lows, closes, volumes)
    chart.enableVolume()
  }, [ready])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '600px' }} />
}
```

---

## Next steps

- [Vue Integration](vue.md) — Vue 3 Composition API
- [Getting Started](../guides/getting-started.md) — Core concepts
- [API Reference](../api/README.md) — Full method list
