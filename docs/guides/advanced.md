# Advanced Topics

This page covers iceberg order detection, licensing, performance optimization, memory management, and multi-chart synchronization.

---

## Iceberg Order Detection

The library includes a pure-JavaScript iceberg order detector that monitors L2 orderbook snapshots over time to detect "refill" patterns — when a price level's volume is consumed and immediately replenished, indicating a hidden iceberg order.

### Import

```javascript
import { createIcebergDetector } from 'kline-orderbook-chart'
```

### `createIcebergDetector(options?)` → Detector

| Option | Type | Default | Description |
|---|---|---|---|
| `minRefills` | `number` | `3` | Minimum refill events before flagging as iceberg |
| `hiddenRatio` | `number` | `2.0` | Hidden volume must be ≥ this × visible volume |
| `refillWindowMs` | `number` | `10000` | Time window for counting refills (ms) |
| `maxTrackedLevels` | `number` | `200` | Max price levels tracked simultaneously |
| `maxEvents` | `number` | `500` | Max stored iceberg events |
| `decayMs` | `number` | `300000` | Events older than this are discarded (5 min) |

```javascript
const detector = createIcebergDetector({
  minRefills: 3,
  hiddenRatio: 2.0,
  refillWindowMs: 10000,
})
```

### `detector.onOrderbookUpdate(bids, asks, timestamp?)`

Feed orderbook snapshots on every L2 update.

| Parameter | Type | Description |
|---|---|---|
| `bids` | `[price, volume][]` or `Map` | Current bid levels |
| `asks` | `[price, volume][]` or `Map` | Current ask levels |
| `timestamp` | `number` | Optional Unix ms (defaults to `Date.now()`) |

```javascript
const obWs = new WebSocket('wss://stream.binance.com/ws/btcusdt@depth20@100ms')

obWs.onmessage = (event) => {
  const data = JSON.parse(event.data)
  detector.onOrderbookUpdate(
    data.bids.map(([p, q]) => [+p, +q]),
    data.asks.map(([p, q]) => [+p, +q]),
    Date.now(),
  )
}
```

### `detector.getEvents()` → `Array`

Returns all currently detected iceberg events.

```javascript
const events = detector.getEvents()
// → [{ timestamp, price, visibleSize, hiddenSize, isBid, refillCount }, ...]
```

### `detector.pushToEngine(chart)`

Pushes all detected events into the chart engine for rendering (used with the Stops & Icebergs indicator).

```javascript
// Push to engine periodically
setInterval(() => {
  detector.pushToEngine(chart)
}, 5000)
```

### `detector.reset()`

Clears all tracked levels and detected events.

### Complete Example

```javascript
import { createChartBridge, createIcebergDetector } from 'kline-orderbook-chart'

const chart = await createChartBridge(canvas, { licenseKey: '...' })
// ... load klines, start chart ...

chart.enableStopIceberg()
chart.setSiShowIcebergs(true)
chart.setSiShowZones(true)

const detector = createIcebergDetector()

const obWs = new WebSocket('wss://stream.binance.com/ws/btcusdt@depth20@100ms')
obWs.onmessage = (e) => {
  const data = JSON.parse(e.data)
  detector.onOrderbookUpdate(
    data.bids.map(([p, q]) => [+p, +q]),
    data.asks.map(([p, q]) => [+p, +q]),
  )
}

// Sync detections to engine every 3 seconds
setInterval(() => detector.pushToEngine(chart), 3000)
```

---

## Licensing

### Token format

License tokens are JWS-compact-encoded strings signed with **Ed25519**:

```
header_b64url . payload_b64url . sig_b64url
```

Signing happens server-side with a private key (`MRD_LICENSE_PRIVATE_KEY`
on your BE). The FE bundle only contains the matching public key, so it
can verify but cannot forge. See `docs/chart-license-be-spec.md` for the
endpoint contract and a Node.js reference implementation.

### Validation (async)

```javascript
import { validateLicense } from 'kline-orderbook-chart'

const info = await validateLicense(token)
console.log(info)
// → {
//   valid: true,
//   plan: 'professional',     // 'standard' | 'professional' | 'enterprise' | 'trial' | 'free'
//   expiry: 1777731163,       // epoch sec, 0 = perpetual
//   watermark: false,
//   features: { ... },
//   subject: 'user-123',
// }
```

### Runtime license update (async)

You can replace the license token at runtime without recreating the chart:

```javascript
const valid = await chart.setLicenseKey(newTokenFromBE)
if (valid) {
  console.log('License updated successfully')
}
```

### License Info Property

```javascript
const license = chart.license
// → {
//   plan: 'professional',
//   valid: true,
//   expired: false,
//   watermark: false,
//   daysLeft: 365,
//   features: { ... },
// }
```

### Feature Gating

Methods that require a higher plan are automatically gated. Calling a gated method logs a console warning and returns silently:

```javascript
// On Standard plan:
chart.enableCvd()
// Console: "[MRD Chart Engine] Feature 'cvd' requires Professional plan"
// No error thrown — method is a no-op
```

### License Token Issuance (Admin / BE)

Tokens are issued by your backend, never by the FE. The FE bundle only
contains the public key for verification.

To issue a token from a one-off CLI (e.g. for QA / a customer who pays
out-of-band), use the helper script in this repo (it reads the Ed25519
private key from the `MRD_LICENSE_PRIVATE_KEY` env var):

```bash
MRD_LICENSE_PRIVATE_KEY=$PRIV \
  node scripts/license/issue-token.mjs \
    --plan professional \
    --domain "myapp.com" \
    --days 365 \
    --sub "admin@acme.com"
```

For your production BE, see `docs/chart-license-be-spec.md` for the
endpoint contract and a drop-in Node.js (Express) reference.

---

## Performance Optimization

### Engine Prefetch

Always call `prefetchWasm()` as early as possible — ideally at application startup, not when the chart page loads.

```javascript
// In your app's entry point (main.js / App.jsx / etc.)
import { prefetchWasm } from 'kline-orderbook-chart'
prefetchWasm()
```

This starts downloading and compiling the native engine module in the background. When the user navigates to the chart page, `createChartBridge` reuses the already-loaded module.

### RAF Batching

Multiple data updates within the same frame are automatically batched:

```javascript
// These three calls only trigger ONE render
chart.updateLastKline(ts, o, h, l, c, v)
chart.setCvdData(buyVol, totalVol)
chart.setOiData(oiValues)
// → single render on next RAF
```

### Pause When Hidden

Always pause the chart when the browser tab is hidden:

```javascript
document.addEventListener('visibilitychange', () => {
  document.hidden ? chart.pause() : chart.resume()
})
```

This saves CPU and battery, especially on mobile.

### Footprint Trade Batching

For footprint charts, batch aggTrade events and flush once per animation frame:

```javascript
let tradeBuf = new Float64Array(4096)
let bufLen = 0
let flushRaf = null

ws.onmessage = (e) => {
  // ... append to tradeBuf ...

  if (!flushRaf) {
    flushRaf = requestAnimationFrame(() => {
      flushRaf = null
      chart.footprintAddTradeBatch(tradeBuf.subarray(0, bufLen))
      bufLen = 0
    })
  }
}
```

### Use Float64Array Directly

When possible, pass `Float64Array` objects directly to avoid internal conversion:

```javascript
// Fast — no conversion needed
chart.setKlines(float64Timestamps, float64Open, float64High, float64Low, float64Close, float64Volume)

// Slower — each array is converted to Float64Array internally
chart.setKlines(numberArray, numberArray, ...)
```

---

## Memory Management

### Memory Budget

| Data | Formula | Example (10K candles, 200-row heatmap) |
|---|---|---|
| OHLCV storage | 6 arrays × N × 8 bytes | 6 × 10,000 × 8 = 480 KB |
| Heatmap matrix | rows × cols × 8 bytes | 200 × 1,000 × 8 = 1.6 MB |
| Command buffer | ~200 KB (reused per frame) | 200 KB |
| Indicator state | ~10 KB per indicator | ~140 KB |
| Drawing state | ~500 bytes per drawing | ~50 KB |
| **Total** | | **~20 MB** |

### Avoiding Memory Leaks

1. **Always call `chart.destroy()`** when unmounting the component. Engine memory is not garbage-collected.

2. **Don't hold references** to the chart object after destroy:

```javascript
let chart = await createChartBridge(canvas, opts)

// On unmount
chart.destroy()
chart = null   // release JS reference
```

3. **Limit candle count** — beyond 20,000 candles, consider using `prependKlines` on demand instead of loading everything upfront.

### Engine Crash Recovery

If the native engine crashes (e.g. out-of-memory), the bridge detects it and stops the render loop:

```javascript
// The engine logs: "[MRD] Engine crashed: <error>"
// All subsequent method calls become no-ops
// You must call chart.destroy() and create a new chart
```

---

## Performance Specifications

| Metric | Value |
|---|---|
| Bundle size | ~380 KB gzip |
| Zero JS dependencies | No lodash, no moment, no framework |
| Memory at 10K candles + 500-row heatmap | ~20 MB |
| Render throughput | 60 fps desktop, 30 fps mobile (auto-throttled) |
| `appendKline` complexity | O(1) amortised |
| `updateLastKline` complexity | O(1) |
| Heatmap rects per frame cap | 250,000 (auto LOD) |
| Engine module load | Once — cached across all chart instances |
| Time to first render | < 100ms after engine load |

---

## Multi-Chart Synchronization

### Crosshair Sync

Sync the crosshair price between two charts showing the same or related assets:

```javascript
chartA.onTooltip((json) => {
  if (!json) {
    chartB.clearHoverPrice()
    return
  }
  const { c } = JSON.parse(json)
  chartB.setHoverPrice(c)
})

chartB.onTooltip((json) => {
  if (!json) {
    chartA.clearHoverPrice()
    return
  }
  const { c } = JSON.parse(json)
  chartA.setHoverPrice(c)
})
```

### Shared Engine Module

Multiple charts on the same page share the engine module. The module is loaded once and cached globally:

```javascript
// Both charts use the same compiled engine
const chart1 = await createChartBridge(canvas1, opts)
const chart2 = await createChartBridge(canvas2, opts)
// No additional engine load for chart2
```

Each chart has its own `ChartEngine` instance with independent data and state.

---

## Low-Level Access

### `chart.engine`

Direct access to the raw native `ChartEngine` instance. Use this for methods not exposed by the bridge.

```javascript
const engine = chart.engine

// Direct engine calls
const count = engine.kline_count()
const dirty = engine.is_dirty()
```

> **Warning:** Calling engine methods directly bypasses dirty-flag management and feature gating. Use bridge methods when available.

### `dispatchCommands(ctx, engineMemory, ptr, len)`

Low-level function to render a native command buffer to a Canvas 2D context. Normally handled internally by the render loop.

```javascript
import { dispatchCommands } from 'kline-orderbook-chart'

// Manual render (advanced use case)
const cmdCount = engine.render()
if (cmdCount > 0) {
  const ptr = engine.get_command_buffer_ptr()
  const len = engine.get_command_buffer_len()
  dispatchCommands(ctx, engineMemory, ptr, len)
}
```

---

## Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome / Edge | 80+ |
| Firefox | 79+ |
| Safari | 15.2+ |
| Mobile Chrome | 80+ |
| Mobile Safari | 15.2+ |

Requires ES2020+ (no Internet Explorer support). A modern browser with full ES2020 support is required.

---

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| Chart is blank after `start()` | No data loaded | Call `setKlines()` before `start()` |
| Canvas is 0×0 | Parent container has no size | Ensure parent has explicit width/height |
| "Engine crashed" console error | Out of memory or invalid data | Call `destroy()` and recreate; check for NaN/Infinity in data |
| Feature doesn't work | Plan restriction | Check `chart.license.plan`; upgrade plan |
| High CPU when idle | Missing `pause()` on hidden tab | Add `visibilitychange` listener |
| Blurry text on Retina | DPR not applied | `resize()` handles DPR automatically; ensure it's called |
| Drawings lost on reload | Not persisted | Use `exportDrawingsJson()` / `importDrawingsJson()` |

---

## Next Steps

| Topic | Link |
|---|---|
| Framework integration | [Framework Integration](../examples/framework-integration.md) |
| Getting started | [Getting Started](./getting-started.md) |
| Table of contents | [Documentation Home](./README.md) |
