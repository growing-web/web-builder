import type {
  WebBuilderManifest,
  LoadManifestOptions,
} from '@growing-web/web-builder-types'
import type { JSONSchema7 } from 'schema-utils/declarations/ValidationError'
import path from 'pathe'
import fs from 'fs-extra'
import merge from 'defu'
import schemaUtils from 'schema-utils'
import schema from './schema.json'

const PROJECT_MANIFEST = 'project-manifest.json'

/**
 * Field validation of manifest against `schema.json`
 * @param json manifest json content
 * @param defaultSchema The json schema corresponding to the manifest
 */
export function validate(json: WebBuilderManifest, defaultSchema = schema) {
  return schemaUtils.validate(defaultSchema as JSONSchema7, json)
}

/**
 * Load configuration from manifest file
 * @param options.root manifest file storage directory
 * @param options.manifestFileName manifest filename
 * @returns
 */
export async function read(
  options: LoadManifestOptions = {},
): Promise<WebBuilderManifest> {
  const { root = process.cwd(), manifestFileName = PROJECT_MANIFEST } = options
  const manifestFilePath = path.resolve(root, manifestFileName)
  try {
    const json = await fs.readJSON(manifestFilePath)
    return json
  } catch (error) {
    throw error
  }
}

/**
 * Load configuration from manifest file and perform field validation
 * @param options.root manifest file storage directory
 * @param options.manifestFileName manifest filename
 * @returns
 */
export async function parse(
  options: LoadManifestOptions = {},
): Promise<WebBuilderManifest> {
  try {
    const json = await read(options)
    validate(json)

    const { env, ...config } = json!

    let resultConfig = config

    // The configuration in the env takes precedence over the root directory configuration
    const mode = options.mode
    if (mode && env && env[mode]) {
      // Merge configuration items
      resultConfig = merge(env[mode] as any, resultConfig)
    }
    return resultConfig
  } catch (error) {
    throw error
  }
}
