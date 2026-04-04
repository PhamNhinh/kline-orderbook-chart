/**
 * Iceberg Order Detector
 *
 * Monitors orderbook snapshots over time to detect "refill" patterns:
 * when a price level's volume is consumed and immediately replenished,
 * indicating a hidden iceberg order.
 *
 * Usage:
 *   const detector = createIcebergDetector()
 *   // On each orderbook update:
 *   detector.onOrderbookUpdate(bids, asks, timestamp)
 *   // Get detected icebergs:
 *   const events = detector.getEvents()
 *   // Push to WASM:
 *   detector.pushToEngine(bridge)
 */

const DEFAULT_OPTS = {
  minRefills: 3,
  hiddenRatio: 2.0,
  refillWindowMs: 10000,
  maxTrackedLevels: 200,
  maxEvents: 500,
  decayMs: 300000,
}

export function createIcebergDetector(opts = {}) {
  const cfg = { ...DEFAULT_OPTS, ...opts }

  // Track per-level state: { lastVol, refills, totalConsumed, lastRefillTs, peakVisible }
  const bidLevels = new Map()
  const askLevels = new Map()
  const events = []
  let lastTs = 0

  function _roundPrice(p) {
    return Math.round(p * 1e8) / 1e8
  }

  function _processLevels(currentMap, trackedMap, isBid, ts) {
    for (const [price, vol] of currentMap) {
      const key = _roundPrice(price)
      const prev = trackedMap.get(key)

      if (!prev) {
        trackedMap.set(key, {
          lastVol: vol,
          refills: 0,
          totalConsumed: 0,
          lastRefillTs: ts,
          peakVisible: vol,
        })
        continue
      }

      // Volume decreased significantly (consumed)
      if (vol < prev.lastVol * 0.3 && prev.lastVol > 0) {
        const consumed = prev.lastVol - vol
        prev.totalConsumed += consumed
        prev.lastVol = vol
        continue
      }

      // Volume refilled after consumption
      if (vol > prev.lastVol * 1.5 && prev.totalConsumed > 0) {
        const timeSinceRefill = ts - prev.lastRefillTs
        if (timeSinceRefill < cfg.refillWindowMs) {
          prev.refills++
          prev.lastRefillTs = ts
          prev.peakVisible = Math.max(prev.peakVisible, vol)

          if (prev.refills >= cfg.minRefills) {
            const hiddenSize = prev.totalConsumed
            const visibleSize = prev.peakVisible
            if (hiddenSize >= visibleSize * cfg.hiddenRatio) {
              events.push({
                timestamp: ts,
                price,
                visibleSize,
                hiddenSize,
                isBid,
                refillCount: prev.refills,
              })
              if (events.length > cfg.maxEvents) events.shift()

              prev.refills = 0
              prev.totalConsumed = 0
            }
          }
        } else {
          prev.refills = 1
          prev.totalConsumed = 0
          prev.lastRefillTs = ts
        }
      }

      prev.lastVol = vol
    }

    // Trim stale levels
    if (trackedMap.size > cfg.maxTrackedLevels) {
      const entries = [...trackedMap.entries()]
      entries.sort((a, b) => a[1].lastRefillTs - b[1].lastRefillTs)
      const toRemove = entries.length - cfg.maxTrackedLevels
      for (let i = 0; i < toRemove; i++) {
        trackedMap.delete(entries[i][0])
      }
    }
  }

  function onOrderbookUpdate(bids, asks, timestamp) {
    const ts = timestamp || Date.now()
    lastTs = ts

    // bids/asks: array of [price, vol] or Map
    const bidMap = bids instanceof Map ? bids : new Map(bids.map(([p, v]) => [p, v]))
    const askMap = asks instanceof Map ? asks : new Map(asks.map(([p, v]) => [p, v]))

    _processLevels(bidMap, bidLevels, true, ts)
    _processLevels(askMap, askLevels, false, ts)

    // Decay old events
    const cutoff = ts - cfg.decayMs
    while (events.length > 0 && events[0].timestamp < cutoff) {
      events.shift()
    }
  }

  function getEvents() {
    return events
  }

  function pushToEngine(bridge) {
    if (!bridge || events.length === 0) return

    const n = events.length
    const timestamps = new Float64Array(n)
    const prices = new Float64Array(n)
    const visibleSizes = new Float64Array(n)
    const hiddenSizes = new Float64Array(n)
    const isBids = new Uint8Array(n)
    const refillCounts = new Uint32Array(n)

    for (let i = 0; i < n; i++) {
      const e = events[i]
      timestamps[i] = e.timestamp
      prices[i] = e.price
      visibleSizes[i] = e.visibleSize
      hiddenSizes[i] = e.hiddenSize
      isBids[i] = e.isBid ? 1 : 0
      refillCounts[i] = e.refillCount
    }

    bridge.setIcebergEvents(timestamps, prices, visibleSizes, hiddenSizes, isBids, refillCounts)
  }

  function reset() {
    bidLevels.clear()
    askLevels.clear()
    events.length = 0
  }

  return {
    onOrderbookUpdate,
    getEvents,
    pushToEngine,
    reset,
  }
}
