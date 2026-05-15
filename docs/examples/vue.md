# Vue 3 Integration

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/react-integration](https://mrd-indicators.com/docs/react-integration)** — this Markdown mirror is kept for offline / GitHub browsing.


This guide shows how to use Kline Orderbook Chart in a Vue 3 application using the Composition API.

## Installation

```bash
npm install kline-orderbook-chart
```

## Basic setup

```vue
<template>
  <canvas ref="canvasEl" style="width: 100%; height: 100%" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

prefetchEngine()

const props = defineProps({
  licenseKey: { type: String, default: '' },
})

const canvasEl = ref(null)
let chart = null

onMounted(async () => {
  chart = await createChartBridge(canvasEl.value, {
    licenseKey: props.licenseKey,
  })
  chart.enableVolume()
  chart.start()
})

onBeforeUnmount(() => {
  chart?.destroy()
  chart = null
})
</script>
```

## Loading data from Binance

```vue
<template>
  <div style="width: 100%; height: 600px">
    <canvas ref="canvasEl" style="width: 100%; height: 100%" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

prefetchEngine()

const props = defineProps({
  symbol: { type: String, default: 'BTCUSDT' },
  interval: { type: String, default: '5m' },
  licenseKey: { type: String, default: '' },
})

const canvasEl = ref(null)
let chart = null
let ws = null
let lastTs = 0

const INTERVAL_SEC = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400, '1d': 86400 }

async function loadData() {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${props.symbol}&interval=${props.interval}&limit=1000`
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
  chart.setCandleInterval(INTERVAL_SEC[props.interval] || 300)
  chart.setPrecision(1)

  lastTs = Math.floor(raw[raw.length - 1][0] / 1000)
}

function connectWs() {
  ws?.close()
  const stream = `${props.symbol.toLowerCase()}@kline_${props.interval}`
  ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`)

  ws.onmessage = (e) => {
    const { k } = JSON.parse(e.data)
    const ts = Math.floor(k.t / 1000)
    if (ts > lastTs) {
      chart.appendKline(ts, +k.o, +k.h, +k.l, +k.c, +k.v)
      lastTs = ts
    } else {
      chart.updateLastKline(ts, +k.o, +k.h, +k.l, +k.c, +k.v)
    }
  }

  ws.onclose = () => {
    setTimeout(connectWs, 3000)
  }
}

onMounted(async () => {
  chart = await createChartBridge(canvasEl.value, {
    licenseKey: props.licenseKey,
  })
  chart.enableVolume()
  chart.start()
  await loadData()
  connectWs()

  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  ws?.close()
  chart?.destroy()
  chart = null
})

function onResize() {
  chart?.resize()
}

watch(() => [props.symbol, props.interval], async () => {
  if (!chart) return
  ws?.close()
  await loadData()
  connectWs()
})
</script>
```

## Composable: `useChart`

Create a reusable composable for chart initialization:

```javascript
// composables/useChart.js
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'

prefetchEngine()

export function useChart(canvasRef, options = {}) {
  const chart = ref(null)
  const ready = ref(false)

  onMounted(async () => {
    if (!canvasRef.value) return

    chart.value = await createChartBridge(canvasRef.value, {
      licenseKey: options.licenseKey || '',
    })
    chart.value.start()
    ready.value = true

    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    chart.value?.destroy()
    chart.value = null
    ready.value = false
  })

  function handleResize() {
    chart.value?.resize()
  }

  return { chart, ready }
}
```

Usage:

```vue
<template>
  <canvas ref="el" style="width: 100%; height: 600px" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useChart } from '@/composables/useChart'

const el = ref(null)
const { chart, ready } = useChart(el, { licenseKey: 'YOUR_KEY' })

watch(ready, (isReady) => {
  if (!isReady) return
  chart.value.setKlines(timestamps, opens, highs, lows, closes, volumes)
  chart.value.enableVolume()
  chart.value.enableRsi()
  chart.value.setRsiPeriod(14)
})
</script>
```

## Theme switching

```vue
<script setup>
import { watch } from 'vue'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

watch(() => vuetifyTheme.global.current.value.dark, (isDark) => {
  chart.value?.setTheme(isDark ? 'dark' : 'light')
}, { immediate: true })
</script>
```

## Drawing tools

```vue
<template>
  <div>
    <div class="toolbar">
      <button @click="chart?.startDrawing('trendline')">Trendline</button>
      <button @click="chart?.startDrawing('hline')">H-Line</button>
      <button @click="chart?.startDrawing('fib')">Fibonacci</button>
      <button @click="chart?.cancelDrawing()">Cancel</button>
      <button @click="chart?.clearDrawings()">Clear All</button>
    </div>
    <canvas ref="el" style="width: 100%; height: 600px" />
  </div>
</template>
```

## Saving/restoring drawings

```javascript
watch(() => props.symbol, (newSymbol, oldSymbol) => {
  if (chart.value && oldSymbol) {
    const json = chart.value.exportDrawingsJson()
    localStorage.setItem(`drawings:${oldSymbol}`, json)
  }

  // Load drawings for new symbol
  const saved = localStorage.getItem(`drawings:${newSymbol}`)
  if (saved) {
    chart.value?.importDrawingsJson(saved)
  }
})
```

---

## Next steps

- [React Integration](react.md) — React hooks setup
- [Getting Started](../guides/getting-started.md) — Core concepts
- [API Reference](../api/README.md) — Full method list
