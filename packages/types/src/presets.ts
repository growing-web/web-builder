import type { InlineConfig } from 'vite'

export interface WebBuilderPreset {
  vite?: (...arg: any) => InlineConfig
}
