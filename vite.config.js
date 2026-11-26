import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite publicar en GitHub Pages (usuario.github.io/ASTRAMEDIC) o en dominio propio
export default defineConfig({
  plugins: [react()],
  base: './',
})
