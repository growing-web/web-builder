import type {
  WebBuilderOptions,
  WebBuilder,
  WebBuilderHook,
  LoadWebBuilderOptions,
} from '@growing-web/web-builder-types'
import type { BasicService } from './service'
import { webBuilderCtx } from '@growing-web/web-builder-toolkit'
import { WEB_BUILDER_HOOK } from '@growing-web/web-builder-constants'
import { createHooks } from 'hookable'
import { version as _version } from '../package.json'

/**
 * Create a global webBuilder instance
 * @param options
 * @returns
 */
export function createWebBuilder(
  service: BasicService | undefined,
  options: WebBuilderOptions = {},
): WebBuilder {
  const hooks = createHooks<WebBuilderHook>()
  const { callHook, addHooks, hook } = hooks
  const webBuilder: WebBuilder = {
    _version,
    options,
    hooks,
    callHook,
    addHooks,
    hook,
    service: service!,
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
  webBuilder.hook(WEB_BUILDER_HOOK.CLOSE, () => webBuilderCtx.unset())

  // webBuilder is ready
  await webBuilder.callHook(WEB_BUILDER_HOOK.READY, webBuilder)
}

export async function loadWebBuilder(
  loadWebBuilderOptions: LoadWebBuilderOptions,
) {
  const { ready, service } = loadWebBuilderOptions

  const webBuilder = createWebBuilder(service)

  if (ready !== false) {
    await webBuilder.ready()
  }

  return webBuilder
}
