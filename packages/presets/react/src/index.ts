import type { WebBuilderPreset } from '@growing-web/web-builder-types'
import { createVitePreset } from './vite'

const presets: WebBuilderPreset[] = [
  // vite react config
  {
    vite: () => {
      return createVitePreset()
    },
  },
]

export default presets
