/// <reference types="vitest" />
import type { AliasOptions } from 'vite'

import { defineConfig } from 'vite'
import { resolve } from 'path'

const _resolve = (p: string) => resolve(__dirname, p)

const alias: AliasOptions = {
  '@growing-web/web-builder-schema': _resolve('./packages/schema/src/'),
  '@growing-web/web-builder-toolkit': _resolve('./packages/shared/toolkit/src'),
}

export default defineConfig({
  resolve: {
    alias,
  },
})
