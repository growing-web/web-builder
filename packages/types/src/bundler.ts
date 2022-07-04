import type { WebBuilderMode } from './web-builder'

export type BundlerType = 'vite'

export type FrameworkType = 'vue' | 'react' | 'vanilla' | 'svelte' | 'lit'

export interface GetBundlerConfigOptions {
  bundlerType?: BundlerType
  preset?: string
  mode?: WebBuilderMode
}
