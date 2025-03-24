import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Changé de '/' à './' pour utiliser des chemins relatifs
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript',
    },
    host: true,
    port: 3000
  },
  preview: {
    port: 3000
  },
  build: {
    modulePreload: {
      polyfill: true
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
});