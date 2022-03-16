import type { WebBuilder } from '@growing-web/web-builder-types'
import { buildBundler as viteBuild } from '@growing-web/web-builder-bundler-vite'

export function buildBundler(webBuilder: WebBuilder) {
  return async () => {
    return await viteBuild(webBuilder)()
  }
}
