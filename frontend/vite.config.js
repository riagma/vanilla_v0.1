import { defineConfig } from 'vite';
// import { nodePolyfills } from 'vite-plugin-node-polyfills';


// export default defineConfig({
//   plugins: [
//     nodePolyfills({
//       include: ['buffer', 'process'],
//       globals: {
//         Buffer: true,
//         process: true
//       }
//     }),
//   ],
//   optimizeDeps: {
//     exclude: [
//       '@noir-lang/noirc_abi',
//       '@noir-lang/acvm_js',
//       'main.worker.js'
//     ]
//   },
//   server: {
//     proxy: {
//       '/api': 'http://localhost:3000'
//     }
//   },
//   rollupOptions: {
//     input: 'index.html',
//     output: {
//       dir: 'dist',
//       format: 'esm'
//     }
//   }
// });

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: '../backend/public', // para que el backend sirva los estáticos directamente
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: { target: "esnext" },
    exclude: ['@noir-lang/noirc_abi', '@noir-lang/acvm_js']
  },
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
});

// export default {
//   optimizeDeps: {
//     esbuildOptions: { target: "esnext" },
//     exclude: ['@noir-lang/noirc_abi', '@noir-lang/acvm_js']
//   },  
//   server: {
//     proxy: {
//       '/api': 'http://localhost:3000'
//     }
//   },
//   build: {
//     outDir: '../backend/public' // para que el backend sirva los estáticos directamente
//   }
// }
