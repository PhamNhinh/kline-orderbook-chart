# Framework Integration

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/react-integration](https://mrd-indicators.com/docs/react-integration)** — this Markdown mirror is kept for offline / GitHub browsing.


Complete integration examples for React, Vue 3, Svelte, and Vanilla JS — including SSR handling, responsive resize, real-time WebSocket updates, and proper lifecycle management.

---

## React

### Basic Component

```jsx
import { useEffect, useRef } from 'react'
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

// Prefetch at module level — runs once when the module is imported
prefetchEngine()

export function CandlestickChart({ klines, licenseKey, theme = 'dark' }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  // Initialize chart
  useEffect(() => {
    let chart
    let ro

    async function init() {
      chart = await createChartBridge(canvasRef.current, { licenseKey })
      chartRef.current = chart

      chart.setTheme(theme)
      chart.setPrecision(2)
      chart.setCandleInterval(3600)

      const { timestamps, open, high, low, close, volume } = klines
      chart.setKlines(timestamps, open, high, low, close, volume)
      chart.enableVolume()
      chart.start()

      // Responsive resize
      ro = new ResizeObserver(() => chart?.resize())
      ro.observe(canvasRef.current.parentElement)
    }

    init()

    // Pause when tab hidden
    const onVisibility = () =>
      document.hidden ? chartRef.current?.pause() : chartRef.current?.resume()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      ro?.disconnect()
      chart?.destroy()
      chartRef.current = null
    }
  }, [licenseKey])   // recreate only if license changes

  // Sync theme
  useEffect(() => {
    chartRef.current?.setTheme(theme)
  }, [theme])

  // Sync kline data
  useEffect(() => {
    if (!chartRef.current || !klines) return
    const { timestamps, open, high, low, close, volume } = klines
    chartRef.current.setKlines(timestamps, open, high, low, close, volume)
  }, [klines])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
```

### With Real-time WebSocket

```jsx
import { useEffect, useRef, useCallback } from 'react'
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

prefetchEngine()

export function LiveChart({ symbol, interval, licenseKey }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)
  const wsRef     = useRef(null)

  useEffect(() => {
    let chart
    let ro

    async function init() {
      chart = await createChartBridge(canvasRef.current, { licenseKey })
      chartRef.current = chart
      chart.setTheme('dark')
      chart.setPrecision(2)

      // Load historical data
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`
      )
      const raw = await res.json()
      chart.setKlines(
        new Float64Array(raw.map(k => k[0] / 1000)),
        new Float64Array(raw.map(k => +k[1])),
        new Float64Array(raw.map(k => +k[2])),
        new Float64Array(raw.map(k => +k[3])),
        new Float64Array(raw.map(k => +k[4])),
        new Float64Array(raw.map(k => +k[5])),
      )
      chart.enableVolume()
      chart.enableRsi()
      chart.setRsiPeriod(14)
      chart.start()

      ro = new ResizeObserver(() => chart?.resize())
      ro.observe(canvasRef.current.parentElement)

      // WebSocket for live updates
      const ws = new WebSocket(
        `wss://stream.binance.com/ws/${symbol.toLowerCase()}@kline_${interval}`
      )
      wsRef.current = ws

      ws.onmessage = (e) => {
        const { k } = JSON.parse(e.data)
        if (k.x) {
          chart.appendKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
        } else {
          chart.updateLastKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
        }
      }
    }

    init()

    const onVisibility = () =>
      document.hidden ? chartRef.current?.pause() : chartRef.current?.resume()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      ro?.disconnect()
      wsRef.current?.close()
      chart?.destroy()
      chartRef.current = null
    }
  }, [symbol, interval, licenseKey])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
```

### Next.js (SSR)

The native engine module cannot run server-side. Use dynamic import with `ssr: false`:

```jsx
// components/Chart.jsx (client-only)
'use client'

import { useEffect, useRef } from 'react'

export default function Chart({ klines }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let chart

    async function init() {
      // Dynamic import ensures the engine only loads in the browser
      const { createChartBridge, prefetchEngine } = await import('kline-orderbook-chart')
      prefetchEngine()

      chart = await createChartBridge(canvasRef.current, {
        licenseKey: process.env.NEXT_PUBLIC_MRD_KEY,
      })
      chart.setTheme('dark')
      // ... setup ...
      chart.start()
    }

    init()
    return () => chart?.destroy()
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}
```

```jsx
// pages/trading.jsx
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('../components/Chart'), { ssr: false })

export default function TradingPage() {
  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <Chart klines={klineData} />
    </div>
  )
}
```

---

## Vue 3

### Basic Component

```vue
<template>
  <canvas ref="canvasEl" style="width: 100%; height: 100%; display: block" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

prefetchEngine()

const props = defineProps({
  klines:     { type: Object, required: true },
  licenseKey: { type: String, required: true },
  theme:      { type: String, default: 'dark' },
  precision:  { type: Number, default: 2 },
  interval:   { type: Number, default: 3600 },
})

const emit = defineEmits(['tooltip', 'drawingComplete'])
const canvasEl = ref(null)

let chart = null
let ro = null

onMounted(async () => {
  chart = await createChartBridge(canvasEl.value, {
    licenseKey: props.licenseKey,
  })

  chart.setTheme(props.theme)
  chart.setPrecision(props.precision)
  chart.setCandleInterval(props.interval)

  const { timestamps, open, high, low, close, volume } = props.klines
  chart.setKlines(timestamps, open, high, low, close, volume)
  chart.enableVolume()
  chart.start()

  // Events
  chart.onTooltip((json, sx, sy) => emit('tooltip', { json, sx, sy }))
  chart.onDrawingComplete(() => emit('drawingComplete'))

  // Resize
  ro = new ResizeObserver(() => chart?.resize())
  ro.observe(canvasEl.value.parentElement)

  // Visibility
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibility)
  ro?.disconnect()
  chart?.destroy()
  chart = null
})

function onVisibility() {
  document.hidden ? chart?.pause() : chart?.resume()
}

// Reactive theme sync
watch(() => props.theme, (t) => chart?.setTheme(t))

// Reactive data sync
watch(() => props.klines, (k) => {
  if (!chart || !k) return
  chart.setKlines(k.timestamps, k.open, k.high, k.low, k.close, k.volume)
}, { deep: false })

// Expose chart API to parent via template ref
defineExpose({
  getChart: () => chart,
  enableRsi: () => { chart?.enableRsi(); chart?.setRsiPeriod(14) },
  enableCvd: (buyVol, totalVol) => { chart?.setCvdData(buyVol, totalVol); chart?.enableCvd() },
  appendKline: (ts, o, h, l, c, v) => chart?.appendKline(ts, o, h, l, c, v),
  updateLastKline: (ts, o, h, l, c, v) => chart?.updateLastKline(ts, o, h, l, c, v),
  startDrawing: (tool, style) => chart?.startDrawing(tool, style),
  cancelDrawing: () => chart?.cancelDrawing(),
  exportDrawings: () => chart?.exportDrawingsJson(),
  importDrawings: (json) => chart?.importDrawingsJson(json),
})
</script>
```

### Composable Pattern

```javascript
// composables/useChart.js
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

prefetchEngine()

export function useChart(canvasRef, options = {}) {
  const chart = shallowRef(null)
  const isReady = ref(false)
  let ro = null

  onMounted(async () => {
    const c = await createChartBridge(canvasRef.value, {
      licenseKey: options.licenseKey,
    })

    c.setTheme(options.theme || 'dark')
    c.setPrecision(options.precision || 2)
    chart.value = c
    isReady.value = true

    ro = new ResizeObserver(() => c.resize())
    ro.observe(canvasRef.value.parentElement)

    const onVis = () => document.hidden ? c.pause() : c.resume()
    document.addEventListener('visibilitychange', onVis)
    c._cleanupVis = () => document.removeEventListener('visibilitychange', onVis)
  })

  onBeforeUnmount(() => {
    ro?.disconnect()
    chart.value?._cleanupVis?.()
    chart.value?.destroy()
    chart.value = null
  })

  return { chart, isReady }
}
```

Usage:

```vue
<template>
  <canvas ref="canvasEl" style="width:100%;height:100%;display:block" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useChart } from '@/composables/useChart'

const canvasEl = ref(null)
const { chart, isReady } = useChart(canvasEl, {
  licenseKey: import.meta.env.VITE_MRD_KEY,
  theme: 'dark',
})

watch(isReady, (ready) => {
  if (!ready) return
  chart.value.setKlines(ts, o, h, l, c, v)
  chart.value.enableVolume()
  chart.value.start()
})
</script>
```

### Nuxt 3 (SSR)

Wrap chart initialization in a client-only component:

```vue
<!-- components/ChartWrapper.client.vue -->
<template>
  <canvas ref="canvasEl" style="width:100%;height:100%;display:block" />
</template>

<script setup>
// This component only runs client-side due to .client.vue suffix
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasEl = ref(null)
let chart = null

onMounted(async () => {
  const { createChartBridge, prefetchEngine } = await import('kline-orderbook-chart')
  prefetchEngine()
  chart = await createChartBridge(canvasEl.value, {
    licenseKey: useRuntimeConfig().public.mrdKey,
  })
  chart.setTheme('dark')
  // ... setup ...
  chart.start()
})

onBeforeUnmount(() => chart?.destroy())
</script>
```

---

## Svelte

### Basic Component

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

  prefetchEngine()

  export let klines
  export let licenseKey
  export let theme = 'dark'

  let canvasEl
  let chart
  let ro

  onMount(async () => {
    chart = await createChartBridge(canvasEl, { licenseKey })
    chart.setTheme(theme)
    chart.setPrecision(2)

    const { timestamps, open, high, low, close, volume } = klines
    chart.setKlines(timestamps, open, high, low, close, volume)
    chart.enableVolume()
    chart.start()

    ro = new ResizeObserver(() => chart?.resize())
    ro.observe(canvasEl.parentElement)

    const onVis = () => document.hidden ? chart?.pause() : chart?.resume()
    document.addEventListener('visibilitychange', onVis)

    return () => document.removeEventListener('visibilitychange', onVis)
  })

  onDestroy(() => {
    ro?.disconnect()
    chart?.destroy()
  })

  // Reactive theme
  $: if (chart) chart.setTheme(theme)
</script>

<canvas bind:this={canvasEl} style="width:100%; height:100%; display:block" />
```

### SvelteKit (SSR)

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { browser } from '$app/environment'

  export let klines
  export let licenseKey

  let canvasEl
  let chart

  onMount(async () => {
    if (!browser) return

    const { createChartBridge, prefetchEngine } = await import('kline-orderbook-chart')
    prefetchEngine()

    chart = await createChartBridge(canvasEl, { licenseKey })
    chart.setTheme('dark')
    // ... setup ...
    chart.start()
  })

  onDestroy(() => chart?.destroy())
</script>

<canvas bind:this={canvasEl} style="width:100%; height:100%; display:block" />
```

---

## Vanilla JS

### ES Module (Recommended)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MRD Chart</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0f0f14; }
    #container { width: 100vw; height: 100vh; }
    canvas { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <div id="container">
    <canvas id="chart"></canvas>
  </div>

  <script type="module">
    import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

    prefetchEngine()

    const canvas = document.getElementById('chart')
    const chart  = await createChartBridge(canvas, {
      licenseKey: 'MRD-XXXX-XXXX-XXXX-20270101',
    })

    chart.setTheme('dark')
    chart.setPrecision(2)
    chart.setCandleInterval(3600)

    // Load data
    const res = await fetch('/api/klines?symbol=BTCUSDT&interval=1h&limit=1000')
    const raw = await res.json()

    chart.setKlines(
      new Float64Array(raw.map(k => k[0] / 1000)),
      new Float64Array(raw.map(k => +k[1])),
      new Float64Array(raw.map(k => +k[2])),
      new Float64Array(raw.map(k => +k[3])),
      new Float64Array(raw.map(k => +k[4])),
      new Float64Array(raw.map(k => +k[5])),
    )

    chart.enableVolume()
    chart.enableRsi()
    chart.setRsiPeriod(14)
    chart.start()

    // Resize
    new ResizeObserver(() => chart.resize()).observe(canvas.parentElement)

    // Visibility
    document.addEventListener('visibilitychange', () => {
      document.hidden ? chart.pause() : chart.resume()
    })

    // Live updates
    const ws = new WebSocket('wss://stream.binance.com/ws/btcusdt@kline_1h')
    ws.onmessage = (e) => {
      const { k } = JSON.parse(e.data)
      if (k.x) chart.appendKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
      else     chart.updateLastKline(k.t / 1000, +k.o, +k.h, +k.l, +k.c, +k.v)
    }
  </script>
</body>
</html>
```

---

## Common Patterns

### Indicator Toggle Toolbar

```javascript
function createToolbar(chart) {
  const buttons = {
    volume:  { label: 'VOL',  on: () => chart.enableVolume(),  off: () => chart.disableVolume() },
    rsi:     { label: 'RSI',  on: () => chart.enableRsi(),     off: () => chart.disableRsi() },
    oi:      { label: 'OI',   on: () => chart.enableOi(),      off: () => chart.disableOi() },
    cvd:     { label: 'CVD',  on: () => chart.enableCvd(),     off: () => chart.disableCvd() },
    vrvp:    { label: 'VRVP', on: () => chart.enableVrvp(),    off: () => chart.disableVrvp() },
  }

  const state = {}

  for (const [key, btn] of Object.entries(buttons)) {
    state[key] = false
    const el = document.createElement('button')
    el.textContent = btn.label
    el.onclick = () => {
      state[key] = !state[key]
      state[key] ? btn.on() : btn.off()
      el.classList.toggle('active', state[key])
    }
    document.getElementById('toolbar').appendChild(el)
  }
}
```

### Drawing Tool Selector

```javascript
const tools = ['trendline', 'hline', 'arrow', 'fib', 'long', 'short', 'vwap']
let activeTool = null

function selectTool(tool) {
  if (activeTool === tool) {
    chart.cancelDrawing()
    activeTool = null
    return
  }
  activeTool = tool
  chart.startDrawing(tool, { r: 255, g: 255, b: 255, lineWidth: 1.5, dashed: false })
}

chart.onDrawingComplete(() => {
  activeTool = null
  updateToolbarUI()
})

chart.onDrawingCancel(() => {
  activeTool = null
  updateToolbarUI()
})
```

### Save/Restore State

```javascript
function saveChartState(chart, symbol, timeframe) {
  const state = {
    drawings: chart.exportDrawingsJson(),
    indicators: {
      volume: chart.isVolumeEnabled(),
      rsi: chart.isRsiEnabled(),
      oi: chart.isOiEnabled(),
      cvd: chart.isCvdEnabled(),
    },
    theme: chart.getTheme(),
  }
  localStorage.setItem(`chart-state-${symbol}-${timeframe}`, JSON.stringify(state))
}

function restoreChartState(chart, symbol, timeframe) {
  const raw = localStorage.getItem(`chart-state-${symbol}-${timeframe}`)
  if (!raw) return

  const state = JSON.parse(raw)
  chart.setTheme(state.theme)
  if (state.indicators.volume) chart.enableVolume()
  if (state.indicators.rsi) chart.enableRsi()
  if (state.indicators.oi) chart.enableOi()
  if (state.indicators.cvd) chart.enableCvd()
  if (state.drawings) chart.importDrawingsJson(state.drawings)
}
```

---

## Checklist

Every integration should include these essentials:

- [ ] `prefetchEngine()` called at module/app level
- [ ] `createChartBridge(canvas, { licenseKey })` in mount/effect
- [ ] `chart.setTheme()` / `chart.setPrecision()` / `chart.setCandleInterval()`
- [ ] `chart.setKlines(...)` before `chart.start()`
- [ ] `chart.start()` to begin render loop
- [ ] `ResizeObserver` → `chart.resize()`
- [ ] `visibilitychange` → `chart.pause()` / `chart.resume()`
- [ ] `chart.destroy()` on unmount / cleanup
- [ ] WebSocket → `appendKline()` / `updateLastKline()` for live data

---

## Next Steps

| Topic | Link |
|---|---|
| Getting started guide | [Getting Started](../guides/getting-started.md) |
| All indicators | [Built-in Indicators](../guides/indicators.md) |
| Drawing tools | [Drawing Tools](../guides/drawings.md) |
| Documentation home | [Table of Contents](../guides/README.md) |
