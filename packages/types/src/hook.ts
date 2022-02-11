import type { WebBuilder } from './web-builder'
import { WEB_BUILD_HOOK } from '@growing-web/web-builder-constants'

type HookResult = Promise<void> | void

export interface WebBuilderHook {
  // @web-builder/core
  [WEB_BUILD_HOOK.close]: (webBuilder: WebBuilder) => HookResult
  [WEB_BUILD_HOOK.ready]: (webBuilder: WebBuilder) => HookResult
}
