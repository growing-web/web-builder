import type { WebBuilderMode } from '@growing-web/web-builder-types'
import type { PluginOption } from 'vite'
import viteCertPlugin from 'vite-plugin-mkcert'

export function createCertPlugin(
  mkcert: boolean,
  mode?: WebBuilderMode,
): PluginOption[] {
  if (mkcert && mode === 'development') {
    // FIXME
    // TODO
    // @ts-ignore skip
    const _viteCertPlugin = viteCertPlugin.default || viteCertPlugin
    return [_viteCertPlugin()]
  }
  return []
}
