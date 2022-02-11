import type { InlineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export function createVue2VitePreset(): InlineConfig {
  const overrides = {
    plugins: [createVuePlugin({ jsx: true })],
    optimizeDeps: { include: ['vue'] },
  }
  return mergeConfig({}, overrides)
}

export function createVue3VitePreset(): InlineConfig {
  const overrides = {
    plugins: [vue({ customElement: true })],
    optimizeDeps: { include: ['vue'] },
  }
  return mergeConfig({}, overrides)
}
