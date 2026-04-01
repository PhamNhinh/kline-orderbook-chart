# React Integration

## Basic Setup

```bash
npm install @mrd/chart-engine
```

```jsx
import { useEffect, useRef } from 'react'
import { MrdChart } from '@mrd/chart-engine'

export function TradingChart({ symbol, klines, theme = 'dark' }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    let mounted = true

    MrdChart.create(canvasRef.current, {
      licenseKey: process.env.REACT_APP_MRD_KEY,
      theme,
      precision: symbol.includes('BTC') ? 1 : 2,
    }).then(chart => {
      if (!mounted) { chart.destroy(); return }
      chartRef.current = chart
      chart.setKlines(klines)
      chart.indicators.enable('volume')
      chart.start()
    })

    return () => {
      mounted = false
      chartRef.current?.destroy()
    }
  }, [symbol])

  // Update theme reactively
  useEffect(() => {
    chartRef.current?.setTheme(theme)
  }, [theme])

  // Update data reactively
  useEffect(() => {
    chartRef.current?.setKlines(klines)
  }, [klines])

  // Handle resize
  useEffect(() => {
    const observer = new ResizeObserver(() => chartRef.current?.resize())
    observer.observe(canvasRef.current.parentElement)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
```

## With Real-time WebSocket

```jsx
import { useEffect, useRef, useCallback } from 'react'
import { MrdChart } from '@mrd/chart-engine'

export function LiveChart({ symbol }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    let chart, ws

    async function init() {
      chart = await MrdChart.create(canvasRef.current, {
        licenseKey: process.env.REACT_APP_MRD_KEY,
        theme: 'dark',
      })
      chartRef.current = chart

      const res = await fetch(`/api/klines?symbol=${symbol}&limit=500`)
      chart.setKlines(await res.json())

      chart.indicators.enable('rsi', { period: 14, showSignals: true })
      chart.indicators.enable('volume', { showClimax: true })
      chart.start()

      ws = new WebSocket(`wss://stream.example.com/${symbol}@kline_5m`)
      ws.onmessage = (msg) => {
        const kline = JSON.parse(msg.data)
        chart.updateLastKline(kline)
      }
    }

    init()
    return () => {
      ws?.close()
      chart?.destroy()
    }
  }, [symbol])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}
```

## Custom Hook

```jsx
import { useRef, useEffect, useState } from 'react'
import { MrdChart } from '@mrd/chart-engine'

export function useMrdChart(canvasRef, options) {
  const chartRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    MrdChart.create(canvasRef.current, options).then(chart => {
      chartRef.current = chart
      setReady(true)
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
      setReady(false)
    }
  }, [canvasRef.current])

  return { chart: chartRef, ready }
}
```
