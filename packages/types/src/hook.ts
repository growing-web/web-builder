import type { WebBuilder } from './web-builder'
import { WEB_BUILDER_HOOK } from '@growing-web/web-builder-constants'

type HookResult = Promise<void> | void

export interface WebBuilderHook {
  // build
  [WEB_BUILDER_HOOK.BUILD_ERROR]: (error: any | unknown) => HookResult

  // @web-builder/core
  [WEB_BUILDER_HOOK.CLOSE]: (webBuilder: WebBuilder) => HookResult
  [WEB_BUILDER_HOOK.READY]: (webBuilder: WebBuilder) => HookResult
}
