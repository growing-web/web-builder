import type {
  WebBuilderManifest,
  SchemaParseOptions,
  SchemaReadOptions,
} from '@growing-web/web-builder-types'
import type { JSONSchema7 } from 'schema-utils/declarations/ValidationError'
import { validate as _validate } from 'schema-utils'
import fse from 'fs-extra'
import { resolve } from 'pathe'
import schema from './schema.json'
import defu from 'defu'

const PROJECT_MANIFEST = 'project-manifest.json'

/**
 * Field validation of manifest against `schema.json`
 * @param json manifest json content
 * @param defaultSchema The json schema corresponding to the manifest
 */
export function validate(json: WebBuilderManifest, defaultSchema = schema) {
  return _validate(defaultSchema as JSONSchema7, json)
}

/**
 * Load configuration from manifest file
 * @param options.root manifest file storage directory
 * @param options.manifestFileName manifest filename
 * @returns
 */
export async function read(
  options: SchemaReadOptions = {},
): Promise<WebBuilderManifest> {
  const { root = process.cwd(), manifestFileName = PROJECT_MANIFEST } = options
  const manifestFilePath = resolve(root, manifestFileName)
  try {
    const json = await fse.readJSON(manifestFilePath)
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
  options: SchemaParseOptions = {},
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
      resultConfig = defu(resultConfig, env[mode])
    }
    return resultConfig
  } catch (error) {
    throw error
  }
}
