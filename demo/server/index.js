import { WebSocketServer } from 'ws'
import { BinanceAdapter, fetchKlineHistory as fetchBinanceKlines, fetchOpenInterest as fetchBinanceOi, fetchOiHistory as fetchBinanceOiHistory } from './exchanges/binance.js'
import { BybitAdapter, fetchKlineHistory as fetchBybitKlines, fetchOpenInterest as fetchBybitOi } from './exchanges/bybit.js'

const PORT = 4400
const CANDLE_SEC = 60
const CANDLE_MS = CANDLE_SEC * 1000

const EXCHANGES = {
  binance: {
    Adapter: BinanceAdapter,
    fetchKlines: fetchBinanceKlines,
    symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT'],
  },
  bybit: {
    Adapter: BybitAdapter,
    fetchKlines: fetchBybitKlines,
    symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT'],
  },
}

const MAX_HEATMAP_ROWS = 4000
const HEATMAP_PAD_ROWS = 20

class HeatmapAggregator {
  constructor(tickSize) {
    this.tickSize = tickSize
    this.bucketColumns = new Map()
    this.currentBucket = 0
    this.currentMaxColumn = new Map()
    this.aggrTime = CANDLE_MS
    this.midPrice = 0
    this.lastDepthGrouped = new Map()
  }

  _round(price) {
    const tick = this.tickSize
    return Math.round(price / tick) * tick
  }

  _computeMid(depth) {
    const bestBid = depth.bids.length > 0 ? depth.bids[0][0] : 0
    const bestAsk = depth.asks.length > 0 ? depth.asks[0][0] : 0
    if (bestBid > 0 && bestAsk > 0) return (bestBid + bestAsk) / 2
    return bestBid || bestAsk || this.midPrice
  }

  updateFromDepth(depth, timeMs) {
    const bucket = Math.floor(timeMs / this.aggrTime) * this.aggrTime

    if (this.currentBucket && bucket > this.currentBucket) {
      this._freezeBucket(this.currentBucket)
    }
    this.currentBucket = bucket

    this.midPrice = this._computeMid(depth)
    if (this.midPrice <= 0) return

    const grouped = new Map()
    for (const [price, qty] of depth.bids) {
      const rp = this._round(price)
      grouped.set(rp, (grouped.get(rp) || 0) + qty)
    }
    for (const [price, qty] of depth.asks) {
      const rp = this._round(price)
      grouped.set(rp, (grouped.get(rp) || 0) + qty)
    }
    this.lastDepthGrouped = grouped

    for (const [price, qty] of grouped) {
      const prev = this.currentMaxColumn.get(price) || 0
      if (qty > prev) this.currentMaxColumn.set(price, qty)
    }
  }

  _freezeBucket(bucketTime) {
    if (this.currentMaxColumn.size === 0) return
    this.bucketColumns.set(bucketTime, new Map(this.currentMaxColumn))
    this.currentMaxColumn.clear()

    const cutoff = Date.now() - 3600_000
    for (const [t] of this.bucketColumns) {
      if (t < cutoff) this.bucketColumns.delete(t)
    }
  }

  getCurrentColumn() {
    return this._buildColumn(this.lastDepthGrouped, Date.now())
  }

  getFrozenColumn(bucketTime) {
    const data = this.bucketColumns.get(bucketTime)
    if (!data) return null
    return this._buildColumn(data, bucketTime)
  }

  _buildColumn(priceMap, timestamp) {
    if (priceMap.size === 0 || this.midPrice <= 0) return null

    const tick = this.tickSize

    let pMin = Infinity
    let pMax = -Infinity
    for (const [price, qty] of priceMap) {
      if (qty > 0) {
        if (price < pMin) pMin = price
        if (price > pMax) pMax = price
      }
    }
    if (pMin > pMax) return null

    const yStart = this._round(pMin) - HEATMAP_PAD_ROWS * tick
    const yEnd = this._round(pMax) + HEATMAP_PAD_ROWS * tick
    let rows = Math.round((yEnd - yStart) / tick) + 1
    if (rows > MAX_HEATMAP_ROWS) rows = MAX_HEATMAP_ROWS
    if (rows < 10) return null

    const values = new Array(rows).fill(0)
    for (const [price, qty] of priceMap) {
      const idx = Math.round((price - yStart) / tick)
      if (idx >= 0 && idx < rows) values[idx] = qty
    }

    return { values, yStart, yStep: tick, rows, timestamp }
  }
}

function getTickSize(symbol) {
  const s = symbol.toUpperCase()
  if (s.startsWith('BTC')) return 0.5
  if (s.startsWith('ETH')) return 0.05
  if (s.startsWith('SOL')) return 0.005
  if (s.startsWith('BNB')) return 0.01
  if (s.startsWith('XRP')) return 0.0005
  return 0.001
}

const wss = new WebSocketServer({ port: PORT })
const subscriptions = new Map()

function broadcast(subKey, type, data) {
  const subs = subscriptions.get(subKey)
  if (!subs || subs.size === 0) return
  const msg = JSON.stringify({ type, ...data })
  for (const ws of subs) {
    if (ws.readyState === 1) ws.send(msg)
  }
}

const activeFeeds = new Map()

function getOrCreateFeed(exchange, symbol) {
  const key = `${exchange}:${symbol}`
  if (activeFeeds.has(key)) {
    const feed = activeFeeds.get(key)
    feed.refCount++
    return feed
  }

  const exConf = EXCHANGES[exchange]
  if (!exConf) return null

  const tick = getTickSize(symbol)
  const heatmap = new HeatmapAggregator(tick)
  let depthThrottle = 0
  let lastFrozenBucket = 0

  const adapter = new exConf.Adapter(
    symbol,
    (kline) => broadcast(key, 'kline', { kline }),
    (trade) => broadcast(key, 'trade', { trade }),
    (depth) => {
      const now = Date.now()
      const prevBucket = heatmap.currentBucket
      heatmap.updateFromDepth(depth, now)

      if (prevBucket && heatmap.currentBucket > prevBucket && prevBucket !== lastFrozenBucket) {
        lastFrozenBucket = prevBucket
        const frozen = heatmap.getFrozenColumn(prevBucket)
        if (frozen) {
          broadcast(key, 'heatmap_frozen', { column: frozen })
        }
      }

      if (now - depthThrottle < 150) return
      depthThrottle = now
      const col = heatmap.getCurrentColumn()
      if (col) broadcast(key, 'heatmap', { column: col })
    },
  )

  const fetchOi = exchange === 'binance' ? fetchBinanceOi : fetchBybitOi

  let oiTimer = null
  if (fetchOi) {
    const pollOi = async () => {
      try {
        const data = await fetchOi(symbol)
        if (data) broadcast(key, 'oi', { oi: data.oi, time: data.time })
      } catch {}
    }
    pollOi()
    oiTimer = setInterval(pollOi, 5000)
  }

  const feed = { adapter, heatmap, refCount: 1, key, oiTimer }
  activeFeeds.set(key, feed)
  adapter.start()
  return feed
}

function releaseFeed(key) {
  const feed = activeFeeds.get(key)
  if (!feed) return
  feed.refCount--
  if (feed.refCount <= 0) {
    feed.adapter.destroy()
    if (feed.oiTimer) clearInterval(feed.oiTimer)
    activeFeeds.delete(key)
    console.log(`[Server] Feed destroyed: ${key}`)
  }
}

wss.on('connection', (ws) => {
  let currentSubKey = null
  let currentFeed = null

  ws.on('message', async (raw) => {
    try {
      const msg = JSON.parse(raw)

      if (msg.action === 'subscribe') {
        const { exchange, symbol } = msg
        const key = `${exchange}:${symbol}`

        if (currentSubKey) {
          const subs = subscriptions.get(currentSubKey)
          if (subs) subs.delete(ws)
          releaseFeed(currentSubKey)
        }

        currentSubKey = key
        currentFeed = getOrCreateFeed(exchange, symbol)

        if (!subscriptions.has(key)) subscriptions.set(key, new Set())
        subscriptions.get(key).add(ws)

        const exConf = EXCHANGES[exchange]
        try {
          const [klines, oiHist] = await Promise.all([
            exConf.fetchKlines(symbol),
            exchange === 'binance' ? fetchBinanceOiHistory(symbol, '5m', 500) : Promise.resolve([]),
          ])
          ws.send(JSON.stringify({
            type: 'history',
            klines,
            oiHistory: oiHist,
            tickSize: getTickSize(symbol),
            exchange,
            symbol,
          }))
        } catch (e) {
          console.error(`[Server] Kline fetch error: ${e.message}`)
        }

        console.log(`[Server] ${exchange}:${symbol} subscribed (clients: ${subscriptions.get(key).size})`)
      }

      if (msg.action === 'exchanges') {
        ws.send(JSON.stringify({
          type: 'exchanges',
          data: Object.entries(EXCHANGES).map(([id, conf]) => ({
            id,
            name: id.charAt(0).toUpperCase() + id.slice(1),
            symbols: conf.symbols,
          })),
        }))
      }
    } catch (e) {
      console.error('[Server] Message parse error:', e.message)
    }
  })

  ws.on('close', () => {
    if (currentSubKey) {
      const subs = subscriptions.get(currentSubKey)
      if (subs) subs.delete(ws)
      releaseFeed(currentSubKey)
    }
  })
})

console.log(`\n  MRD Chart Demo Server running on ws://localhost:${PORT}`)
console.log(`  Exchanges: ${Object.keys(EXCHANGES).join(', ')}`)
console.log(`  Symbols per exchange: ${EXCHANGES.binance.symbols.join(', ')}\n`)
