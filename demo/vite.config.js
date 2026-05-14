import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// IMPORTANT — Do NOT remove `optimizeDeps.exclude` below.
//
// `kline-orderbook-chart` ships a wasm-bindgen bundle: an entry .mjs that
// dynamically imports a sibling `chart_engine.js`, which in turn loads
// `chart_engine_bg.wasm` via `new URL('chart_engine_bg.wasm', import.meta.url)`.
//
// If Vite is allowed to pre-bundle the package, esbuild moves the JS to
// `node_modules/.vite/deps/chart_engine-<hash>.js` but does NOT copy the
// `.wasm` asset alongside it. `import.meta.url` then resolves the wasm to
// `/.vite/deps/chart_engine_bg.wasm` — a path that doesn't exist, so Vite's
// SPA fallback returns `index.html` and the browser fails to instantiate
// the module with:
//
//   CompileError: WebAssembly.instantiate(): expected magic word
//                 00 61 73 6d, found 3c 21 44 4f @+0
//
// (3c 21 44 4f is `<!DO` from `<!DOCTYPE html>`.)
//
// Excluding the package keeps it un-bundled in dev so it's served from
// `node_modules/kline-orderbook-chart/dist/` with the wasm file beside its
// loader and the correct `application/wasm` MIME type.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5180,
  },
  optimizeDeps: {
    exclude: ['kline-orderbook-chart'],
  },
})
