import type { WebBuilderMode } from '@growing-web/web-builder-types'
import type { PluginOption } from 'vite'
import visualizer from 'rollup-plugin-visualizer'
import { transform } from 'esbuild'

export function createAnalyzePlugin(
  report: boolean,
  reportJson: boolean,
  mode?: WebBuilderMode,
): PluginOption[] {
  if ((report || reportJson) && mode !== 'development') {
    return [
      {
        name: 'web-builder:analyze-minify',
        async generateBundle(_opts, outputBundle) {
          for (const [_bundleId, bundle] of Object.entries(outputBundle)) {
            if (bundle.type !== 'chunk') {
              continue
            }
            const originalEntries = Object.entries(bundle.modules)
            const minifiedEntries = await Promise.all(
              originalEntries.map(async ([moduleId, mod]) => {
                const { code } = await transform(mod.code || '', {
                  minify: true,
                })
                return [moduleId, { ...mod, code }]
              }),
            )
            // eslint-disable-next-line
            bundle.modules = Object.fromEntries(minifiedEntries)
          }
        },
      },
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: false,
        json: reportJson,
        title: 'Bundle stats',
        filename: `report.${reportJson ? 'json' : 'html'}`,
      }) as PluginOption,
    ]
  }
  return []
}
