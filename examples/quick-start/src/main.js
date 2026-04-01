/**
 * MRD Chart Engine — Quick Start Demo
 *
 * This file shows how to integrate @mrd/chart-engine into a vanilla JS project.
 * Run `npm install && npm run dev` to see it in action.
 *
 * For the full live demo with real data, visit:
 * https://app.mrd-indicators.com/trading/chart-terminal
 */

import { createChartBridge, prefetchWasm } from '../lib/mrd-chart-engine.mjs'
import { generateKlines, generateHeatmapMatrix, generateOIData, simulateLive } from './sample-data.js'

// ── License key ──
// Trial mode: omit licenseKey or pass 'trial' → 14-day trial with watermark
// Production: pass your license key here → no watermark, full features
const LICENSE_KEY = 'trial'

// ── State ──
let bridge = null
let klines = []
let stopLive = null
let currentSymbol = 'BTCUSDT'
let currentPrice = 68500
let currentTf = 300

// ── Init ──
prefetchWasm()

const canvas = document.getElementById('chart')
const loading = document.getElementById('loading')

async function initChart() {
  bridge = await createChartBridge(canvas, { licenseKey: LICENSE_KEY })

  klines = generateKlines(1000, currentPrice, currentTf)
  bridge.setKlines(klines)
  bridge.setCandleInterval(currentTf)
  bridge.setPrecision(currentPrice > 1000 ? 1 : 2)

  bridge.enableVolume(true)

  bridge.start()

  loading.classList.add('hidden')

  updatePriceDisplay()
  startLiveSimulation()
}

function updatePriceDisplay() {
  if (!klines.length) return
  const last = klines[klines.length - 1]
  const first = klines[0]
  const change = ((last.c - first.o) / first.o * 100).toFixed(2)
  const isUp = last.c >= first.o

  document.getElementById('last-price').textContent = last.c.toFixed(currentPrice > 1000 ? 1 : 2)
  const changeEl = document.getElementById('price-change')
  changeEl.textContent = `${isUp ? '+' : ''}${change}%`
  changeEl.className = `change ${isUp ? 'up' : 'down'}`
}

function startLiveSimulation() {
  if (stopLive) stopLive()
  stopLive = simulateLive(klines, 800, (type, kline) => {
    if (!bridge) return
    if (type === 'update') {
      bridge.updateLastKline(kline.t, kline.o, kline.h, kline.l, kline.c, kline.v)
    } else {
      bridge.appendKline(kline.t, kline.o, kline.h, kline.l, kline.c, kline.v)
    }
    updatePriceDisplay()
  })
}

function switchSymbol(sym, price) {
  currentSymbol = sym
  currentPrice = price
  document.getElementById('symbol').textContent = sym
  if (stopLive) stopLive()

  klines = generateKlines(1000, price, currentTf)
  bridge.setKlines(klines)
  bridge.setPrecision(price > 1000 ? 1 : 2)
  updatePriceDisplay()
  startLiveSimulation()
}

// ── Toolbar: Symbol ──
document.querySelectorAll('[data-sym]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-sym]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    switchSymbol(btn.dataset.sym, +btn.dataset.price)
  })
})

// ── Toolbar: Timeframe ──
document.querySelectorAll('[data-tf]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tf]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentTf = +btn.dataset.tf
    bridge.setCandleInterval(currentTf)
    if (stopLive) stopLive()
    klines = generateKlines(1000, currentPrice, currentTf)
    bridge.setKlines(klines)
    updatePriceDisplay()
    startLiveSimulation()
  })
})

// ── Toolbar: Indicators ──
function toggleIndicator(btnId, enableFn, disableFn) {
  const btn = document.getElementById(btnId)
  let enabled = btn.classList.contains('on')
  btn.addEventListener('click', () => {
    enabled = !enabled
    btn.classList.toggle('on', enabled)
    if (enabled) enableFn()
    else disableFn()
  })
}

toggleIndicator('tog-vol',
  () => bridge.enableVolume(true),
  () => bridge.enableVolume(false),
)
toggleIndicator('tog-rsi',
  () => bridge.enableRsi(true, 14),
  () => bridge.enableRsi(false),
)
toggleIndicator('tog-oi',
  () => {
    bridge.enableOi(true)
    const oiData = generateOIData(klines)
    oiData.forEach(d => bridge.appendOi(d.t, d.value))
  },
  () => bridge.enableOi(false),
)
toggleIndicator('tog-fp',
  () => bridge.enableFootprint(true),
  () => bridge.enableFootprint(false),
)
toggleIndicator('tog-hm',
  () => {
    const hm = generateHeatmapMatrix(klines)
    if (hm) bridge.setHeatmap(hm.data, hm.rows, hm.cols, hm.priceMin, hm.priceMax, hm.timeStart, hm.timeEnd)
    bridge.enableHeatmap(true)
  },
  () => bridge.enableHeatmap(false),
)

// ── Toolbar: Drawing tools ──
document.querySelectorAll('[data-draw]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-draw]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    bridge.startDrawing(btn.dataset.draw)
  })
})

// ── Toolbar: Theme ──
document.getElementById('btn-dark').addEventListener('click', () => {
  document.getElementById('btn-dark').classList.add('active')
  document.getElementById('btn-light').classList.remove('active')
  document.body.classList.remove('light')
  bridge.setTheme('dark')
})
document.getElementById('btn-light').addEventListener('click', () => {
  document.getElementById('btn-light').classList.add('active')
  document.getElementById('btn-dark').classList.remove('active')
  document.body.classList.add('light')
  bridge.setTheme('light')
})

// ── Resize ──
window.addEventListener('resize', () => bridge?.resize())

// ── Go ──
initChart()
