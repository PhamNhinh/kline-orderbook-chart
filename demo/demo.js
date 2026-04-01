/**
 * MRD Chart Engine — Demo page logic.
 *
 * In a real deployment this imports from '@mrd/chart-engine'.
 * For this standalone demo, we generate synthetic OHLCV data
 * and simulate the chart with a canvas visualization.
 */

// ── Synthetic OHLCV data generator ──────────────────────────

function generateOHLCV(count = 500, startPrice = 65000, volatility = 0.008) {
  const data = []
  let price = startPrice
  const now = Math.floor(Date.now() / 1000)
  const interval = 300 // 5m

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * volatility * price
    const o = price
    const c = price + change
    const h = Math.max(o, c) + Math.random() * volatility * price * 0.5
    const l = Math.min(o, c) - Math.random() * volatility * price * 0.5
    const v = 50 + Math.random() * 500

    data.push({
      t: now - (count - i) * interval,
      o: +o.toFixed(2),
      h: +h.toFixed(2),
      l: +l.toFixed(2),
      c: +c.toFixed(2),
      v: +v.toFixed(2),
    })
    price = c
  }
  return data
}

// ── Mini canvas chart renderer (demo-only, replaces WASM in showcase) ──

class DemoChart {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.data = []
    this.theme = 'dark'
    this.indicators = new Set(['volume'])
    this.offset = 0
    this.visibleBars = 80
    this.animating = false
    this.destroyed = false

    this.themes = {
      dark: {
        bg: '#0b0e14', grid: '#1a1f2e', text: '#5c6370', axis: '#1e2536',
        bullCandle: '#00c9a7', bearCandle: '#ff4757',
        bullVol: 'rgba(0,201,167,0.3)', bearVol: 'rgba(255,71,87,0.3)',
        wick: '#3a4255', crosshair: 'rgba(255,255,255,0.1)',
        rsiLine: '#0a7cff', rsiBg: '#0b0e14', rsiGrid: '#1a1f2e',
        watermark: 'rgba(255,255,255,0.03)',
      },
      light: {
        bg: '#ffffff', grid: '#f0f1f5', text: '#9ca3af', axis: '#e5e7eb',
        bullCandle: '#0ea573', bearCandle: '#e53e3e',
        bullVol: 'rgba(14,165,115,0.2)', bearVol: 'rgba(229,62,62,0.2)',
        wick: '#c4c8d4', crosshair: 'rgba(0,0,0,0.06)',
        rsiLine: '#0a7cff', rsiBg: '#ffffff', rsiGrid: '#f0f1f5',
        watermark: 'rgba(0,0,0,0.03)',
      },
    }

    this._resize()
    this._bindEvents()
  }

  _resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    this.width = rect.width
    this.height = rect.height
    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  _bindEvents() {
    this._onResize = () => { this._resize(); this.render() }
    this._onWheel = (e) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        this.visibleBars = Math.max(20, Math.min(300, this.visibleBars + (e.deltaY > 0 ? 5 : -5)))
      } else {
        this.offset = Math.max(0, Math.min(this.data.length - this.visibleBars, this.offset + (e.deltaY > 0 ? 3 : -3)))
      }
      this.render()
    }
    window.addEventListener('resize', this._onResize)
    this.canvas.addEventListener('wheel', this._onWheel, { passive: false })
  }

  setData(data) {
    this.data = data
    this.offset = Math.max(0, data.length - this.visibleBars)
    this.render()
  }

  setTheme(theme) {
    this.theme = theme
    const container = this.canvas.parentElement
    if (container) container.style.background = this.themes[theme].bg
    this.render()
  }

  render() {
    if (this.destroyed) return
    const { ctx, width, height, data } = this
    const t = this.themes[this.theme]

    const hasRsi = this.indicators.has('rsi')
    const hasVolume = this.indicators.has('volume')

    const chartH = hasRsi ? height * 0.72 : height * 0.85
    const volH = hasVolume ? height * 0.13 : 0
    const rsiH = hasRsi ? height - chartH - volH : 0
    const padR = 70
    const padT = 8

    ctx.fillStyle = t.bg
    ctx.fillRect(0, 0, width, height)

    // Watermark
    ctx.save()
    ctx.font = `bold ${Math.min(width * 0.04, 36)}px ${getComputedStyle(document.body).fontFamily}`
    ctx.fillStyle = t.watermark
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('MRD Chart Engine', width / 2, chartH / 2)
    ctx.restore()

    const slice = data.slice(this.offset, this.offset + this.visibleBars)
    if (!slice.length) return

    const barW = (width - padR) / this.visibleBars
    const minL = Math.min(...slice.map(d => d.l))
    const maxH = Math.max(...slice.map(d => d.h))
    const range = maxH - minL || 1
    const toY = (price) => padT + (1 - (price - minL) / range) * (chartH - padT * 2)

    // Grid
    ctx.strokeStyle = t.grid
    ctx.lineWidth = 0.5
    for (let i = 0; i < 6; i++) {
      const y = padT + (chartH - padT * 2) * i / 5
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width - padR, y); ctx.stroke()
      ctx.fillStyle = t.text
      ctx.font = '11px ' + getComputedStyle(document.body).fontFamily
      ctx.textAlign = 'left'
      const price = maxH - range * i / 5
      ctx.fillText(price.toFixed(1), width - padR + 6, y + 4)
    }

    // Candles
    const candleW = Math.max(1, barW * 0.6)
    slice.forEach((d, i) => {
      const x = i * barW + barW / 2
      const bull = d.c >= d.o
      const color = bull ? t.bullCandle : t.bearCandle

      // Wick
      ctx.strokeStyle = t.wick
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, toY(d.h))
      ctx.lineTo(x, toY(d.l))
      ctx.stroke()

      // Body
      const oY = toY(d.o), cY = toY(d.c)
      const bodyH = Math.max(1, Math.abs(oY - cY))
      ctx.fillStyle = color
      ctx.fillRect(x - candleW / 2, Math.min(oY, cY), candleW, bodyH)
    })

    // Volume
    if (hasVolume) {
      const volTop = chartH
      const maxVol = Math.max(...slice.map(d => d.v)) || 1

      ctx.strokeStyle = t.grid
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(0, volTop); ctx.lineTo(width - padR, volTop); ctx.stroke()

      slice.forEach((d, i) => {
        const x = i * barW + barW / 2
        const h = (d.v / maxVol) * volH * 0.85
        const bull = d.c >= d.o
        ctx.fillStyle = bull ? t.bullVol : t.bearVol
        ctx.fillRect(x - candleW / 2, volTop + volH - h, candleW, h)
      })
    }

    // RSI
    if (hasRsi) {
      const rsiTop = chartH + volH
      const rsiBot = rsiTop + rsiH

      ctx.fillStyle = t.rsiBg
      ctx.fillRect(0, rsiTop, width - padR, rsiH)

      ctx.strokeStyle = t.rsiGrid
      ctx.lineWidth = 0.5

      const rsiToY = (val) => rsiTop + 8 + (1 - val / 100) * (rsiH - 16);
      [30, 50, 70].forEach(lv => {
        const y = rsiToY(lv)
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width - padR, y); ctx.stroke()
        ctx.fillStyle = t.text; ctx.font = '10px sans-serif'
        ctx.fillText(lv.toString(), width - padR + 6, y + 3)
      })

      // Overbought/oversold zones
      ctx.fillStyle = 'rgba(255,71,87,0.05)'
      ctx.fillRect(0, rsiToY(100), width - padR, rsiToY(70) - rsiToY(100))
      ctx.fillStyle = 'rgba(0,201,167,0.05)'
      ctx.fillRect(0, rsiToY(30), width - padR, rsiToY(0) - rsiToY(30))

      // RSI line
      const rsiValues = this._computeRSI(data, 14).slice(this.offset, this.offset + this.visibleBars)
      if (rsiValues.length > 1) {
        ctx.strokeStyle = t.rsiLine
        ctx.lineWidth = 1.5
        ctx.beginPath()
        rsiValues.forEach((val, i) => {
          if (val === null) return
          const x = i * barW + barW / 2
          const y = rsiToY(val)
          if (i === 0 || rsiValues[i - 1] === null) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
      }

      ctx.strokeStyle = t.grid; ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(0, rsiTop); ctx.lineTo(width - padR, rsiTop); ctx.stroke()
    }

    // Price axis line
    ctx.strokeStyle = t.axis
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(width - padR, 0)
    ctx.lineTo(width - padR, height)
    ctx.stroke()

    // Current price tag
    if (slice.length) {
      const lastC = slice[slice.length - 1].c
      const y = toY(lastC)
      const bull = slice[slice.length - 1].c >= slice[slice.length - 1].o
      ctx.fillStyle = bull ? t.bullCandle : t.bearCandle
      ctx.fillRect(width - padR, y - 10, padR, 20)

      ctx.setLineDash([4, 3])
      ctx.strokeStyle = bull ? t.bullCandle : t.bearCandle
      ctx.lineWidth = 0.8
      ctx.globalAlpha = 0.4
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width - padR, y); ctx.stroke()
      ctx.globalAlpha = 1
      ctx.setLineDash([])

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px ' + getComputedStyle(document.body).fontFamily
      ctx.textAlign = 'center'
      ctx.fillText(lastC.toFixed(1), width - padR / 2, y + 4)
    }
  }

  _computeRSI(data, period = 14) {
    const rsi = new Array(data.length).fill(null)
    if (data.length < period + 1) return rsi

    let avgGain = 0, avgLoss = 0
    for (let i = 1; i <= period; i++) {
      const diff = data[i].c - data[i - 1].c
      if (diff > 0) avgGain += diff; else avgLoss += Math.abs(diff)
    }
    avgGain /= period; avgLoss /= period

    rsi[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)

    for (let i = period + 1; i < data.length; i++) {
      const diff = data[i].c - data[i - 1].c
      const gain = diff > 0 ? diff : 0
      const loss = diff < 0 ? Math.abs(diff) : 0
      avgGain = (avgGain * (period - 1) + gain) / period
      avgLoss = (avgLoss * (period - 1) + loss) / period
      rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
    }
    return rsi
  }

  startLive() {
    if (this.destroyed) return
    this._liveTimer = setInterval(() => {
      if (!this.data.length) return
      const last = this.data[this.data.length - 1]
      const change = (Math.random() - 0.48) * 0.003 * last.c
      const newC = last.c + change
      this.data[this.data.length - 1] = {
        ...last,
        c: +newC.toFixed(2),
        h: +Math.max(last.h, newC).toFixed(2),
        l: +Math.min(last.l, newC).toFixed(2),
      }

      if (Math.random() < 0.02) {
        const prev = this.data[this.data.length - 1]
        const newBar = {
          t: prev.t + 300,
          o: prev.c, h: prev.c, l: prev.c, c: prev.c,
          v: +(50 + Math.random() * 200).toFixed(2),
        }
        this.data.push(newBar)
        this.offset = Math.max(0, this.data.length - this.visibleBars)
      }

      this.render()
    }, 500)
  }

  destroy() {
    this.destroyed = true
    clearInterval(this._liveTimer)
    window.removeEventListener('resize', this._onResize)
    this.canvas.removeEventListener('wheel', this._onWheel)
  }
}

// ── Init ──────────────────────────────────────────────────────

const canvas = document.getElementById('chart-canvas')
const placeholder = document.querySelector('.chart-placeholder')
const chart = new DemoChart(canvas)

setTimeout(() => {
  const data = generateOHLCV(500, 65000)
  chart.setData(data)
  chart.startLive()
  placeholder.classList.add('hidden')
}, 800)

// ── Toolbar handlers ────────────────────────────────────────

document.getElementById('btn-dark').addEventListener('click', function () {
  this.classList.add('active')
  document.getElementById('btn-light').classList.remove('active')
  chart.setTheme('dark')
  document.body.style.background = '#0b0e14'
  document.querySelector('.header').style.background = 'rgba(11, 14, 20, 0.85)'
})

document.getElementById('btn-light').addEventListener('click', function () {
  this.classList.add('active')
  document.getElementById('btn-dark').classList.remove('active')
  chart.setTheme('light')
  document.body.style.background = '#ffffff'
  document.querySelector('.header').style.background = 'rgba(255, 255, 255, 0.85)'
})

document.querySelectorAll('.toolbar-btn.toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const ind = btn.dataset.indicator
    const active = btn.dataset.active === 'true'
    btn.dataset.active = active ? 'false' : 'true'

    if (active) chart.indicators.delete(ind)
    else chart.indicators.add(ind)

    chart.render()
  })
})

document.querySelectorAll('.toolbar-btn[data-symbol]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toolbar-btn[data-symbol]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    const prices = { BTCUSDT: 65000, ETHUSDT: 3400, SOLUSDT: 145 }
    const data = generateOHLCV(500, prices[btn.dataset.symbol] || 65000)
    chart.setData(data)
  })
})

document.querySelectorAll('.toolbar-btn[data-tf]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toolbar-btn[data-tf]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    chart.render()
  })
})

document.querySelectorAll('.toolbar-btn[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toolbar-btn[data-tool]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    setTimeout(() => btn.classList.remove('active'), 2000)
  })
})
