import type { WebBuilderMode, WebBuilder } from '@growing-web/web-builder-types'
import { parse } from '@growing-web/web-builder-schema'

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
  webBuilder.options.manifest = config
}
