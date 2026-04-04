import { ref, shallowRef } from 'vue'

const SERVER_URL = 'ws://localhost:4400'

export function useMarketData() {
  const connected = ref(false)
  const exchanges = shallowRef([])
  const currentExchange = ref('')
  const currentSymbol = ref('')
  const stats = ref({ trades: 0, depthUpdates: 0, tps: 0 })

  let ws = null
  let _onHistory = null
  let _onKline = null
  let _onTrade = null
  let _onHeatmap = null
  let _onHeatmapFrozen = null
  let _onOi = null
  let _tradeCount = 0
  let _depthCount = 0
  let _tpsWindow = []

  function connect() {
    ws = new WebSocket(SERVER_URL)

    ws.onopen = () => {
      connected.value = true
      ws.send(JSON.stringify({ action: 'exchanges' }))
    }

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)

      switch (msg.type) {
        case 'exchanges':
          exchanges.value = msg.data
          break
        case 'history':
          _onHistory?.(msg)
          break
        case 'kline':
          _onKline?.(msg.kline)
          break
        case 'trade': {
          _tradeCount++
          const now = Date.now()
          _tpsWindow.push(now)
          while (_tpsWindow.length > 0 && _tpsWindow[0] < now - 1000) _tpsWindow.shift()
          stats.value = { trades: _tradeCount, depthUpdates: _depthCount, tps: _tpsWindow.length }
          _onTrade?.(msg.trade)
          break
        }
        case 'heatmap':
          _depthCount++
          stats.value = { ...stats.value, depthUpdates: _depthCount }
          _onHeatmap?.(msg.column)
          break
        case 'heatmap_frozen':
          _onHeatmapFrozen?.(msg.column)
          break
        case 'oi':
          _onOi?.(msg.oi, msg.time)
          break
      }
    }

    ws.onclose = () => {
      connected.value = false
      setTimeout(connect, 3000)
    }
  }

  function subscribe(exchange, symbol) {
    if (!ws || ws.readyState !== 1) return
    currentExchange.value = exchange
    currentSymbol.value = symbol
    _tradeCount = 0
    _depthCount = 0
    _tpsWindow = []
    stats.value = { trades: 0, depthUpdates: 0, tps: 0 }
    ws.send(JSON.stringify({ action: 'subscribe', exchange, symbol }))
  }

  function onHistory(fn) { _onHistory = fn }
  function onKline(fn) { _onKline = fn }
  function onTrade(fn) { _onTrade = fn }
  function onHeatmap(fn) { _onHeatmap = fn }
  function onHeatmapFrozen(fn) { _onHeatmapFrozen = fn }
  function onOi(fn) { _onOi = fn }

  return {
    connected,
    exchanges,
    currentExchange,
    currentSymbol,
    stats,
    connect,
    subscribe,
    onHistory,
    onKline,
    onTrade,
    onHeatmap,
    onHeatmapFrozen,
    onOi,
  }
}
