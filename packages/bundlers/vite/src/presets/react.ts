import type { InlineConfig } from 'vite'

export async function createPReactPreset(): Promise<InlineConfig> {
  const preact = await import('@preact/preset-vite')
  const overrides = {
    plugins: [(preact?.default ?? preact)()],
    optimizeDeps: { include: ['preact', 'preact/debug'] },
  }
  return overrides
}

export async function _createReactPreset(): Promise<InlineConfig> {
  const react = await import('@vitejs/plugin-react')
  const overrides = {
    plugins: [(react?.default ?? react)()],
    optimizeDeps: { include: ['react', 'react-dom'] },
  }
  return overrides
}

export function createReactPreset(
  type: 'react' | 'preact',
): Promise<InlineConfig> {
  if (type === 'preact') {
    return createPReactPreset()
  }
  return _createReactPreset()
}
