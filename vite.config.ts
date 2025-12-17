// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import svgr from 'vite-plugin-svgr'
//
// export default defineConfig({
//   plugins: [react(),
//     svgr(
//       {
//         svgrOptions: {
//           namedExport: 'ReactComponent'
//         }
//       }
//     )],
//   define: {
//     'process.env': {},
//     'process.browser': true,
//     'Buffer': 'Buffer'
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       define: {
//         global: 'globalThis',
//       },
//     },
//     include: ['buffer','bs58check'],
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        namedExport: 'ReactComponent'
      }
    })
  ],
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'bs58check'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});