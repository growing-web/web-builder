import type { Plugin as DevServerPlugin } from '@web/dev-server-core'

import type {
  UnpluginOptions,
  RollupPlugin,
  VitePlugin,
  EsbuildPlugin,
} from 'unplugin'

import type { WebpackPluginInstance } from 'webpack'

export type PluginOptions = Omit<
  UnpluginOptions & { webDevServer?: Partial<WebDevServerPlugin> },
  // TODO Currently only rollup 、webDevServer and vite are supported
  'webpack' | 'esbuild'
>

export interface WebDevServerPlugin extends Omit<DevServerPlugin, 'name'> {
  name?: string
}

export interface PluginInstance {
  rollup: RollupPlugin[]
  webDevServer: WebDevServerPlugin[]
  vite: VitePlugin[]
  esbuild: EsbuildPlugin[]
  webpack: WebpackPluginInstance[]
}

export type { RollupPlugin, VitePlugin, EsbuildPlugin, WebpackPluginInstance }
