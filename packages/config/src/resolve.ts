import type {
  UserConfig,
  ManifestConfig,
  WebBuilderConfig,
  WebBuilderInlineConfig,
  Recordable,
  PluginOptions,
  PluginInstance,
} from '@growing-web/web-builder-types'
import type { JSONSchema7 } from 'schema-utils/declarations/ValidationError'
import {
  merge,
  semver,
  jsoncParse,
  get,
  path,
  findMonorepoRoot,
  readPackageJSON,
} from '@growing-web/web-builder-kit'
import {
  USER_CONFIG_FILES,
  WEB_PROJECT_CONFIG_FILES,
} from '@growing-web/web-builder-constants'
import { loadConfig } from './configLoader'
import {
  createBuilderDefaultConfig,
  createManifestDefaultConfig,
} from './defaultConfig'
import schemaUtils from 'schema-utils'
import schema from '@growing-web/schema'
import { createUnplugin } from 'unplugin'
import { mergeManifestConfig } from './mergeConfig'

export interface ConfigEnv {
  command: 'build' | 'dev'
  mode: string
}

/**
 * Integrate manifestConfig and UserConfig priorities
 * manifestConfig takes precedence over UserConfig
 */
export async function resolveConfig(
  inlineConfig: Partial<WebBuilderInlineConfig>,
  command: 'build' | 'dev',
  defaultMode = 'development',
) {
  const config = inlineConfig
  const mode = inlineConfig.mode || defaultMode
  const configEnv = {
    mode,
    command,
  }

  const resolvedRoot = config.root ? path.resolve(config.root) : process.cwd()

  if (mode === 'production') {
    process.env.NODE_ENV = 'production'
  }

  const [userConfig, manifestConfig] = await Promise.all([
    resolveUserConfig(configEnv, resolvedRoot),
    resolveManifestConfig(resolvedRoot),
  ])

  validateManifestConfig(manifestConfig)

  //   const logger = createLogger(config.logLevel, {
  //     allowClearScreen: config.clearScreen,
  //   })

  const defaultConfig = createBuilderDefaultConfig()

  const injectData = await createInjectData(resolvedRoot)
  const _manifestConfig = injectVariablesToManifest(manifestConfig, injectData)

  const resultConfig = merge(
    userConfig,
    _manifestConfig,
    defaultConfig,
  ) as WebBuilderConfig

  resultConfig.pluginInstance = await resolvePlugins(resultConfig.plugins)

  return resultConfig
}

async function createInjectData(root: string) {
  const [workspaceRoot = '', pkg] = await Promise.all([
    findMonorepoRoot(root),
    readPackageJSON(root),
  ])

  return {
    workspaceRoot: workspaceRoot!,
    package: pkg!,
  }
}

/**
 * Inject variables into configuration files
 */
export function injectVariablesToManifest(
  config: WebBuilderConfig,
  injectData?: Recordable<any>,
) {
  if (!injectData) {
    return config
  }

  let configString = JSON.stringify(config)

  configString = configString.replace(/\$\{([^}]+)\}/g, (match, $1) => {
    return get(injectData, $1) || match
  })
  return jsoncParse(configString) as WebBuilderConfig
}

export async function resolvePlugins(plugins: PluginOptions[] = []) {
  const pluginStance: PluginInstance = {
    vite: [],
    rollup: [],
    webpack: [],
    esbuild: [],
  }
  plugins.forEach((plugin) => {
    const instance = createUnplugin(() => plugin)

    ;['vite', 'webpack', 'rollup', 'vite'].forEach((key) => {
      const k = key as keyof PluginInstance
      pluginStance[k].push((instance as any)[k]())
    })
  })
  return pluginStance
}

/**
 *
 * @param rootDir project root directory
 * @param mode
 * @returns User configuration
 */
export async function resolveUserConfig(configEnv: ConfigEnv, rootDir: string) {
  const userConfig = await loadConfig<UserConfig>({
    rootDir,
    functionParams: configEnv,
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
  const manifestConfig = await loadConfig<ManifestConfig>({
    rootDir,
    configFiles: WEB_PROJECT_CONFIG_FILES,
  })

  const defaultConfig = createManifestDefaultConfig()

  const config = mergeManifestConfig<ManifestConfig>(
    defaultConfig,
    manifestConfig,
  )
  return config
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
    if (
      entry.publicPath &&
      !entry.publicPath?.startsWith('/') &&
      !entry.publicPath?.startsWith('http')
    ) {
      throw new Error(
        `entry.publicPath property must start with a /. Received: ${entry.publicPath}`,
      )
    }
    if (
      (entry.output?.formats?.includes('iife') ||
        entry.output?.formats?.includes('umd')) &&
      !entry.output?.meta?.umdName
    ) {
      throw new Error(`
        Option "entry.output.meta.umdName" is required when output formats include "umd" or "iife".`)
    }
  })
  if (entries.length > 1) {
    const names = entries.map((item) => item.output?.name ?? 'index')
    if (Array.from(new Set(names)).length !== entries.length) {
      throw new Error(
        `When the number of entries is greater than 1, entry.output.name needs to be guaranteed to be unique. Received: ${names.toString()}`,
      )
    }
  }
}
