# Built-in Indicators

> 📖 **The canonical version of this page is now hosted at [https://mrd-indicators.com/docs/indicators](https://mrd-indicators.com/docs/indicators)** — this Markdown mirror is kept for offline / GitHub browsing.


kline-orderbook-chart includes 14+ built-in indicators computed entirely inside the native engine. Each indicator renders in its own sub-pane or as an overlay on the main chart.

---

## Indicator Summary

| Indicator | Pane | Plan | Data Source |
|---|---|---|---|
| [Volume](#volume) | Sub-pane (below candles) | All | Kline data (automatic) |
| [RSI](#rsi) | Sub-pane | All | Kline data (automatic) |
| [Open Interest](#open-interest) | Sub-pane or overlay | Professional+ | External data feed |
| [Funding Rate](#funding-rate) | Sub-pane | Professional+ | External data feed |
| [CVD](#cvd-cumulative-volume-delta) | Sub-pane | Professional+ | External data feed |
| [VPIN](#vpin) | Sub-pane | Enterprise | External data feed |
| [Large Trades](#large-trades) | Overlay on main chart | Professional+ | External data feed |
| [Liquidation Heatmap](#liquidation-heatmap) | Overlay on main chart | Professional+ | External data feed |
| [VRVP](#vrvp-visible-range-volume-profile) | Overlay on main chart | Enterprise | Kline data (automatic) |
| [TPO / Market Profile](#tpo-market-profile) | Overlay on main chart | Enterprise | Kline data (automatic) |
| [Smart Ranges (SMC)](#smart-ranges-smc) | Overlay on main chart | Enterprise | Kline data (automatic) |
| [EMA Structure](#ema-structure) | Overlay on main chart | Enterprise | Kline data (automatic) |
| [Stops & Icebergs](#stops--icebergs) | Overlay on main chart | Enterprise | External data feed |
| [Forex Signals](#forex-signals) | Overlay on main chart | Enterprise | Kline data (automatic) |
| [Live Signals](#live-signals) | Overlay on main chart | All | External data feed |

**"Automatic"** means the indicator computes from kline data already loaded via `setKlines()`. **"External data feed"** means you must provide additional data arrays.

---

## Volume

The volume histogram renders below the candlestick chart, with bars colored by candle direction (bull/bear). Includes optional moving average, climax bar detection, and volume signals.

**Plan:** All plans.

### Enable / Disable

```javascript
chart.enableVolume()
chart.disableVolume()
chart.isVolumeEnabled()   // → boolean
```

### Configuration

#### `setVolumeMaPeriod(period)` / `getVolumeMaPeriod()`

Moving average period for the volume MA line (default: 20).

```javascript
chart.setVolumeMaPeriod(20)
```

#### `setVolumeShowMa(show)` / `getVolumeShowMa()`

Toggle the volume moving average line.

```javascript
chart.setVolumeShowMa(true)
```

#### `setVolumeShowSignals(show)` / `getVolumeShowSignals()`

Toggle climax volume signals (extreme volume spikes).

```javascript
chart.setVolumeShowSignals(true)
```

#### `setVolumeColorMode(mode)` / `getVolumeColorMode()`

Controls the color scheme of volume bars.

| Value | Mode |
|---|---|
| `0` | Standard (bull green / bear red) |
| `1` | Gradient intensity |

```javascript
chart.setVolumeColorMode(0)
```

---

## RSI

The Relative Strength Index with divergence detection, EMA/WMA smoothing, and buy/sell signals.

**Plan:** All plans.

### Enable / Disable

```javascript
chart.enableRsi()
chart.disableRsi()
chart.isRsiEnabled()   // → boolean
```

### Configuration

#### `setRsiPeriod(period)`

RSI calculation period (default: 14).

```javascript
chart.setRsiPeriod(14)
```

#### `setRsiSmoothing(val)`

Smoothing factor applied to the RSI line.

```javascript
chart.setRsiSmoothing(3)
```

#### `setRsiShowEma(show)`

Show EMA overlay on RSI sub-pane.

```javascript
chart.setRsiShowEma(true)
```

#### `setRsiShowWma(show)`

Show WMA overlay on RSI sub-pane.

```javascript
chart.setRsiShowWma(true)
```

#### `setRsiShowSignals(show)`

Show buy/sell signal markers (pullback entries).

```javascript
chart.setRsiShowSignals(true)
```

#### `setRsiShowDivergence(show)`

Show bullish/bearish divergence between price and RSI.

```javascript
chart.setRsiShowDivergence(true)
```

#### `setRsiShowTraps(show)`

Show bull/bear trap detection based on RSI patterns.

```javascript
chart.setRsiShowTraps(true)
```

#### `setRsiRatio(ratio)` / `getRsiRatio()`

Controls the height ratio of the RSI sub-pane relative to the main chart.

```javascript
chart.setRsiRatio(0.15)   // 15% of total height
```

---

## Open Interest

Displays open interest data as a line chart in a dedicated sub-pane or as an overlay on the main chart.

**Plan:** Professional+. **Data:** External feed required.

### Enable / Disable

```javascript
chart.enableOi()
chart.disableOi()
chart.isOiEnabled()   // → boolean
```

### Load Data

#### `setOiData(values)`

Load OI values aligned to kline timestamps (same length as kline arrays).

```javascript
const oiValues = new Float64Array([500000, 510000, 505000, ...])
chart.setOiData(oiValues)
```

#### `setOiDataTs(timestamps, values)`

Load OI with explicit timestamps (for non-aligned data).

```javascript
chart.setOiDataTs(oiTimestamps, oiValues)
```

### Configuration

#### `setOiShowOnChart(show)`

When `true`, renders OI as an overlay on the main chart instead of a sub-pane.

```javascript
chart.setOiShowOnChart(false)   // sub-pane (default)
chart.setOiShowOnChart(true)    // overlay on main chart
```

#### `setOiDisplayMode(mode)`

| Value | Mode |
|---|---|
| `0` | Absolute OI value |
| `1` | OI delta (change) |

```javascript
chart.setOiDisplayMode(0)   // absolute
chart.setOiDisplayMode(1)   // delta
```

#### `setOiRatio(ratio)` / `getOiRatio()`

Height ratio of the OI sub-pane (default: 0.2).

```javascript
chart.setOiRatio(0.15)
```

---

## Funding Rate

Displays perpetual futures funding rate as a histogram in a sub-pane.

**Plan:** Professional+. **Data:** External feed required.

### Enable / Disable

```javascript
chart.enableFundingRate()
chart.disableFundingRate()
chart.isFundingRateEnabled()   // → boolean
```

### Load Data

#### `setFrBinanceData(timestamps, values)`

Load funding rate data from Binance (8-hour interval).

```javascript
const frTimestamps = new Float64Array([...])   // Unix seconds
const frValues     = new Float64Array([...])   // e.g. 0.0001, -0.0003, ...
chart.setFrBinanceData(frTimestamps, frValues)
```

#### `setFrAggData(timestamps, values)`

Load aggregated funding rate data from multiple exchanges.

```javascript
chart.setFrAggData(aggTimestamps, aggValues)
```

### Configuration

#### `setFrShowAgg(show)`

Toggle display of aggregated funding rate line.

```javascript
chart.setFrShowAgg(true)
```

#### `setFrShowSma(show)`

Toggle SMA smoothing line on the funding rate chart.

```javascript
chart.setFrShowSma(true)
```

---

## CVD (Cumulative Volume Delta)

Shows cumulative buying vs. selling pressure as a line in a sub-pane. Supports divergence detection with price.

**Plan:** Professional+. **Data:** External feed required (taker buy volume + total volume).

### Enable / Disable

```javascript
chart.enableCvd()
chart.disableCvd()
chart.isCvdEnabled()   // → boolean
```

### Load Data

#### `setCvdData(takerBuyVol, totalVol)`

Primary CVD data from futures market. Both arrays must match kline length.

```javascript
const takerBuyVol = new Float64Array([...])
const totalVol    = new Float64Array([...])
chart.setCvdData(takerBuyVol, totalVol)
```

#### `setCvdSpotData(takerBuyVol, totalVol)`

Spot market CVD data (for spot vs. futures comparison).

```javascript
chart.setCvdSpotData(spotTakerBuyVol, spotTotalVol)
```

### Configuration

#### `setCvdSource(mode)` / `getCvdSource()`

| Value | Source |
|---|---|
| `0` | Futures (default) |
| `1` | Spot |

```javascript
chart.setCvdSource(0)
```

#### `setCvdMode(mode)` / `getCvdMode()`

| Value | Mode |
|---|---|
| `0` | Cumulative line |
| `1` | Per-bar delta |

```javascript
chart.setCvdMode(0)   // cumulative
chart.setCvdMode(1)   // per-bar delta
```

#### `setCvdShowDelta(show)` / `getCvdShowDelta()`

Show delta bars alongside the CVD line.

#### `setCvdShowSignals(show)` / `getCvdShowSignals()`

Show divergence signals between CVD and price.

#### `setCvdShowDivergence(show)` / `getCvdShowDivergence()`

Show explicit divergence lines drawn between CVD and price peaks/troughs.

```javascript
chart.setCvdShowDivergence(true)
chart.setCvdShowSignals(true)
```

---

## VPIN

Volume-Synchronized Probability of Informed Trading — measures the probability of informed trading activity based on volume imbalance.

**Plan:** Enterprise. **Data:** External feed required (same as CVD: taker buy volume + total volume).

### Enable / Disable

```javascript
chart.enableVpin()
chart.disableVpin()
chart.isVpinEnabled()   // → boolean
```

### Load Data

#### `setVpinData(takerBuyVol, totalVol)`

```javascript
chart.setVpinData(takerBuyVol, totalVol)
```

### Configuration

#### `setVpinBucketSize(size)` / `getVpinBucketSize()`

Volume bucket size for VPIN calculation (default: 50).

```javascript
chart.setVpinBucketSize(50)
```

#### `setVpinNumBuckets(count)` / `getVpinNumBuckets()`

Number of buckets in the rolling window (default: 50).

```javascript
chart.setVpinNumBuckets(50)
```

#### `setVpinThreshold(threshold)` / `getVpinThreshold()`

Alert threshold — when VPIN exceeds this value, a warning zone is highlighted (default: 0.7).

```javascript
chart.setVpinThreshold(0.7)
```

#### `setVpinShowSma(show)`

Show SMA smoothing on VPIN line.

#### `setVpinShowZones(show)`

Show high-VPIN zones highlighted on the sub-pane.

```javascript
chart.setVpinShowSma(true)
chart.setVpinShowZones(true)
```

---

## Large Trades

Renders whale/institutional trades as size-scaled bubbles on the main chart.

**Plan:** Professional+. **Data:** External feed required.

### Enable / Disable

```javascript
chart.enableLargeTrades()
chart.disableLargeTrades()
chart.isLargeTradesEnabled()   // → boolean
```

### Load Data

#### `setLargeTradesData(flat)`

Load historical large trade data as a flat `Float64Array` where every 4 elements represent one trade:

| Elements | Meaning |
|---|---|
| `flat[i*4 + 0]` | timestamp (Unix seconds) |
| `flat[i*4 + 1]` | price |
| `flat[i*4 + 2]` | volume in USD |
| `flat[i*4 + 3]` | side/type (0 = buy, 1 = sell) |

```javascript
const trades = new Float64Array([
  1710000000, 67500, 250000, 0,   // $250K buy at 67500
  1710000060, 67450, 180000, 1,   // $180K sell at 67450
])
chart.setLargeTradesData(trades)
```

#### `pushLargeTrade(ts, price, volUsd, sideType)`

Add a single large trade in real-time.

```javascript
chart.pushLargeTrade(Date.now() / 1000, 67500, 350000, 0)
```

#### `clearLargeTrades()`

Clear all large trade data.

### Configuration

#### `setLtVolumeFilter(min, max)`

Filter displayed trades by USD volume range.

```javascript
chart.setLtVolumeFilter(100000, 10000000)   // show $100K – $10M trades
```

#### `setLtBubbleScale(scale)`

Scale factor for bubble sizes (default: 1.0).

```javascript
chart.setLtBubbleScale(1.5)   // 50% larger bubbles
```

### Query

#### `getLtDataMinVol()` / `getLtDataMaxVol()`

Get the min/max USD volume in the current dataset.

```javascript
const minVol = chart.getLtDataMinVol()
const maxVol = chart.getLtDataMaxVol()
```

#### `ltHitTest(sx, sy)` → `string`

Returns JSON data about the trade bubble at screen coordinates (for tooltip).

```javascript
const info = chart.ltHitTest(mouseX, mouseY)
```

---

## Liquidation Heatmap

Renders predicted and actual liquidation levels as a heatmap overlay on the main chart.

**Plan:** Professional+. **Data:** External feed required.

### Enable / Disable

```javascript
chart.enableLiqHeatmap()
chart.disableLiqHeatmap()
chart.isLiqHeatmapEnabled()   // → boolean
```

### Configuration

#### `setLiqHeatmapRange(min, max)`

Set the color mapping range for liquidation intensity.

```javascript
chart.setLiqHeatmapRange(0, 50000000)
```

#### `getLiqHeatmapMin()` / `getLiqHeatmapMax()` / `getLiqHeatmapSegMax()`

Query current range values.

#### `setLiqHeatmapProfile(show)` / `isLiqHeatmapProfile()`

Show/hide the liquidation profile sidebar.

```javascript
chart.setLiqHeatmapProfile(true)
```

#### `setLiqHeatmapCellHeight(mult)` / `getLiqHeatmapCellHeight()`

Multiplier for cell height in the heatmap (default: 1.0).

```javascript
chart.setLiqHeatmapCellHeight(1.5)
```

#### `setLiqHeatmapPredictions(show)`

Toggle prediction lines (estimated future liquidation clusters).

```javascript
chart.setLiqHeatmapPredictions(true)
```

#### `setLiqHeatmapFilledPct(pct)` / `getLiqHeatmapFilledPct()`

Percentage threshold for "filled" liquidation zones (default: 0.85).

```javascript
chart.setLiqHeatmapFilledPct(0.85)
```

### Hit Testing

#### `liqHeatmapHitTest(sx, sy)` → `string`

Returns JSON info about the liquidation cell at screen coordinates.

#### `liqZoneHitTest(sx, sy)` → `string`

Returns JSON info about the liquidation zone at screen coordinates.

---

## VRVP (Visible Range Volume Profile)

Displays a volume profile histogram for the visible price range.

**Plan:** Enterprise. **Data:** Automatic (computed from kline data).

### Enable / Disable

```javascript
chart.enableVrvp()
chart.disableVrvp()
chart.isVrvpEnabled()   // → boolean
```

### Configuration

#### `setVrvpPocLine(show)`

Show/hide the Point of Control horizontal line.

```javascript
chart.setVrvpPocLine(true)
```

### Hit Testing

#### `vrvpHitTest(sx, sy)` → `string`

Returns volume profile info at screen coordinates (for tooltip).

---

## TPO (Market Profile)

Time Price Opportunity / Market Profile — shows time distribution at each price level using letter notation.

**Plan:** Enterprise. **Data:** Automatic (computed from kline data).

### Enable / Disable

```javascript
chart.enableTpo()
chart.disableTpo()
chart.isTpoEnabled()   // → boolean
```

### Configuration

#### `setTpoPocLine(show)`

Show Point of Control line.

#### `setTpoVaLines(show)`

Show Value Area High (VAH) and Value Area Low (VAL) lines.

#### `setTpoIb(show)`

Show Initial Balance range.

#### `setTpoSinglePrints(show)`

Highlight single-print (low-activity) price levels.

#### `setTpoPeriod(minutes)` / `getTpoPeriod()`

TPO session period in minutes (default: 1440 = 24 hours).

```javascript
chart.setTpoPeriod(1440)   // daily session
chart.setTpoPeriod(480)    // 8-hour session
```

#### `setTpoNakedPoc(show)`

Show naked (untested) POC levels from previous sessions.

#### `setTpoProfileShape(show)`

Show the profile shape outline.

#### `setTpoIbMinutes(minutes)`

Initial Balance duration in minutes.

```javascript
chart.setTpoIbMinutes(60)   // first 60 minutes
```

#### `setTpoLetterMinutes(minutes)`

Duration per TPO letter.

```javascript
chart.setTpoLetterMinutes(30)   // 30 min per letter
```

#### `setTpoSignals(show)` / `isTpoSignals()`

Show TPO-based trading signals.

```javascript
chart.setTpoSignals(true)
```

---

## Smart Ranges (SMC)

Smart Money Concepts — Order Blocks, Fair Value Gaps, Break of Structure, and more.

**Plan:** Enterprise. **Data:** Automatic (computed from kline data).

### Enable / Disable

```javascript
chart.enableSmartRanges()
chart.disableSmartRanges()
chart.isSmartRangesEnabled()   // → boolean
```

### Order Blocks

```javascript
chart.setSrShowOb(true)          // show order blocks
chart.setSrObLast(5)             // show last 5 order blocks
chart.setSrShowObActivity(true)  // show activity within OB
chart.setSrShowBreakers(true)    // show breaker blocks
chart.setSrMitigation(mode)      // mitigation mode (0, 1, 2)
chart.setSrShowMetrics(true)     // show OB strength metrics
chart.setSrShowObSignals(true)   // show OB-based signals
```

### Higher Timeframe Order Blocks

```javascript
chart.setSrShowHtfOb(true)
chart.setSrHtfMinutes(240)       // 4-hour HTF
```

### Fair Value Gaps (FVG)

```javascript
chart.setSrShowFvg(true)
chart.setSrFvgTheme(0)           // FVG color theme
chart.setSrFvgMitigation(0)      // mitigation display mode
chart.setSrFvgHtf(true)          // show HTF FVGs
chart.setSrFvgExtend(true)       // extend FVG rectangles right
chart.setSrShowFvgSignals(true)  // show FVG-based signals
```

### Predictions & Smart Reversals

```javascript
chart.setSrShowPredict(true)      // show predictive zones
chart.setSrShowSmartRev(true)     // show smart reversal zones
chart.setSrSmartRevHtf(60)        // HTF for smart reversals (minutes)
```

### Display

```javascript
chart.setSrTextSize(11)           // text size for labels
chart.setSrStatsType(0)           // statistics display type
chart.setSrStatsPosition(0)       // stats position on chart
```

### Query

```javascript
const count = chart.getSrSignalsCount()   // number of active signals
```

---

## EMA Structure

Multi-period EMA trend strength visualization with optional Break of Structure detection.

**Plan:** Enterprise. **Data:** Automatic (computed from kline data).

### Enable / Disable

```javascript
chart.enableEmaStructure()
chart.disableEmaStructure()
chart.isEmaStructureEnabled()   // → boolean
```

### Configuration

```javascript
chart.setEsEma1Len(9)      // short EMA period
chart.setEsEma2Len(21)     // long EMA period
chart.setEsWmaLen(50)      // WMA period
chart.setEsShowEma1(true)  // show short EMA line
chart.setEsShowEma2(true)  // show long EMA line
chart.setEsShowWma(true)   // show WMA line
chart.setEsSwingLen(5)     // swing detection length
chart.setEsShowBos(true)   // show Break of Structure markers
```

---

## Stops & Icebergs

Detects stop-loss clusters being triggered and iceberg order activity.

**Plan:** Enterprise. **Data:** External feed required.

### Enable / Disable

```javascript
chart.enableStopIceberg()
chart.disableStopIceberg()
chart.isStopIcebergEnabled()   // → boolean
```

### Configuration

```javascript
chart.setSiShowStops(true)      // show stop run markers
chart.setSiShowIcebergs(true)   // show iceberg markers
chart.setSiShowZones(true)      // show stop/iceberg zones
```

### Load Iceberg Data

#### `setIcebergEvents(timestamps, prices, visibleSizes, hiddenSizes, isBids, refillCounts)`

Load detected iceberg events (typically from `createIcebergDetector`).

```javascript
chart.setIcebergEvents(
  timestamps,     // Float64Array
  prices,         // Float64Array
  visibleSizes,   // Float64Array
  hiddenSizes,    // Float64Array
  isBids,         // Uint8Array (1 = bid, 0 = ask)
  refillCounts,   // Uint32Array
)
```

### Query

```javascript
const stopCount    = chart.getStopRunCount()
const icebergCount = chart.getIcebergCount()
```

See [Advanced Topics — Iceberg Detection](./advanced.md#iceberg-order-detection) for the automatic detection module.

---

## Forex Signals

Channel breakout and support/resistance signals optimized for forex and crypto markets.

**Plan:** Enterprise. **Data:** Automatic (computed from kline data).

### Enable / Disable

```javascript
chart.enableForexSignals()
chart.disableForexSignals()
chart.isForexSignalsEnabled()   // → boolean
```

### Configuration

#### `setForexSignalsSetup(isBtc5m)`

Optimizes signal parameters for BTC 5-minute charts.

```javascript
chart.setForexSignalsSetup(true)    // BTC 5m optimized
chart.setForexSignalsSetup(false)   // general setup
```

#### `setForexSignalsMode(mode)`

Signal calculation mode variant.

#### `setForexSignalsShowStats(show)`

Display signal statistics overlay.

### Query

```javascript
const count = chart.getForexSignalsCount()   // number of active signals
```

---

## Live Signals

Real-time alert overlay showing entry, take-profit, stop-loss, and profit zones.

**Plan:** All plans (display only — signal generation is external).

### Enable / Disable

```javascript
chart.enableLiveSignals()
chart.disableLiveSignals()
chart.isLiveSignalsEnabled()   // → boolean
```

### Load Data

#### `setLiveSignalsData(flat)`

Load signal data as a flat `Float64Array`.

#### `clearLiveSignals()`

Clear all signal data.

### Configuration

```javascript
chart.setLiveSignalsLeverage(10)        // display leverage
chart.setLiveSignalsTrial(false)        // trial mode flag
chart.setLiveSignalsShowEntry(true)     // show entry lines
chart.setLiveSignalsShowTpSl(true)      // show TP/SL lines
chart.setLiveSignalsShowMaxProfit(true) // show max profit markers
chart.setLiveSignalsShowLabels(true)    // show text labels
chart.setLiveSignalsShowZones(true)     // show profit/loss zones
chart.setLiveSignalsTextSize(11)        // label font size
chart.setLiveSignalsPipValue(0.01)      // pip value for P&L calculation
chart.setLiveSignalsLoading(false)      // loading state
```

### Query

```javascript
const leverage = chart.getLiveSignalsLeverage()   // → 10
const count    = chart.getLiveSignalsCount()       // → number of signals
```

---

## Next Steps

| Topic | Link |
|---|---|
| Build your own indicator | [Custom Indicators](./custom-indicators.md) |
| Add drawing tools | [Drawing Tools](./drawings.md) |
| Handle tooltip data | [Events & Tooltips](./tooltip.md) |
