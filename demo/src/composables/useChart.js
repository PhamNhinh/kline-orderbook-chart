import { ref } from 'vue'
import { createChartBridge, prefetchEngine } from 'kline-orderbook-chart'
import { registerAlphaTrend } from '../indicators/alphaTrend.js'

prefetchEngine()

export function useChart() {
  const bridge = ref(null)
  const chartType = ref(0)
  const activeDrawingTool = ref(null)
  const volumeEnabled = ref(true)
  const rsiEnabled = ref(true)
  const oiEnabled = ref(true)
  const alphaTrendEnabled = ref(true)

  // Holds the id returned by `bridge.addIndicator(...)` so we can toggle
  // visibility / update params / remove the indicator later. See
  // `src/indicators/alphaTrend.js` for the indicator itself — it's a
  // self-contained module that you can copy-paste as a starting point
  // for your own custom indicators.
  let _alphaTrendId = null

  let _tickSize = 10
  let _klineCount = 0
  let _lastKlineTime = 0
  let _candleSec = 60
  let _oiValues = null

  let _tradeBuf = []
  let _tradeFlushId = null
  let _heatmapInited = false
  let _heatmapColsBuf = []
  let _heatmapFlushId = null

  const DRAWING_STYLES = {
    trendline:  { r: 88, g: 166, b: 255, lineWidth: 2, dashed: false, fontSize: 12 },
    hline:      { r: 240, g: 136, b: 62, lineWidth: 2, dashed: true, fontSize: 12 },
    arrow:      { r: 88, g: 166, b: 255, lineWidth: 2, dashed: false, fontSize: 12 },
    fib:        { r: 210, g: 153, b: 34, lineWidth: 1, dashed: false, fontSize: 12 },
    fibext:     { r: 210, g: 153, b: 34, lineWidth: 1, dashed: false, fontSize: 12 },
    measure:    { r: 139, g: 148, b: 158, lineWidth: 1, dashed: false, fontSize: 12 },
    circle:     { r: 136, g: 87, b: 229, lineWidth: 2, dashed: false, fontSize: 12 },
    channel:    { r: 88, g: 166, b: 255, lineWidth: 1, dashed: false, fontSize: 12 },
    long:       { r: 63, g: 185, b: 80, lineWidth: 2, dashed: false, fontSize: 12 },
    short:      { r: 248, g: 81, b: 73, lineWidth: 2, dashed: false, fontSize: 12 },
    vwap:       { r: 187, g: 128, b: 255, lineWidth: 2, dashed: false, fontSize: 12 },
    brush:      { r: 88, g: 166, b: 255, lineWidth: 2, dashed: false, fontSize: 12 },
    path:       { r: 88, g: 166, b: 255, lineWidth: 2, dashed: false, fontSize: 12 },
    textnote:   { r: 230, g: 237, b: 243, lineWidth: 2, dashed: false, fontSize: 14 },
    pricelabel: { r: 230, g: 237, b: 243, lineWidth: 2, dashed: false, fontSize: 13 },
  }

  // Demo-bundle license — Ed25519-signed perpetual enterprise token,
  // bound to a SINGLE domain (`demo.mrd-indicators.com`) plus the
  // implicit localhost / 127.0.0.1 / 0.0.0.0 bypass that the lib's
  // `validateLicense` always applies. Cloning this demo and running
  // `npm run dev` Just Works because of that bypass — no need to
  // touch the token to evaluate the engine locally.
  //
  // Deliberately NARROW scope: an earlier revision of this token
  // also covered `*.github.io,*.vercel.app,*.netlify.app,
  // *.codesandbox.io,*.stackblitz.io` so a forked demo would render
  // on those platforms without watermark. We pulled that whitelist
  // because those platforms are valid permanent prod hosts — a
  // clone with the embedded token could ship a free production
  // instance of the engine indefinitely, defeating the paid model.
  // On any domain outside `demo.mrd-indicators.com` + localhost the
  // lib transparently falls back to a 30-day watermarked trial via
  // `_createTrialLicense` (chart still works, just shows the
  // trial-expiry counter + watermark badge).
  //
  // Token is public-by-design — see internal
  // `release/mrd-chart-demo/src/main.js` for the long-form rationale
  // block. Re-issue via the issuer script if the demo ever moves to
  // a different domain; keep the domain list minimal.
  const DEMO_LICENSE = 'eyJhbGciOiJFZERTQSIsInR5cCI6Ik1SRC1MSUMifQ.eyJwIjoiZW50ZXJwcmlzZSIsInBsIjoid2ViIiwiaWF0IjoxNzc5NDUzNDY0LCJpc3MiOiJtcmQtbGljZW5zZS1zdmMiLCJkIjoiZGVtby5tcmQtaW5kaWNhdG9ycy5jb20iLCJzdWIiOiJkZW1vLWJ1bmRsZSJ9.JnXmQz3EwPPfk0hkQt1UEpXuA7ul2bUlCwm7Nd9JG6tJMN8wqCZteMY3VZXR1BnG5HSM8xNJnt0ciU0OUMG-Cg'

  async function init(canvas) {
    const b = await createChartBridge(canvas, { licenseKey: DEMO_LICENSE })

    b.setCandleInterval(_candleSec)
    b.setPrecision(2)
    b.setChartType(chartType.value)

    b.enableVolume()
    b.enableRsi()
    b.setRsiPeriod(14)
    b.setRsiSmoothing(3)
    b.setRsiShowSignals(true)
    b.setRsiShowDivergence(true)
    b.setRsiShowTraps(true)
    b.setRsiShowEma(true)
    b.setRsiShowWma(false)
    b.enableOi()

    b.onDrawingComplete(() => { activeDrawingTool.value = null })
    b.onDrawingCancel(() => { activeDrawingTool.value = null })

    // Register the example custom indicator. Registration only needs
    // to happen once per chart — toggling visibility later is done via
    // `bridge.setIndicatorEnabled(id, on)` (see `toggleAlphaTrend`).
    _alphaTrendId = registerAlphaTrend(b, { period: 14, coef: 1 })

    b.start()
    bridge.value = b
    return b
  }

  function setHistory(msg) {
    const b = bridge.value
    if (!b) return

    const klines = msg.klines
    _tickSize = msg.tickSize || 10
    _klineCount = klines.length

    b.setKlines(
      new Float64Array(klines.map(k => k.time / 1000)),
      new Float64Array(klines.map(k => k.open)),
      new Float64Array(klines.map(k => k.high)),
      new Float64Array(klines.map(k => k.low)),
      new Float64Array(klines.map(k => k.close)),
      new Float64Array(klines.map(k => k.volume)),
    )

    if (klines.length > 0) {
      _lastKlineTime = klines[klines.length - 1].time / 1000
    }

    b.setFootprintTickSize(_tickSize)
    b.footprintEnsureLen(_klineCount)
    _buildSyntheticFootprint(b, klines)

    _heatmapInited = false
    _heatmapColsBuf = []

    _oiValues = new Float64Array(_klineCount)
    if (msg.oiHistory?.length > 0 && klines.length > 0) {
      const hist = msg.oiHistory
      let idx = 0
      for (let i = 0; i < klines.length; i++) {
        while (idx < hist.length - 1 && hist[idx + 1].time <= klines[i].time) idx++
        _oiValues[i] = hist[idx].oi
      }
      b.setOiData(_oiValues)
    }
  }

  function _buildSyntheticFootprint(b, klines) {
    for (let i = 0; i < klines.length; i++) {
      const k = klines[i]
      const range = k.high - k.low
      if (range <= 0) continue

      const steps = Math.max(1, Math.round(range / _tickSize))
      const prices = [], bids = [], asks = []

      for (let s = 0; s <= steps; s++) {
        const price = k.low + s * _tickSize
        const dist = Math.abs(price - (k.open + k.close) / 2) / range
        const weight = Math.exp(-dist * dist * 4)
        const vol = k.volume * weight / (steps + 1)
        const buyRatio = (k.close - k.low) / range
        prices.push(price)
        bids.push(vol * (1 - buyRatio))
        asks.push(vol * buyRatio)
      }

      b.footprintSetBar(i, _tickSize, new Float64Array(prices), new Float64Array(bids), new Float64Array(asks))
    }
  }

  // --- Real-time handlers ---

  function handleKline(kline) {
    const b = bridge.value
    if (!b) return

    const snapped = Math.floor(kline.time / 1000 / _candleSec) * _candleSec

    if (kline.closed || snapped > _lastKlineTime) {
      b.appendKline(snapped, kline.open, kline.high, kline.low, kline.close, kline.volume)
      _klineCount++
      _lastKlineTime = snapped
      b.footprintEnsureLen(_klineCount)

      if (_oiValues && _oiValues.length < _klineCount) {
        const prev = _oiValues
        _oiValues = new Float64Array(_klineCount)
        _oiValues.set(prev)
        _oiValues[_klineCount - 1] = prev[prev.length - 1]
      }
    } else {
      b.updateLastKline(snapped, kline.open, kline.high, kline.low, kline.close, kline.volume)
    }
  }

  function handleTrade(trade) {
    const b = bridge.value
    if (!b || _klineCount === 0) return
    _tradeBuf.push(_klineCount - 1, trade.price, trade.qty, trade.isSell ? 1 : 0)
    if (_tradeFlushId === null) _tradeFlushId = requestAnimationFrame(_flushTrades)
  }

  function _flushTrades() {
    _tradeFlushId = null
    const b = bridge.value
    if (!b || _tradeBuf.length === 0) return
    b.footprintAddTradeBatch(new Float64Array(_tradeBuf))
    _tradeBuf.length = 0
  }

  function handleHeatmapColumn(col) { _enqueueHeatmap(col, false) }
  function handleHeatmapFrozen(col) { _enqueueHeatmap(col, true) }

  function _enqueueHeatmap(col, frozen) {
    _heatmapColsBuf.push({ col, frozen })
    if (_heatmapFlushId === null) _heatmapFlushId = requestAnimationFrame(_flushHeatmap)
  }

  function _flushHeatmap() {
    _heatmapFlushId = null
    const b = bridge.value
    if (!b || _heatmapColsBuf.length === 0) return

    for (const { col, frozen } of _heatmapColsBuf) {
      const ts = Math.floor(col.timestamp / 1000 / _candleSec) * _candleSec
      const values = new Float64Array(col.values)

      if (!_heatmapInited) {
        b.setHeatmap(values, col.rows, 1, ts, _candleSec, col.yStart, col.yStep)
        _heatmapInited = true
        continue
      }

      if (frozen) b.appendHeatmapColumn(values, ts, col.yStart, col.yStep)
      else b.updateHeatmapColumnAt(values, ts, col.yStart, col.yStep)
    }
    _heatmapColsBuf.length = 0
  }

  function handleOi(oi) {
    const b = bridge.value
    if (!b || _klineCount === 0) return

    if (!_oiValues || _oiValues.length !== _klineCount) {
      const prev = _oiValues
      _oiValues = new Float64Array(_klineCount)
      if (prev) _oiValues.set(prev.subarray(0, Math.min(prev.length, _klineCount)))
    }

    _oiValues[_klineCount - 1] = oi
    b.setOiData(_oiValues)
  }

  // --- User actions ---

  function setChartTypeValue(ct) {
    chartType.value = ct
    bridge.value?.setChartType(ct)
  }

  function startDrawing(tool, style) {
    const b = bridge.value
    if (!b) return
    activeDrawingTool.value = tool
    b.startDrawing(tool, style || DRAWING_STYLES[tool] || DRAWING_STYLES.trendline)
  }

  function cancelDrawing() {
    activeDrawingTool.value = null
    bridge.value?.cancelDrawing()
  }

  function deleteSelected() { bridge.value?.deleteSelectedDrawing() }
  function clearDrawings() { bridge.value?.clearDrawings() }

  function toggleVolume() {
    const b = bridge.value
    if (!b) return
    volumeEnabled.value = !volumeEnabled.value
    volumeEnabled.value ? b.enableVolume() : b.disableVolume()
  }

  function toggleRsi() {
    const b = bridge.value
    if (!b) return
    rsiEnabled.value = !rsiEnabled.value
    rsiEnabled.value ? b.enableRsi() : b.disableRsi()
  }

  function toggleOi() {
    const b = bridge.value
    if (!b) return
    oiEnabled.value = !oiEnabled.value
    oiEnabled.value ? b.enableOi() : b.disableOi()
  }

  // Custom indicators are toggled via `setIndicatorEnabled(id, on)` —
  // a no-op when the id is null (e.g. while the bridge is still booting
  // or the engine refused registration because of a license gate).
  function toggleAlphaTrend() {
    const b = bridge.value
    if (!b || _alphaTrendId === null) return
    alphaTrendEnabled.value = !alphaTrendEnabled.value
    b.setIndicatorEnabled(_alphaTrendId, alphaTrendEnabled.value)
  }

  function destroy() {
    if (_tradeFlushId !== null) cancelAnimationFrame(_tradeFlushId)
    if (_heatmapFlushId !== null) cancelAnimationFrame(_heatmapFlushId)
    _tradeBuf.length = 0
    _heatmapColsBuf.length = 0
    _oiValues = null
    _alphaTrendId = null
    bridge.value?.destroy()
    bridge.value = null
  }

  return {
    bridge, chartType, activeDrawingTool,
    volumeEnabled, rsiEnabled, oiEnabled, alphaTrendEnabled,
    init, setHistory,
    handleKline, handleTrade, handleHeatmapColumn, handleHeatmapFrozen, handleOi,
    setChartTypeValue, startDrawing, cancelDrawing, deleteSelected, clearDrawings,
    toggleVolume, toggleRsi, toggleOi, toggleAlphaTrend,
    destroy,
  }
}
