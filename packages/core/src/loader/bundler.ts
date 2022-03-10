import type {
  WebBuilder,
  WebBuilderStats,
} from '@growing-web/web-builder-types'
import type { ViteDevServer } from 'vite'
import { WEB_BUILDER_HOOK } from '@growing-web/web-builder-constants'

type BundlerResult =
  | typeof import('@growing-web/web-builder-bundler-vite')
  | typeof import('@growing-web/web-builder-bundler-webpack')
  | typeof import('@growing-web/web-builder-bundler-dev-server')

export async function loadBundler(webBuilder: WebBuilder): Promise<{
  build: (() => Promise<WebBuilderStats>) | (() => Promise<void>)
  dev: (() => Promise<ViteDevServer>) | (() => Promise<void>)
}> {
  const bundlerType = webBuilder.service?.bundlerType ?? 'vite'

  const bundleMap = {
    vite: import('@growing-web/web-builder-bundler-vite'),
    webpack: import('@growing-web/web-builder-bundler-webpack'),
    webDevServer: import('@growing-web/web-builder-bundler-dev-server'),
  }

  const bundler: BundlerResult = await bundleMap[bundlerType]
  try {
    return {
      build: bundler.buildBundler(webBuilder),
      dev: bundler.devBundler(webBuilder),
    }
  } catch (error) {
    await webBuilder.callHook(WEB_BUILDER_HOOK.BUILD_ERROR, error)
    throw error
  }
}
