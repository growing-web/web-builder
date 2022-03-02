import type {
  UserConfig,
  ManifestConfig,
  WebBuilderConfig,
} from '@growing-web/web-builder-types'
import type { JSONSchema7 } from 'schema-utils/declarations/ValidationError'
import { merge, semver } from '@growing-web/web-builder-kit'
import {
  USER_CONFIG_FILES,
  WEB_PROJECT_CONFIG_FILES,
} from '@growing-web/web-builder-constants'
import { configLoader } from './configLoader'
import schemaUtils from 'schema-utils'
import schema from '../web-project-schema.json'

export interface ResolveConfigOptions {
  rootDir: string
  mode?: string
  injectData?: Record<string, string>
}

/**
 * Integrate manifestConfig and UserConfig priorities
 * manifestConfig takes precedence over UserConfig
 */
export async function resolveConfig({ rootDir, mode }: ResolveConfigOptions) {
  const [userConfig, manifestConfig] = await Promise.all([
    resolveUserConfig({ rootDir, mode }),
    resolveManifestConfig(rootDir),
  ])

  validateManifestConfig(manifestConfig)

  const config = merge(userConfig, manifestConfig)

  return config as WebBuilderConfig
}

/**
 *
 * @param rootDir project root directory
 * @param mode
 * @returns User configuration
 */
export async function resolveUserConfig({
  rootDir,
  mode,
}: ResolveConfigOptions) {
  const userConfig = await configLoader<UserConfig>({
    rootDir,
    functionParams: { mode },
    configFiles: USER_CONFIG_FILES,
  })
  return userConfig
}

/**
 *
 * @param rootDir project root directory
 * @returns config in manifest
 */
// TODO support remote manifest path
export async function resolveManifestConfig(rootDir: string) {
  const manifestConfig = await configLoader<ManifestConfig>({
    rootDir,
    configFiles: WEB_PROJECT_CONFIG_FILES,
  })

  return manifestConfig
}

/**
 * Field validation of manifest against `schema.json`
 * @param json manifest json content
 * @param defaultSchema The json schema corresponding to the manifest
 */
export function validateManifestConfig(
  json: ManifestConfig,
  defaultSchema = schema,
) {
  schemaUtils.validate(defaultSchema as JSONSchema7, json)

  const { entries, schemaVersion } = json

  // schemaVersion needs to conform to the semver specification
  if (!semver.valid(schemaVersion)) {
    throw new Error(
      `schemaVersion property must to comply with semver specification. Received: ${schemaVersion}`,
    )
  }

  // publicPath needs to start with /
  entries.forEach((entry) => {
    if (entry.publicPath && !entry.publicPath?.startsWith('/')) {
      throw new Error(
        `entry.publicPath property must start with a /. Received: ${entry.publicPath}`,
      )
    }
  })
}
