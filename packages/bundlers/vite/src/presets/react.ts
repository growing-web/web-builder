import type { InlineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export function createReactPreset(): InlineConfig {
  const overrides = {
    plugins: [react()],
    optimizeDeps: { include: ['react', 'react-dom'] },
  }
  return overrides
}
