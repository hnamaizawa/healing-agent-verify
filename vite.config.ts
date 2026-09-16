import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// UiPath Coded Web App: platform handles URL routing, so assets must use
// relative paths (no absolute `/`-rooted references).
export default defineConfig({
  base: './',
  plugins: [react()],
})
