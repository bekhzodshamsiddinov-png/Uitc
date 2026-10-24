import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    // Keep every asset as a file so the strict CSP (font-src/img-src 'self') never needs data: URIs.
    assetsInlineLimit: 0,
    target: 'es2022',
  },
})
