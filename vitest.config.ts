/// <reference types="vitest" />
import type { AliasOptions } from 'vite'

import { defineConfig } from 'vite'
import { resolve } from 'path'

const _resolve = (p: string) => resolve(__dirname, p)

const alias: AliasOptions = {
  '@growing-web/web-builder-config': _resolve('./packages/config/src/'),
  '@growing-web/web-builder-kit': _resolve('./packages/shared/kit/src'),
  '@growing-web/web-builder-constants': _resolve(
    './packages/shared/constants/src',
  ),
}

export default defineConfig({
  resolve: {
    alias,
  },
})
