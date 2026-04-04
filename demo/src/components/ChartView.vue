<template>
  <div class="chart-wrapper" ref="wrapperRef">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  chart: { type: Object, required: true },
})

const canvasRef = ref(null)
const wrapperRef = ref(null)
let resizeObserver = null

onMounted(async () => {
  const canvas = canvasRef.value
  const wrapper = wrapperRef.value
  if (!canvas || !wrapper) return

  canvas.style.width = '100%'
  canvas.style.height = '100%'

  await props.chart.init(canvas)

  resizeObserver = new ResizeObserver(() => {
    props.chart.bridge.value?.resize()
  })
  resizeObserver.observe(wrapper)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: #0d1117;
  border-radius: 8px;
  overflow: hidden;
}
canvas {
  display: block;
}
</style>
