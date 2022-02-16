import type {
  WebBuilderOptions,
  WebBuilder,
  WebBuilderHook,
  LoadWebBuilderOptions,
  UserConfig,
} from '@growing-web/web-builder-types'
import { webBuilderCtx } from '@growing-web/web-builder-toolkit'
import { WEB_BUILDER_HOOK } from '@growing-web/web-builder-constants'
import { createHooks } from 'hookable'
import { version as _version } from '../package.json'
import { loadManifestForWebBuilder } from './loader/manifest'
import { loadConfigForWebBuilder } from './loader/config'
import { mergeManifest, mergeUserConfig } from './config'

/**
 * Create a global webBuilder instance
 * @param options
 * @returns
 */
export function createWebBuilder(options: WebBuilderOptions): WebBuilder {
  const hooks = createHooks<WebBuilderHook>()
  const { callHook, addHooks, hook } = hooks
  const webBuilder: WebBuilder = {
    _version,
    options,
    hooks,
    callHook,
    addHooks,
    hook,
    ready: () => initWebBuilder(webBuilder),
    close: () => Promise.resolve(),
    stats: null,
  }

  return webBuilder
}

async function initWebBuilder(webBuilder: WebBuilder) {
  //   webBuilder.hooks.addHooks(webBuilder.options.hooks)

  // Set webBuilder instance for useWebBuilder
  webBuilderCtx.set(webBuilder)
  // Delete WebBuilder instance
  webBuilder.hook(WEB_BUILDER_HOOK.CLOSE, () => webBuilderCtx.unset())

  // webBuilder is ready
  await webBuilder.callHook(WEB_BUILDER_HOOK.READY, webBuilder)
}

export async function loadWebBuilder(
  loadWebBuilderOptions: LoadWebBuilderOptions,
  processConfig: UserConfig,
) {
  const { ready, mode, rootDir } = loadWebBuilderOptions

  const MODE = mode || process.env.NODE_ENV

  const bundlerType = 'vite'

  // TODO
  const webBuilder = createWebBuilder({
    rootDir,
    bundlerType,
    mode: MODE,
  })

  // set webBuilder.options.manifest = manifest
  const manifest = await loadManifestForWebBuilder(MODE)
  mergeManifest(webBuilder, manifest)

  // User-defined configuration
  const { data: userConfig = {} } = await loadConfigForWebBuilder(
    webBuilder,
    bundlerType,
    MODE,
  )
  mergeUserConfig(webBuilder, userConfig, processConfig)

  if (ready !== false) {
    await webBuilder.ready()
  }

  return webBuilder
}
