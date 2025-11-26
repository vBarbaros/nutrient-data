import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nutrient-data/',
  build: {
    outDir: 'docs'
  },
  publicDir: 'api'
})
