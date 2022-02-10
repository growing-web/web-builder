import type { InlineConfig } from 'vite'
import type { AnyFunction } from './util'

export interface WebBuilderPreset {
  vite?: (...arg: any) => InlineConfig
  // TODO
  webpack?: AnyFunction
}
