import type { WebBuilderMode } from '@growing-web/web-builder-types'
import type { PluginOption } from 'vite'
import viteCertPlugin from 'vite-plugin-mkcert'

export function createCertPlugin(
  mkcert: boolean,
  mode?: WebBuilderMode,
): PluginOption[] {
  if (mkcert && mode === 'development') {
    return [viteCertPlugin()]
  }
  return []
}
