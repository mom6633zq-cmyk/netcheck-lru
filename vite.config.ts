import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Dev proxy: forwards /api and /uploads to the PHP + MySQL backend.
// XAMPP: project folder is htdocs/netcheck-lru  ->  http://localhost/netcheck-lru
const PHP_BACKEND = process.env.PHP_BACKEND || 'http://localhost/netcheck-lru'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
    proxy: {
      '/api': { target: PHP_BACKEND, changeOrigin: true },
      '/uploads': { target: PHP_BACKEND, changeOrigin: true },
    },
  },
})
