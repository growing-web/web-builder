import type { WebBuilderMode } from './cli'

export type BundlerType = 'vite' | 'webpack'

export type FrameworkType = 'vue' | 'react' | 'vanilla'

export interface GetBundlerConfigOptions {
  bundlerType?: BundlerType
  preset?: string
  mode?: WebBuilderMode
}
