/**
 * kline-orderbook-chart — Public API
 *
 * Framework-agnostic chart engine powered by WebAssembly.
 * This is the single entry point consumers should import from.
 */

export { createChartBridge, prefetchWasm } from './bridge'
export { dispatchCommands } from './canvasRenderer'
export { setupEvents } from './eventHandler'
export { createCustomIndicatorManager } from './customIndicators'
export { validateLicense } from './license'
export { buildRenko, buildRange, buildTick, suggestDefaults } from './chartAggregation'
export { createIcebergDetector } from './icebergDetector'
export { createOrderbookBridge } from './orderbookBridge'
export { createTickBridge } from './tickBridge'
