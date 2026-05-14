<template>
  <div class="control-bar">
    <div class="left">
      <div class="logo">
        <span class="logo-icon">◈</span>
        <span class="logo-text">MRD Chart Engine</span>
      </div>
    </div>

    <div class="center">
      <div class="control-group">
        <label>Exchange</label>
        <select v-model="selectedExchange" @change="onExchangeChange">
          <option v-for="ex in exchanges" :key="ex.id" :value="ex.id">{{ ex.name }}</option>
        </select>
      </div>

      <div class="control-group">
        <label>Symbol</label>
        <select v-model="selectedSymbol" @change="onSymbolChange">
          <option v-for="s in currentSymbols" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div class="control-group">
        <label>Chart</label>
        <div class="btn-group">
          <button
            :class="{ active: chartType === 0 }"
            @click="$emit('chartType', 0)"
          >Candle</button>
          <button
            :class="{ active: chartType === 1 }"
            @click="$emit('chartType', 1)"
          >Footprint</button>
        </div>
      </div>

      <div class="control-group">
        <label>Indicators</label>
        <div class="btn-group">
          <button
            :class="{ active: volumeOn }"
            @click="$emit('toggleVolume')"
          >VOL</button>
          <button
            :class="{ active: rsiOn }"
            @click="$emit('toggleRsi')"
          >RSI</button>
          <button
            :class="{ active: oiOn }"
            @click="$emit('toggleOi')"
          >OI</button>
          <button
            :class="{ active: alphaTrendOn }"
            title="Custom indicator written in plain JS — see src/indicators/alphaTrend.js"
            @click="$emit('toggleAlphaTrend')"
          >ALPHA</button>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="stat" v-if="stats.trades > 0">
        <span class="stat-label">Trades</span>
        <span class="stat-value">{{ formatNum(stats.trades) }}</span>
      </div>
      <div class="stat" v-if="stats.depthUpdates > 0">
        <span class="stat-label">Depth</span>
        <span class="stat-value">{{ formatNum(stats.depthUpdates) }}</span>
      </div>
      <div :class="['status', connected ? 'online' : 'offline']">
        {{ connected ? 'LIVE' : 'OFFLINE' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  exchanges: { type: Array, default: () => [] },
  connected: Boolean,
  chartType: { type: Number, default: 0 },
  volumeOn: { type: Boolean, default: true },
  rsiOn: { type: Boolean, default: true },
  oiOn: { type: Boolean, default: true },
  alphaTrendOn: { type: Boolean, default: true },
  stats: { type: Object, default: () => ({ trades: 0, depthUpdates: 0 }) },
})

const emit = defineEmits([
  'subscribe', 'chartType',
  'toggleVolume', 'toggleRsi', 'toggleOi', 'toggleAlphaTrend',
])

const selectedExchange = ref('')
const selectedSymbol = ref('')

const currentSymbols = computed(() => {
  const ex = props.exchanges.find(e => e.id === selectedExchange.value)
  return ex?.symbols || []
})

watch(() => props.exchanges, (exs) => {
  if (exs.length > 0 && !selectedExchange.value) {
    selectedExchange.value = exs[0].id
    selectedSymbol.value = exs[0].symbols[0]
    emit('subscribe', selectedExchange.value, selectedSymbol.value)
  }
}, { immediate: true })

function onExchangeChange() {
  const syms = currentSymbols.value
  selectedSymbol.value = syms[0] || ''
  if (selectedSymbol.value) {
    emit('subscribe', selectedExchange.value, selectedSymbol.value)
  }
}

function onSymbolChange() {
  emit('subscribe', selectedExchange.value, selectedSymbol.value)
}

function formatNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toString()
}
</script>

<style scoped>
.control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  background: #161b22;
  border-bottom: 1px solid #21262d;
  gap: 16px;
}

.left, .center, .right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-icon {
  font-size: 20px;
  color: #58a6ff;
}
.logo-text {
  font-weight: 700;
  font-size: 14px;
  color: #e6edf3;
  letter-spacing: 0.5px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.control-group label {
  font-size: 11px;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.control-group select {
  background: #0d1117;
  border: 1px solid #30363d;
  color: #e6edf3;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
}
.control-group select:focus {
  outline: none;
  border-color: #58a6ff;
}

.btn-group {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #30363d;
}
.btn-group button {
  background: #0d1117;
  color: #8b949e;
  border: none;
  padding: 4px 12px;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-group button + button {
  border-left: 1px solid #30363d;
}
.btn-group button.active {
  background: #1f6feb;
  color: #fff;
}
.btn-group button:hover:not(.active) {
  background: #21262d;
  color: #e6edf3;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
}
.stat-label {
  font-size: 9px;
  color: #484f58;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.stat-value {
  font-size: 13px;
  color: #8b949e;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.status {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.status.online {
  background: rgba(35, 134, 54, 0.2);
  color: #3fb950;
  animation: pulse 2s infinite;
}
.status.offline {
  background: rgba(218, 54, 51, 0.2);
  color: #f85149;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
