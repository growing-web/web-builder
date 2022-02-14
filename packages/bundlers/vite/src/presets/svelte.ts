import type { InlineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export function createSveltePreset(): InlineConfig {
  const overrides = {
    plugins: [svelte()],
  }
  return overrides
}
