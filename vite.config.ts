import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { markdown } from './vite-plugins/markdown'

export default defineConfig({
  plugins: [react({ babel: { babelrc: false, configFile: false } }), svgr(), markdown()],
  build: {
    outDir: 'build',
    target: 'es2018'
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  }
})
