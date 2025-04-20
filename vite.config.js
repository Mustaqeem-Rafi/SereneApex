import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    // Fix for "browser is not defined" error
    'process.env': {},
    global: {},
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
