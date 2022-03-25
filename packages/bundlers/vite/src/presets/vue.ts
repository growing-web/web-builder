import type { InlineConfig } from 'vite'

async function createVue2VitePreset(): Promise<InlineConfig> {
  const { createVuePlugin } = await import('vite-plugin-vue2')
  const overrides = {
    plugins: [createVuePlugin({ jsx: true })],
    optimizeDeps: { include: ['vue'] },
  }
  return overrides
}

async function createVue3VitePreset(): Promise<InlineConfig> {
  const vue = await import('@vitejs/plugin-vue')
  const overrides = {
    plugins: [(vue.default || vue)()],
    optimizeDeps: { include: ['vue'] },
  }
  return overrides
}

export async function createVuePreset(version = 3) {
  if (version === 2) {
    return createVue2VitePreset()
  }
  return createVue3VitePreset()
}
