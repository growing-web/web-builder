import type { UserConfig, WebBuilderMode } from '@growing-web/web-builder-types'
import type { PluginOption } from 'vite'
import { createCertPlugin } from './cert'
import { createAnalyzePlugin } from './analyze'

export function createPlugins(
  userConfig: UserConfig,
  mode?: WebBuilderMode,
): PluginOption[] {
  const { server: { mkcert } = {}, build: { report, reportJson } = {} } =
    userConfig

  const plugins: PluginOption[] = []

  // cert-plugin
  plugins.push(...createCertPlugin(!!mkcert, mode))

  // analyze-plugin
  plugins.push(...createAnalyzePlugin(!!report, !!reportJson, mode))

  return plugins
}
