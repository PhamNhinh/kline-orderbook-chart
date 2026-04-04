import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@mrd/chart-engine': resolve(__dirname, '../packages/js-bridge/src/index.js'),
    },
  },
  server: {
    port: 5180,
    fs: {
      allow: [
        resolve(__dirname, '..'),
      ],
    },
  },
  optimizeDeps: {
    exclude: ['@mrd/chart-engine'],
  },
})
