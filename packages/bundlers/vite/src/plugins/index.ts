import type {
  UserConfig,
  WebBuilderMode,
  WebBuilder,
} from '@growing-web/web-builder-types'
import type { PluginOption } from 'vite'
import { createCertPlugin } from './cert'
import { createAnalyzePlugin } from './analyze'
import { createImportMapManifestPlugin } from './import-map'
import shadowDomCssPlugin from 'vite-plugin-shadow-dom-css'

export function createPlugins(
  webBuilder: WebBuilder,
  userConfig: UserConfig,
  mode?: WebBuilderMode,
) {
  const { server: { mkcert } = {}, build: { report, reportJson } = {} } =
    userConfig

  const { exports: _exports } = webBuilder.service?.manifest ?? {}

  const rootDir = webBuilder.service?.rootDir ?? process.cwd()

  const plugins: (PluginOption | PluginOption[])[] = []

  if (_exports?.importmap) {
    plugins.push(
      createImportMapManifestPlugin({
        rootDir,
      }),
    )

    // FIXME
    // TODO
    // @ts-ignore skip
    const _shadowDomCssPlugin = shadowDomCssPlugin.default || shadowDomCssPlugin
    plugins.push(
      _shadowDomCssPlugin({
        include: [/\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\?)/],
      }),
    )
  }

  // cert-plugin
  plugins.push(...createCertPlugin(!!mkcert, mode))

  // analyze-plugin
  plugins.push(...createAnalyzePlugin(!!report, !!reportJson, mode))

  return plugins as PluginOption[]
}
