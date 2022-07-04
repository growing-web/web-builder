import type { InlineConfig } from 'vite'

export async function _createReactPreset(): Promise<InlineConfig> {
  const react = await import('@vitejs/plugin-react')
  const overrides = {
    plugins: [(react?.default ?? react)()],
    optimizeDeps: { include: ['react', 'react-dom'] },
  }
  return overrides
}

export function createReactPreset(): Promise<InlineConfig> {
  return _createReactPreset()
}
