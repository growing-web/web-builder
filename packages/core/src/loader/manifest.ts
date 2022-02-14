import type {
  WebBuilderMode,
  WebBuilder,
  WebBuilderManifest,
} from '@growing-web/web-builder-types'
import { parse } from '@growing-web/web-builder-schema'
import merge from 'defu'

/**
 * Load manifest file and add to webBuilder instance
 * @param webBuilder
 * @param mode
 */
export async function loadManifestForWebBuilder(
  webBuilder: WebBuilder,
  mode?: WebBuilderMode,
) {
  const config = await parse({ mode })

  const defaultManifest: Partial<WebBuilderManifest> = {
    target: 'app',
    formats: [],
    server: {
      port: 5500,
      host: true,
      proxy: [],
    },
  }
  webBuilder.options.manifest = merge(config, defaultManifest)
}
