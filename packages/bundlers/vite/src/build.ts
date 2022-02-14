import type { WebBuilder } from '@growing-web/web-builder-types'
import { createConfig } from './create-config'
import { build } from 'vite'

export function buildBundler(webBuilder: WebBuilder) {
  return async () => {
    const config = await createConfig(webBuilder)
    await build(config)
  }
}
