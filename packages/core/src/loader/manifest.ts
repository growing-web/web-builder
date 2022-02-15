import type { WebBuilderMode } from '@growing-web/web-builder-types'
import { parse } from '@growing-web/web-builder-schema'

/**
 * Load manifest file and add to webBuilder instance
 * @param webBuilder
 * @param mode
 */
export async function loadManifestForWebBuilder(mode?: WebBuilderMode) {
  const manifest = await parse({ mode })

  return manifest
}
