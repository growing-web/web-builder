import type { WebBuilderPreset } from '@growing-web/web-builder-types'
import { createVue2VitePreset, createVue3VitePreset } from './vite'

const presets: WebBuilderPreset[] = [
  {
    // vite vue  config
    vite: (version: number) => {
      if (version === 2) {
        return createVue2VitePreset()
      }
      return createVue3VitePreset()
    },
  },
]

export default presets
