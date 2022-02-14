import type { WebBuilder } from '@growing-web/web-builder-types'
import { WEB_BUILDER_HOOK } from '@growing-web/web-builder-constants'

type BundlerResult =
  | typeof import('@growing-web/web-builder-bundler-vite')
  | typeof import('@growing-web/web-builder-bundler-webpack')

export async function loadBundler(webBuilder: WebBuilder) {
  const useVite = webBuilder.options.bundlerType === 'vite'

  const { buildBundler, devBundler }: BundlerResult = await (useVite
    ? import('@growing-web/web-builder-bundler-vite')
    : import('@growing-web/web-builder-bundler-webpack'))
  try {
    return {
      build: buildBundler(webBuilder),
      dev: devBundler(webBuilder),
    }
  } catch (error) {
    await webBuilder.callHook(WEB_BUILDER_HOOK.BUILD_ERROR, error)
    throw error
  }
}
