import WebSocket from 'ws'

const BASE_WS = 'wss://stream.bybit.com/v5/public/linear'
const BASE_REST = 'https://api.bybit.com'

export class BybitAdapter {
  constructor(symbol, onKline, onTrade, onDepth) {
    this.symbol = symbol.toUpperCase()
    this.onKline = onKline
    this.onTrade = onTrade
    this.onDepth = onDepth
    this.ws = null
    this.depthBook = { bids: new Map(), asks: new Map() }
    this._destroyed = false
  }

  async start() {
    this._connectWs()
  }

  destroy() {
    this._destroyed = true
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  _connectWs() {
    if (this._destroyed) return
    this.ws = new WebSocket(BASE_WS)

    this.ws.on('open', () => {
      console.log(`[Bybit] Connected: ${this.symbol}`)
      this.ws.send(JSON.stringify({
        op: 'subscribe',
        args: [
          `publicTrade.${this.symbol}`,
          `orderbook.50.${this.symbol}`,
          `kline.1.${this.symbol}`,
        ],
      }))
    })

    this.ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw)
        if (!msg.topic) return

        if (msg.topic.startsWith('publicTrade')) {
          this._handleTrades(msg.data)
        } else if (msg.topic.startsWith('orderbook')) {
          this._handleOrderbook(msg)
        } else if (msg.topic.startsWith('kline')) {
          this._handleKline(msg.data)
        }
      } catch {}
    })

    this.ws.on('close', () => {
      if (!this._destroyed) {
        console.log('[Bybit] WS closed, reconnecting in 3s...')
        setTimeout(() => this._connectWs(), 3000)
      }
    })

    this.ws.on('error', (e) => {
      console.error('[Bybit] WS error:', e.message)
    })
  }

  _handleTrades(trades) {
    for (const t of trades) {
      this.onTrade({
        time: parseInt(t.T),
        price: parseFloat(t.p),
        qty: parseFloat(t.v),
        isSell: t.S === 'Sell',
      })
    }
  }

  _handleOrderbook(msg) {
    if (msg.type === 'snapshot') {
      this.depthBook.bids.clear()
      this.depthBook.asks.clear()
    }
    for (const [p, q] of (msg.data?.b || [])) {
      const price = parseFloat(p)
      const qty = parseFloat(q)
      if (qty === 0) this.depthBook.bids.delete(price)
      else this.depthBook.bids.set(price, qty)
    }
    for (const [p, q] of (msg.data?.a || [])) {
      const price = parseFloat(p)
      const qty = parseFloat(q)
      if (qty === 0) this.depthBook.asks.delete(price)
      else this.depthBook.asks.set(price, qty)
    }

    const bids = [...this.depthBook.bids.entries()]
      .sort((a, b) => b[0] - a[0]).slice(0, 1000)
    const asks = [...this.depthBook.asks.entries()]
      .sort((a, b) => a[0] - b[0]).slice(0, 1000)

    this.onDepth({ bids, asks, time: Date.now() })
  }

  _handleKline(data) {
    if (!data || !data.length) return
    const k = data[0]
    this.onKline({
      time: parseInt(k.start),
      open: parseFloat(k.open),
      high: parseFloat(k.high),
      low: parseFloat(k.low),
      close: parseFloat(k.close),
      volume: parseFloat(k.volume),
      closed: k.confirm,
    })
  }
}

export async function fetchKlineHistory(symbol, interval = '1', limit = 1000) {
  const url = `${BASE_REST}/v5/market/kline?category=linear&symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.result?.list) return []
  return data.result.list.reverse().map(k => ({
    time: parseInt(k[0]),
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }))
}

export async function fetchOpenInterest(symbol) {
  try {
    const url = `${BASE_REST}/v5/market/open-interest?category=linear&symbol=${symbol.toUpperCase()}&intervalTime=5min&limit=1`
    const res = await fetch(url)
    const data = await res.json()
    const item = data.result?.list?.[0]
    if (!item) return null
    return { oi: parseFloat(item.openInterest), time: parseInt(item.timestamp) }
  } catch { return null }
}
