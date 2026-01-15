import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        namedExport: 'ReactComponent',
      },
    }),
    nodePolyfills(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
