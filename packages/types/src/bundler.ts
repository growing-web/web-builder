import type { WebBuilderMode } from './web-builder'

export type BundlerType = 'vite' | 'webpack'

export type FrameworkType = 'vue' | 'react' | 'vanilla'

export interface GetBundlerConfigOptions {
  bundlerType?: BundlerType
  preset?: string
  mode?: WebBuilderMode
}
