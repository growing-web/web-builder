import type {
  WebBuilderOptions,
  WebBuilder,
  WebBuilderHook,
  LoadWebBuilderOptions,
} from '@growing-web/web-builder-types'
import { webBuilderCtx } from '@growing-web/web-builder-toolkit'
import { WEB_BUILD_HOOK } from '@growing-web/web-builder-constants'
import { createHooks } from 'hookable'
import { version as _version } from '../package.json'
import { loadManifestForWebBuilder } from './loader/manifest'

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
  }

  return webBuilder
}

async function initWebBuilder(webBuilder: WebBuilder) {
  //   webBuilder.hooks.addHooks(webBuilder.options.hooks)

  // Set webBuilder instance for useWebBuilder
  webBuilderCtx.set(webBuilder)
  // Delete WebBuilder instance
  webBuilder.hook(WEB_BUILD_HOOK.close, () => webBuilderCtx.unset())

  // webBuilder is ready
  await webBuilder.callHook(WEB_BUILD_HOOK.ready, webBuilder)
}

export async function loadWebBuilder(
  loadWebBuilderOptions: LoadWebBuilderOptions,
) {
  const { ready, mode } = loadWebBuilderOptions

  const MODE = mode || process.env.NODE_ENV

  // TODO
  const webBuilder = createWebBuilder({})

  // set webBuilder.options.manifest = manifest
  await loadManifestForWebBuilder(webBuilder, MODE)

  if (ready !== false) {
    await webBuilder.ready()
  }

  return webBuilder
}
