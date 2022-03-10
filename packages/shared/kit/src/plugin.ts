import type { PluginOptions } from '@growing-web/web-builder-types'
import { createUnplugin } from 'unplugin'

export function createPlugins<UserOptions = any>(
  fn: (options: any) => PluginOptions,
) {
  return createUnplugin<UserOptions>(fn)
}
