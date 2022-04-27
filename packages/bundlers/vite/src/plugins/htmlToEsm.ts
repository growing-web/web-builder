import type { PluginOption } from 'vite'
import { dataToEsm, createFilter } from '@rollup/pluginutils'
export function createHtmlToEsmPlugin(): PluginOption {
  const filter = createFilter(['**/*.html'])
  return {
    name: 'vite-html-to-esm',
    transform(code, id) {
      if (!filter(id)) {
        return null
      }

      if (id[0] !== '.') {
        return null
      }

      return dataToEsm(code)
    },
  }
}
