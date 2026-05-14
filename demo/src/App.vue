<template>
  <div class="app">
    <ControlBar
      :exchanges="market.exchanges.value"
      :connected="market.connected.value"
      :chart-type="chart.chartType.value"
      :volume-on="chart.volumeEnabled.value"
      :rsi-on="chart.rsiEnabled.value"
      :oi-on="chart.oiEnabled.value"
      :alpha-trend-on="chart.alphaTrendEnabled.value"
      :stats="market.stats.value"
      @subscribe="onSubscribe"
      @chart-type="onChartType"
      @toggle-volume="chart.toggleVolume()"
      @toggle-rsi="chart.toggleRsi()"
      @toggle-oi="chart.toggleOi()"
      @toggle-alpha-trend="chart.toggleAlphaTrend()"
    />

    <HeatmapSlider :bridge="chart.bridge.value" />

    <div class="main">
      <DrawingToolbar
        :active-tool="chart.activeDrawingTool.value"
        @draw="onDraw"
        @cancel="chart.cancelDrawing()"
        @delete-selected="chart.deleteSelected()"
        @clear-all="chart.clearDrawings()"
      />

      <div class="chart-area">
        <ChartView :chart="chart" />

        <div class="watermark">
          <div class="wm-exchange">{{ market.currentExchange.value.toUpperCase() }}</div>
          <div class="wm-symbol">{{ market.currentSymbol.value }}</div>
          <div class="wm-type">{{ chartLabel }}</div>
        </div>

        <div class="live-badge" v-if="market.stats.value.tps > 0">
          <span class="tps">{{ market.stats.value.tps }} trades/s</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import ChartView from './components/ChartView.vue'
import ControlBar from './components/ControlBar.vue'
import DrawingToolbar from './components/DrawingToolbar.vue'
import HeatmapSlider from './components/HeatmapSlider.vue'
import { useMarketData } from './composables/useMarketData.js'
import { useChart } from './composables/useChart.js'

const market = useMarketData()
const chart = useChart()

const chartLabel = computed(() => {
  return chart.chartType.value === 0
    ? 'Candlestick + Heatmap'
    : 'Footprint + Heatmap'
})

market.onHistory((msg) => chart.setHistory(msg))
market.onKline((kline) => chart.handleKline(kline))
market.onTrade((trade) => chart.handleTrade(trade))
market.onHeatmap((col) => chart.handleHeatmapColumn(col))
market.onHeatmapFrozen((col) => chart.handleHeatmapFrozen(col))
market.onOi((oi) => chart.handleOi(oi))

function onSubscribe(exchange, symbol) {
  market.subscribe(exchange, symbol)
}

function onChartType(ct) {
  chart.setChartTypeValue(ct)
}

function onDraw(tool) {
  if (chart.activeDrawingTool.value === tool) chart.cancelDrawing()
  else chart.startDrawing(tool)
}

function onKeydown(e) {
  if (e.key === 'Escape' && chart.activeDrawingTool.value) chart.cancelDrawing()
  if ((e.key === 'Delete' || e.key === 'Backspace') && !chart.activeDrawingTool.value) chart.deleteSelected()
}

onMounted(() => {
  market.connect()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  chart.destroy()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --border: #21262d;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --accent: #58a6ff;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chart-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  margin: 4px 4px 4px 0;
  border-radius: 8px;
}

.watermark {
  position: absolute;
  top: 12px;
  left: 12px;
  pointer-events: none;
  opacity: 0.12;
  z-index: 1;
}
.wm-exchange {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--accent);
}
.wm-symbol {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
}
.wm-type {
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.live-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  pointer-events: none;
  z-index: 1;
}
.tps {
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #3fb950;
  background: rgba(35, 134, 54, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
