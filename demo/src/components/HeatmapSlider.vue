<template>
  <div class="heatmap-bar">
    <span class="bar-label">HEATMAP</span>

    <div class="slider-track">
      <div class="gradient-bar">
        <div class="gradient-fill" :style="{ width: thumbPct + '%' }" />
      </div>
      <div class="track-thumb" :style="{ left: thumbPct + '%' }" />
      <input
        type="range"
        class="slider-input"
        :min="0"
        :max="1000"
        :value="sliderValue"
        @input="onSlide"
      />
    </div>

    <span class="bar-value">{{ displayValue }}</span>

    <span class="bar-range">
      {{ formatQty(actualMin) }} – {{ formatQty(actualMax) }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  bridge: { type: Object, default: null },
})

const sliderValue = ref(1000)
const actualMin = ref(0)
const actualMax = ref(1)
const userMax = ref(0)

let pollTimer = null

function pollRange() {
  const b = props.bridge
  if (!b) return
  try {
    const range = b.getHeatmapDataRange()
    if (range && range.max > 0) {
      actualMin.value = range.min
      actualMax.value = range.max
      if (userMax.value <= 0) userMax.value = range.max
    }
  } catch {}
}

const thumbPct = computed(() => (sliderValue.value / 1000) * 100)

const displayValue = computed(() => {
  if (userMax.value <= 0) return '—'
  return formatQty(actualMax.value * (sliderValue.value / 1000))
})

function formatQty(v) {
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M'
  if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K'
  if (v >= 1) return v.toFixed(1)
  return v.toFixed(3)
}

function onSlide(e) {
  sliderValue.value = parseInt(e.target.value)
  const b = props.bridge
  if (!b || actualMax.value <= 0) return
  const newMax = actualMax.value * Math.max(sliderValue.value / 1000, 0.01)
  userMax.value = newMax
  b.setHeatmapRange(0, newMax)
}

watch(() => props.bridge, (b) => {
  if (b) pollRange()
})

onMounted(() => {
  pollTimer = setInterval(pollRange, 3000)
})

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.heatmap-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  height: 32px;
  background: #161b22;
  border-bottom: 1px solid #21262d;
  flex-shrink: 0;
}

.bar-label {
  font-size: 10px;
  font-weight: 600;
  color: #8b949e;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.slider-track {
  position: relative;
  flex: 1;
  max-width: 280px;
  height: 18px;
}

.gradient-bar {
  position: absolute;
  top: 7px;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 2px;
  background: #21262d;
  overflow: hidden;
}
.gradient-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #0d1117, #1a3a5c, #2d7d9a, #48c774, #ffd43b, #ff6b6b);
  transition: width 0.05s;
}

.track-thumb {
  position: absolute;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e6edf3;
  border: 2px solid #58a6ff;
  transform: translateX(-50%);
  pointer-events: none;
  box-shadow: 0 0 4px rgba(88, 166, 255, 0.4);
  transition: left 0.05s;
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
}

.bar-value {
  font-size: 12px;
  font-weight: 600;
  color: #e6edf3;
  font-variant-numeric: tabular-nums;
  min-width: 44px;
  text-align: right;
}

.bar-range {
  font-size: 10px;
  color: #484f58;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
