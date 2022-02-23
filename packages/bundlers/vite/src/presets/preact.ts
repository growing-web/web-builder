import type { InlineConfig } from 'vite'
import preact from '@preact/preset-vite'

export function createPReactPreset(): InlineConfig {
  const overrides = {
    plugins: [preact()],
    optimizeDeps: { include: ['preact', 'preact/debug'] },
  }
  return overrides
}
