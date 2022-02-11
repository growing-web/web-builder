import type { InlineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mergeConfig } from 'vite'

export function createVitePreset(): InlineConfig {
  const overrides = {
    plugins: [react()],
    optimizeDeps: { include: ['react', 'react-dom'] },
  }
  return mergeConfig({}, overrides)
}
