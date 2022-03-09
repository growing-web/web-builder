import type { Plugin as DevServerPlugin } from '@web/dev-server-core'

import type {
  UnpluginOptions,
  RollupPlugin,
  VitePlugin,
  EsbuildPlugin,
} from 'unplugin'

import type { WebpackPluginInstance } from 'webpack'

export type PluginOptions = Omit<
  UnpluginOptions,
  //   'rollup' | 'webpack' | 'vite' | 'esbuild'

  // TODO Currently only rollup and vite are supported
  'rollup' | 'vite'
>

export type PluginInstance =
  | RollupPlugin
  | VitePlugin
  | EsbuildPlugin
  | WebpackPluginInstance

export type {
  DevServerPlugin,
  RollupPlugin,
  VitePlugin,
  EsbuildPlugin,
  WebpackPluginInstance,
}
