import type {
  WebBuilderMode,
  WebBuilder,
  WebBuilderConfig,
  ManifestConfigEntry,
  ManifestOutputType,
} from '@growing-web/web-builder-types'
import type { PluginOption } from 'vite'
import { path } from '@growing-web/web-builder-kit'
import { createCertPlugin } from './cert'
import { createAnalyzePlugin } from './analyze'
import { createManifestPlugin } from './manifest'
import shadowDomCssPlugin from 'vite-plugin-shadow-dom-css'
import dts from 'vite-plugin-dts'

export function createPlugins({
  entry,
  config,
  mode,
}: {
  webBuilder: WebBuilder
  entry: ManifestConfigEntry
  config: WebBuilderConfig
  mode?: WebBuilderMode
}) {
  const {
    server: { mkcert } = {},
    build: { report, reportJson } = {},
    manifests,
  } = config

  const { output: { name, declaration, dir = 'dist' } = {} } = entry

  const plugins: (PluginOption | PluginOption[])[] = []

  // TODO FIXME
  // @ts-ignore skip
  const _shadowDomCssPlugin = shadowDomCssPlugin.default || shadowDomCssPlugin
  plugins.push(
    _shadowDomCssPlugin({
      include: [/\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\?)/],
    }),
  )

  // cert-plugin
  plugins.push(...createCertPlugin(!!mkcert, mode))

  // dts-plugin
  // FIXME
  declaration &&
    plugins.push(
      dts({
        root: process.cwd(),
        outputDir: path.resolve(process.cwd(), dir),
        staticImport: true,
        insertTypesEntry: true,
        logDiagnostics: true,
      }),
    )

  // analyze-plugin
  plugins.push(...createAnalyzePlugin(!!report, !!reportJson, mode))

  // manifest-plugin
  if (manifests?.includes('exports-manifest')) {
    plugins.push(createManifestPlugin(name))
  }

  return plugins as PluginOption[]
}
