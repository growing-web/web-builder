import type { InlineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import vue from '@vitejs/plugin-vue'

function createVue2VitePreset(): InlineConfig {
  const overrides = {
    plugins: [createVuePlugin({ jsx: true })],
    optimizeDeps: { include: ['vue'] },
  }
  return overrides
}

function createVue3VitePreset(): InlineConfig {
  const overrides = {
    plugins: [vue({ customElement: true })],
    optimizeDeps: { include: ['vue'] },
  }
  return overrides
}

export function createVuePreset(version = 3) {
  if (version === 2) {
    return createVue2VitePreset()
  }
  return createVue3VitePreset()
}
