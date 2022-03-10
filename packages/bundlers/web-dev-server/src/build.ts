import type { WebBuilder } from '@growing-web/web-builder-types'
import { buildBundler as viteBuild } from '@growing-web/web-builder-bundler-vite'
import { bundlerWebSite } from './webSite'

export function buildBundler(webBuilder: WebBuilder) {
  return async () => {
    await bundlerWebSite(webBuilder)
    return await viteBuild(webBuilder)()
  }
}
