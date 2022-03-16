import type {
  UnpluginOptions,
  RollupPlugin,
  VitePlugin,
  EsbuildPlugin,
} from 'unplugin'

import type { WebpackPluginInstance } from 'webpack'

export type PluginOptions = Omit<
  UnpluginOptions,
  // TODO Currently only rollup and vite are supported
  'webpack' | 'esbuild'
>

export interface PluginInstance {
  rollup: RollupPlugin[]
  vite: VitePlugin[]
  esbuild: EsbuildPlugin[]
  webpack: WebpackPluginInstance[]
}

export type { RollupPlugin, VitePlugin, EsbuildPlugin, WebpackPluginInstance }
