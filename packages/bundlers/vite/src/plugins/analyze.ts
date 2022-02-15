import type { WebBuilderMode } from '@growing-web/web-builder-types'
import type { PluginOption } from 'vite'
import visualizer from 'rollup-plugin-visualizer'

export function createAnalyzePlugin(
  report: boolean,
  reportJson: boolean,
  mode?: WebBuilderMode,
): PluginOption[] {
  if ((report || reportJson) && mode !== 'development') {
    return [
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        json: reportJson,
        filename: `report.${reportJson ? 'json' : 'html'}`,
      }),
    ]
  }
  return []
}
