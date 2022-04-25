import type { PluginOptions } from '@growing-web/web-builder-types'
import type { UnpluginInstance } from 'unplugin'
import { createUnplugin } from 'unplugin'

export function createPlugins<UserOptions = any>(
  fn: (options: any) => PluginOptions,
): UnpluginInstance<UserOptions> {
  return createUnplugin<UserOptions>(fn)
}
