/**
 * MRD Chart Engine — Quick Start Demo
 *
 * Loads 10 000 real candles from the Binance REST API and streams
 * real-time updates via Binance WebSocket.
 *
 * Full live demo with orderbook heatmap + footprint:
 * https://app.mrd-indicators.com/trading/chart-terminal
 */

import { createChartBridge, prefetchWasm as prefetchEngine } from '../lib/mrd-chart-engine.mjs'
import { generateHeatmapMatrix, generateOIData } from './sample-data.js'

const LICENSE_KEY = 'trial'

// ── Binance endpoints ──
const REST = 'https://api.binance.com/api/v3'
const WS  = 'wss://stream.binance.com:9443/ws'
const TF_INTERVAL = { 60: '1m', 300: '5m', 900: '15m', 3600: '1h', 14400: '4h', 86400: '1d' }

// ── State ──
let bridge = null
let klines = []
let ws = null
let wsTarget = null
let lastKlineTs = 0
let currentSymbol = 'BTCUSDT'
let currentTf = 300

// ── Helpers ──

function decompose(arr) {
  const n = arr.length
  const t = new Array(n), o = new Array(n), h = new Array(n)
  const l = new Array(n), c = new Array(n), v = new Array(n)
  for (let i = 0; i < n; i++) {
    const k = arr[i]
    t[i] = k.t; o[i] = k.o; h[i] = k.h
    l[i] = k.l; c[i] = k.c; v[i] = k.v
  }
  return { t, o, h, l, c, v }
}

function feedKlines(arr) {
  const d = decompose(arr)
  bridge.setKlines(d.t, d.o, d.h, d.l, d.c, d.v)
}

function precision(price) {
  if (price >= 10000) return 1
  if (price >= 100) return 2
  if (price >= 1) return 4
  return 6
}

// ── Footprint builder (synthetic from OHLCV) ──

function buildFootprintFromKlines() {
  const n = klines.length
  if (n === 0) return

  let atr = 0
  const atrN = Math.min(200, n)
  for (let i = n - atrN; i < n; i++) atr += klines[i].h - klines[i].l
  atr /= atrN
  const tick = Math.max(atr / 12, 0.01)

  bridge.footprintClear()
  bridge.setFootprintTickSize(tick)
  bridge.footprintEnsureLen(n)

  for (let i = 0; i < n; i++) {
    const k = klines[i]
    _buildBarFp(bridge, i, k.o, k.h, k.l, k.c, k.v * k.c, tick)
  }
}

function _buildBarFp(br, idx, o, h, l, c, v, tick) {
  if (v <= 0 || h <= l) return
  const isBull = c >= o
  const bodyTop = Math.max(o, c), bodyBot = Math.min(o, c)
  const bodyMid = (bodyTop + bodyBot) / 2
  const candleRange = h - l

  const rowLo = Math.floor(l / tick), rowHi = Math.ceil(h / tick)
  const bodyRows = [], upperRows = [], lowerRows = []
  for (let r = rowLo; r <= rowHi; r++) {
    const p = r * tick
    if (p >= bodyBot && p <= bodyTop) bodyRows.push(r)
    else if (p > bodyTop) upperRows.push(r)
    else lowerRows.push(r)
  }

  const nBody = Math.max(bodyRows.length, 1)
  const bodyVol = v * 0.70, upperVol = v * 0.15, lowerVol = v * 0.15

  const prices = [], bids = [], asks = []
  const sigma = Math.max((bodyTop - bodyBot) / 2, tick)
  const gauss = (p) => Math.exp(-0.5 * ((p - bodyMid) / sigma) ** 2)

  let wSum = 0
  const bw = bodyRows.map(r => { const w = gauss(r * tick + tick / 2); wSum += w; return w })

  for (let j = 0; j < bodyRows.length; j++) {
    const p = bodyRows[j] * tick
    const share = bodyVol * (wSum > 0 ? bw[j] / wSum : 1 / nBody)
    const dist = Math.abs(p + tick / 2 - c) / Math.max(candleRange, tick)
    const dom = 0.55 + 0.25 * (1 - dist)
    const bidS = isBull ? share * dom : share * (1 - dom)
    prices.push(p); bids.push(bidS); asks.push(share - bidS)
  }

  for (let j = 0; j < upperRows.length; j++) {
    const p = upperRows[j] * tick
    const fade = 1 - (j + 1) / (upperRows.length + 1)
    let ws = 0; for (let k = 0; k < upperRows.length; k++) ws += 1 - (k + 1) / (upperRows.length + 1)
    const share = ws > 0 ? upperVol * fade / ws : upperVol / upperRows.length
    const bidR = isBull ? 0.35 : 0.25
    prices.push(p); bids.push(share * bidR); asks.push(share * (1 - bidR))
  }

  for (let j = 0; j < lowerRows.length; j++) {
    const p = lowerRows[lowerRows.length - 1 - j] * tick
    const fade = 1 - (j + 1) / (lowerRows.length + 1)
    let ws = 0; for (let k = 0; k < lowerRows.length; k++) ws += 1 - (k + 1) / (lowerRows.length + 1)
    const share = ws > 0 ? lowerVol * fade / ws : lowerVol / lowerRows.length
    const bidR = isBull ? 0.75 : 0.65
    prices.push(p); bids.push(share * bidR); asks.push(share * (1 - bidR))
  }

  br.footprintSetBar(idx, tick, new Float64Array(prices), new Float64Array(bids), new Float64Array(asks))
}

function updatePriceDisplay() {
  if (!klines.length) return
  const last = klines[klines.length - 1]
  const first = klines[0]
  const prec = precision(last.c)
  const change = ((last.c - first.o) / first.o * 100).toFixed(2)
  const isUp = last.c >= first.o

  document.getElementById('last-price').textContent = last.c.toFixed(prec)
  const el = document.getElementById('price-change')
  el.textContent = `${isUp ? '+' : ''}${change}%`
  el.className = `change ${isUp ? 'up' : 'down'}`
}

// ── Binance REST — paginated fetch (10 × 1 000) ──

function parseBinanceKline(k) {
  return { t: Math.floor(k[0] / 1000), o: +k[1], h: +k[2], l: +k[3], c: +k[4], v: +k[5] }
}

async function fetchKlines(symbol, tfSec, total = 10000) {
  const interval = TF_INTERVAL[tfSec] || '5m'
  const batch = 1000
  let all = []
  let endTime = null

  while (all.length < total) {
    let url = `${REST}/klines?symbol=${symbol}&interval=${interval}&limit=${batch}`
    if (endTime) url += `&endTime=${endTime}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`Binance ${res.status}`)
    const data = await res.json()
    if (!data.length) break

    all = data.map(parseBinanceKline).concat(all)
    endTime = data[0][0] - 1
    if (data.length < batch) break
  }

  return all.slice(-total)
}

// ── Binance WebSocket — real-time kline stream ──

function connectWs(symbol, tfSec) {
  if (ws) { ws.close(); ws = null }

  const interval = TF_INTERVAL[tfSec] || '5m'
  const target = `${symbol}@${interval}`
  wsTarget = target

  const url = `${WS}/${symbol.toLowerCase()}@kline_${interval}`
  ws = new WebSocket(url)

  ws.onmessage = (evt) => {
    if (!bridge) return
    const { k } = JSON.parse(evt.data)
    const ts = Math.floor(k.t / 1000)
    const o = +k.o, h = +k.h, l = +k.l, c = +k.c, v = +k.v

    if (ts > lastKlineTs) {
      bridge.appendKline(ts, o, h, l, c, v)
      klines.push({ t: ts, o, h, l, c, v })
      lastKlineTs = ts
    } else {
      bridge.updateLastKline(ts, o, h, l, c, v)
      const last = klines[klines.length - 1]
      if (last) { last.o = o; last.h = h; last.l = l; last.c = c; last.v = v }
    }
    updatePriceDisplay()
  }

  ws.onerror = () => console.warn('[WS] error')
  ws.onclose = () => {
    if (wsTarget === target) setTimeout(() => connectWs(symbol, tfSec), 3000)
  }
}

// ── Load symbol data ──

const loadingEl = document.getElementById('loading')
const loadingText = loadingEl?.querySelector('p')

async function loadSymbol(symbol, tfSec) {
  loadingEl?.classList.remove('hidden')
  if (loadingText) loadingText.textContent = `Loading ${symbol} ${TF_INTERVAL[tfSec] || '5m'}…`

  try {
    klines = await fetchKlines(symbol, tfSec, 10000)
    if (!klines.length) throw new Error('empty response')

    const lastPrice = klines[klines.length - 1].c
    feedKlines(klines)
    bridge.setCandleInterval(tfSec)
    bridge.setPrecision(precision(lastPrice))

    lastKlineTs = klines[klines.length - 1].t
    connectWs(symbol, tfSec)
    updatePriceDisplay()
  } catch (err) {
    console.error('[Demo] load failed:', err)
    if (loadingText) loadingText.textContent = `Failed to load — ${err.message}`
  } finally {
    loadingEl?.classList.add('hidden')
  }
}

// ── Init ──

prefetchEngine()
const canvas = document.getElementById('chart')

async function initChart() {
  bridge = await createChartBridge(canvas, { licenseKey: LICENSE_KEY })
  await loadSymbol(currentSymbol, currentTf)
  bridge.enableVolume()

  // Auto-enable footprint
  bridge.setChartType(1)
  buildFootprintFromKlines()
  document.getElementById('tog-fp')?.classList.add('on')

  // Auto-enable heatmap
  const hm = generateHeatmapMatrix(klines)
  if (hm) {
    const xStep = hm.cols > 1 ? (hm.timeEnd - hm.timeStart) / (hm.cols - 1) : currentTf
    const yStep = hm.rows > 1 ? (hm.priceMax - hm.priceMin) / (hm.rows - 1) : 1
    bridge.setHeatmap(hm.data, hm.rows, hm.cols, hm.timeStart, xStep, hm.priceMin, yStep)
  }
  document.getElementById('tog-hm')?.classList.add('on')

  bridge.start()
}

// ── Toolbar: Symbol ──
document.querySelectorAll('[data-sym]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-sym]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentSymbol = btn.dataset.sym
    document.getElementById('symbol').textContent = currentSymbol
    loadSymbol(currentSymbol, currentTf)
  })
})

// ── Toolbar: Timeframe ──
document.querySelectorAll('[data-tf]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tf]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentTf = +btn.dataset.tf
    loadSymbol(currentSymbol, currentTf)
  })
})

// ── Toolbar: Indicators ──
function toggleIndicator(btnId, enableFn, disableFn) {
  const btn = document.getElementById(btnId)
  if (!btn) return
  btn.addEventListener('click', () => {
    const enabled = !btn.classList.contains('on')
    btn.classList.toggle('on', enabled)
    if (enabled) enableFn()
    else disableFn()
  })
}

toggleIndicator('tog-vol',
  () => bridge.enableVolume(),
  () => bridge.disableVolume(),
)
toggleIndicator('tog-rsi',
  () => { bridge.enableRsi(); bridge.setRsiPeriod(14) },
  () => bridge.disableRsi(),
)
toggleIndicator('tog-oi',
  () => {
    bridge.enableOi()
    const oiData = generateOIData(klines)
    const ts = new Float64Array(oiData.map(d => d.t))
    const vals = new Float64Array(oiData.map(d => d.value))
    bridge.setOiDataTs(ts, vals)
  },
  () => bridge.disableOi(),
)
toggleIndicator('tog-fp',
  () => {
    bridge.setChartType(1)
    buildFootprintFromKlines()
  },
  () => {
    bridge.setChartType(0)
    bridge.footprintClear()
  },
)
toggleIndicator('tog-hm',
  () => {
    const hm = generateHeatmapMatrix(klines)
    if (hm) {
      const xStep = hm.cols > 1 ? (hm.timeEnd - hm.timeStart) / (hm.cols - 1) : currentTf
      const yStep = hm.rows > 1 ? (hm.priceMax - hm.priceMin) / (hm.rows - 1) : 1
      bridge.setHeatmap(hm.data, hm.rows, hm.cols, hm.timeStart, xStep, hm.priceMin, yStep)
    }
  },
  () => bridge.setHeatmap(new Float64Array(0), 0, 0, 0, 1, 0, 1),
)

toggleIndicator('tog-delta-hist',
  () => bridge.enableDeltaHistogram(),
  () => bridge.disableDeltaHistogram(),
)

// ── Toolbar: Footprint display mode ──
document.querySelectorAll('[id^="fp-mode-"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[id^="fp-mode-"]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    const modes = { 'fp-mode-bidask': 0, 'fp-mode-delta': 1, 'fp-mode-vol': 2 }
    bridge.footprintSetDisplayMode(modes[btn.id] ?? 0)
  })
})

// ── Toolbar: Drawing tools ──
document.querySelectorAll('[data-draw]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-draw]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    bridge.startDrawing(btn.dataset.draw)
  })
})

// ── Toolbar: Theme ──
document.getElementById('btn-dark')?.addEventListener('click', () => {
  document.getElementById('btn-dark').classList.add('active')
  document.getElementById('btn-light').classList.remove('active')
  document.body.classList.remove('light')
  bridge.setTheme('dark')
})
document.getElementById('btn-light')?.addEventListener('click', () => {
  document.getElementById('btn-light').classList.add('active')
  document.getElementById('btn-dark').classList.remove('active')
  document.body.classList.add('light')
  bridge.setTheme('light')
})

// ── Resize ──
window.addEventListener('resize', () => bridge?.resize())

// ── Go ──
initChart()
