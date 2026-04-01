# Vue 3 Integration

## Basic Setup

```bash
npm install @mrd/chart-engine
```

```vue
<template>
  <div ref="wrapper" style="width: 100%; height: 500px">
    <canvas ref="canvasEl" style="width: 100%; height: 100%" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { MrdChart } from '@mrd/chart-engine'

const props = defineProps({
  symbol: { type: String, required: true },
  klines: { type: Array, default: () => [] },
  theme: { type: String, default: 'dark' },
})

const canvasEl = ref(null)
const wrapper = ref(null)
let chart = null

onMounted(async () => {
  chart = await MrdChart.create(canvasEl.value, {
    licenseKey: import.meta.env.VITE_MRD_KEY,
    theme: props.theme,
    precision: 2,
  })

  chart.setKlines(props.klines)
  chart.indicators.enable('volume')
  chart.start()

  const ro = new ResizeObserver(() => chart?.resize())
  ro.observe(wrapper.value)
  onBeforeUnmount(() => ro.disconnect())
})

onBeforeUnmount(() => {
  chart?.destroy()
  chart = null
})

watch(() => props.theme, (t) => chart?.setTheme(t))
watch(() => props.klines, (d) => chart?.setKlines(d))
</script>
```

## Composable

```javascript
// composables/useMrdChart.js
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { MrdChart } from '@mrd/chart-engine'

export function useMrdChart(canvasRef, options) {
  const chart = ref(null)
  const ready = ref(false)

  onMounted(async () => {
    if (!canvasRef.value) return
    chart.value = await MrdChart.create(canvasRef.value, options)
    ready.value = true
  })

  onBeforeUnmount(() => {
    chart.value?.destroy()
    chart.value = null
  })

  return { chart, ready }
}
```

## With Vuetify Theme Sync

```vue
<script setup>
import { watch } from 'vue'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const isLight = computed(() => vuetifyTheme.global.current.value.dark === false)

watch(isLight, (light) => {
  chart?.setTheme(light ? 'light' : 'dark')
}, { immediate: true })
</script>
```
