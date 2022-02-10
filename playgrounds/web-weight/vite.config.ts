import path from 'path'
import { defineConfig } from 'vite'
import { createRequire } from 'module'

import { createVuePlugin } from '@web-widget/vite-plugin-vue2'

const require = createRequire(import.meta.url)
const cwd = process.cwd()
const { source, main, module, system } = require(`${cwd}/package.json`)

const outDir = 'dist/'
const formatMap = {
  cjs: main,
  esm: module,
  system,
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir,
    lib: {
      entry: path.resolve(cwd, source),
      formats: Object.keys(formatMap),
      fileName: (format) => {
        const normalize = formatMap[format].replace(/\.\//, '')
        return normalize.startsWith(outDir)
          ? normalize.replace(outDir, '')
          : normalize
      },
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
  plugins: [
    createVuePlugin({
      customElement: true,
    }),
  ],
})
