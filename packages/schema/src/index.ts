import type {
  WebBuilderManifest,
  LoadManifestOptions,
} from '@growing-web/web-builder-types'
import type { JSONSchema7 } from 'schema-utils/declarations/ValidationError'
import { path, fs, defu } from '@growing-web/web-builder-toolkit'
import schemaUtils from 'schema-utils'
import schema from '../web-project-schema.json'

const PROJECT_MANIFEST = 'web-project.json'

/**
 * Field validation of manifest against `schema.json`
 * @param json manifest json content
 * @param defaultSchema The json schema corresponding to the manifest
 */
export function validate(json: WebBuilderManifest, defaultSchema = schema) {
  const { entries, exports: _exports } = json

  schemaUtils.validate(defaultSchema as JSONSchema7, json)

  if (Object.keys(entries).length === 0) {
    throw new Error('Please set entries, the current value of entries is {}.')
  }

  //   if (importmap && !_exports) {
  //     throw new Error(
  //       'When `importmap` is set, the `exports` configuration cannot be empty.',
  //     )
  //   }

  const entryKeys = Object.keys(entries)
  const entryValues = Object.values(entries)
  if (
    entryKeys.length > 1 &&
    entryValues.some((item) => item.endsWith('.html')) &&
    entryValues.some((item) => !item.endsWith('.html'))
  ) {
    throw new Error(
      'When `entries` configure multiple entries, you need to ensure that all of them are of `html` type or all of them are of `non-html` type.',
    )
  }
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
      resultConfig = defu(env[mode] as any, resultConfig)
    }
    return resultConfig
  } catch (error) {
    throw error
  }
}
