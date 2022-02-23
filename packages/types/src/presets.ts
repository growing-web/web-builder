import type { InlineConfig } from 'vite'
import type { AnyFunction } from './tool'

export interface WebBuilderPreset {
  vite?: (...arg: any) => InlineConfig
  // TODO
  webpack?: AnyFunction
}
