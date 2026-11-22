import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { markdown } from './vite-plugins/markdown.mts'

export default defineConfig({
  plugins: [react(), svgr(), markdown()],
  build: {
    outDir: 'build',
    target: 'es2018'
  }
})
