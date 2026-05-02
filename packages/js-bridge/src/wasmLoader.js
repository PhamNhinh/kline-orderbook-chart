let wasmModule = null
let wasmMemory = null
let loadPromise = null

export async function loadWasm() {
  if (wasmModule) return { module: wasmModule, memory: wasmMemory }
  if (loadPromise) return loadPromise
  loadPromise = (async () => {
    const mod = await import('../wasm/chart_engine.js')
    await mod.default()
    wasmMemory = mod.wasm_memory()
    wasmModule = mod
    return { module: mod, memory: wasmMemory }
  })()
  return loadPromise
}
