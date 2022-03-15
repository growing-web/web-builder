import type { InlineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'

export function createReactPreset(): InlineConfig {
  const overrides = {
    plugins: [react(), reactRefresh()],
    optimizeDeps: { include: ['react', 'react-dom'] },
  }
  return overrides
}
