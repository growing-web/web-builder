import type {
  UserConfig,
  WebBuilderMode,
  WebBuilder,
} from '@growing-web/web-builder-types'
import type { PluginOption } from 'vite'
import { createCertPlugin } from './cert'
import { createAnalyzePlugin } from './analyze'
import { createImportMapManifestPlugin } from './import-map'

export function createPlugins(
  webBuilder: WebBuilder,
  userConfig: UserConfig,
  mode?: WebBuilderMode,
): PluginOption[] {
  const { server: { mkcert } = {}, build: { report, reportJson } = {} } =
    userConfig

  const rootDir = webBuilder.service?.rootDir ?? process.cwd()

  const plugins: PluginOption[] = [createImportMapManifestPlugin({ rootDir })]

  // cert-plugin
  plugins.push(...createCertPlugin(!!mkcert, mode))

  // analyze-plugin
  plugins.push(...createAnalyzePlugin(!!report, !!reportJson, mode))

  return plugins
}
