import WebSocket from 'ws'

const BASE_WS = 'wss://fstream.binance.com'
const BASE_REST = 'https://fapi.binance.com'

export class BinanceAdapter {
  constructor(symbol, onKline, onTrade, onDepth) {
    this.symbol = symbol.toLowerCase()
    this.onKline = onKline
    this.onTrade = onTrade
    this.onDepth = onDepth
    this.ws = null
    this.depthBook = { bids: new Map(), asks: new Map() }
    this.snapshotLoaded = false
    this._destroyed = false
  }

  async start() {
    await this._loadDepthSnapshot()
    this._connectWs()
  }

  destroy() {
    this._destroyed = true
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  async _loadDepthSnapshot() {
    try {
      const url = `${BASE_REST}/fapi/v1/depth?symbol=${this.symbol.toUpperCase()}&limit=1000`
      const res = await fetch(url)
      const data = await res.json()
      if (!data.bids) return

      this.depthBook.bids.clear()
      this.depthBook.asks.clear()
      for (const [p, q] of data.bids) {
        this.depthBook.bids.set(parseFloat(p), parseFloat(q))
      }
      for (const [p, q] of data.asks) {
        this.depthBook.asks.set(parseFloat(p), parseFloat(q))
      }
      this.snapshotLoaded = true
      this._emitDepth()
    } catch (e) {
      console.error('[Binance] Depth snapshot failed:', e.message)
    }
  }

  _connectWs() {
    if (this._destroyed) return
    const streams = [
      `${this.symbol}@aggTrade`,
      `${this.symbol}@depth@100ms`,
      `${this.symbol}@kline_1m`,
    ].join('/')

    const url = `${BASE_WS}/stream?streams=${streams}`
    this.ws = new WebSocket(url)

    this.ws.on('open', () => {
      console.log(`[Binance] Connected: ${this.symbol.toUpperCase()}`)
    })

    this.ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw)
        const stream = msg.stream
        const data = msg.data

        if (stream.endsWith('@aggTrade')) {
          this._handleTrade(data)
        } else if (stream.includes('@depth')) {
          this._handleDepthDiff(data)
        } else if (stream.includes('@kline_')) {
          this._handleKline(data)
        }
      } catch {}
    })

    this.ws.on('close', () => {
      if (!this._destroyed) {
        console.log('[Binance] WS closed, reconnecting in 3s...')
        setTimeout(() => this._connectWs(), 3000)
      }
    })

    this.ws.on('error', (e) => {
      console.error('[Binance] WS error:', e.message)
    })
  }

  _handleTrade(d) {
    this.onTrade({
      time: d.T,
      price: parseFloat(d.p),
      qty: parseFloat(d.q),
      isSell: d.m,
    })
  }

  _handleKline(d) {
    const k = d.k
    this.onKline({
      time: k.t,
      open: parseFloat(k.o),
      high: parseFloat(k.h),
      low: parseFloat(k.l),
      close: parseFloat(k.c),
      volume: parseFloat(k.v),
      closed: k.x,
    })
  }

  _handleDepthDiff(d) {
    if (!this.snapshotLoaded) return
    for (const [p, q] of (d.b || [])) {
      const price = parseFloat(p)
      const qty = parseFloat(q)
      if (qty === 0) this.depthBook.bids.delete(price)
      else this.depthBook.bids.set(price, qty)
    }
    for (const [p, q] of (d.a || [])) {
      const price = parseFloat(p)
      const qty = parseFloat(q)
      if (qty === 0) this.depthBook.asks.delete(price)
      else this.depthBook.asks.set(price, qty)
    }
    this._emitDepth()
  }

  _emitDepth() {
    const bids = [...this.depthBook.bids.entries()]
      .sort((a, b) => b[0] - a[0])
      .slice(0, 1000)
    const asks = [...this.depthBook.asks.entries()]
      .sort((a, b) => a[0] - b[0])
      .slice(0, 1000)

    this.onDepth({ bids, asks, time: Date.now() })
  }
}

export async function fetchKlineHistory(symbol, interval = '1m', limit = 1500) {
  const url = `${BASE_REST}/fapi/v1/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
  const res = await fetch(url)
  const data = await res.json()
  return data.map(k => ({
    time: k[0],
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }))
}

export async function fetchOpenInterest(symbol) {
  try {
    const url = `${BASE_REST}/fapi/v1/openInterest?symbol=${symbol.toUpperCase()}`
    const res = await fetch(url)
    const data = await res.json()
    return { oi: parseFloat(data.openInterest), time: data.time }
  } catch { return null }
}

export async function fetchOiHistory(symbol, period = '5m', limit = 200) {
  try {
    const url = `https://fapi.binance.com/futures/data/openInterestHist?symbol=${symbol.toUpperCase()}&period=${period}&limit=${limit}`
    const res = await fetch(url)
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map(d => ({
      time: d.timestamp,
      oi: parseFloat(d.sumOpenInterest),
    }))
  } catch { return [] }
}
