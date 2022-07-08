import type { InlineConfig } from 'vite'
import vue27 from '@vitejs/plugin-vue2'
import vue3 from '@vitejs/plugin-vue'
import { createVuePlugin } from 'vite-plugin-vue2'

async function createVue2VitePreset(): Promise<InlineConfig> {
  const overrides = {
    plugins: [createVuePlugin({ jsx: true })],
    optimizeDeps: { include: ['vue'] },
  }
  return overrides
}

async function createVue27VitePreset(): Promise<InlineConfig> {
  const overrides = {
    plugins: [vue27()],
    optimizeDeps: { include: ['vue'] },
  }
  return overrides
}

async function createVue3VitePreset(): Promise<InlineConfig> {
  const overrides = {
    plugins: [vue3()],
    optimizeDeps: { include: ['vue'] },
  }
  return overrides
}

export async function createVuePreset(version: string | number | undefined) {
  if (!version || version >= 3) {
    return createVue3VitePreset()
  }
  if (version === '2.6') {
    return createVue2VitePreset()
  }
  return createVue27VitePreset()
}
