import {
  PRESET_NPM_PACKAGE_PREFIX,
  REACT_PRESET_PACKAGE,
  VUE_PRESET_PACKAGE,
} from '@growing-web/web-builder-constants'
import { readDependencies } from './package'
import { logger } from './logger'
import { getFrameworkType } from './framework'
import { BundlerType, WebBuilderPreset } from '@growing-web/web-builder-types'
import chalk from 'chalk'

/**
 * try to load preset
 */
export async function parsePreset() {
  const deps = await readDependencies()

  const presetLib: string[] = []

  Object.keys(deps).forEach((key) => {
    if (
      key.startsWith(PRESET_NPM_PACKAGE_PREFIX) &&
      key !== PRESET_NPM_PACKAGE_PREFIX
    ) {
      presetLib.push(key)
    }
  })

  // only one preset
  if (presetLib.length === 1) {
    return presetLib[0]
  }

  // more than one preset
  if (presetLib.length > 1) {
    logger.error(
      `Your project contains multiple preset dependencies, please select a correct preset and delete other preset dependencies to solve ${chalk.cyan(
        presetLib.toString(),
      )}`,
      process.exit(1),
    )
  }

  // no presets installed
  if (presetLib.length === 0) {
    // Attempt to automatically analyze item types
    const frameworkType = await getFrameworkType()

    if (frameworkType === 'vanilla') {
      return null
    }

    if (typeof frameworkType !== 'string') {
      const { framework } = frameworkType

      if (framework === 'react') {
        return REACT_PRESET_PACKAGE
      }

      if (framework === 'vue') {
        return VUE_PRESET_PACKAGE
      }
    }
  }

  return null
}

/**
 * Convert presets to corresponding configurations
 * @param preset
 * @param bundlerType
 * @returns
 */
export async function transformPresetToConfig(
  preset: string,
  bundlerType: BundlerType,
  mergeFunc: (config: any, covering: any) => any,
) {
  let config: any = {}
  const presets = await loadPresetForString(preset)

  // Attempt to automatically analyze item types
  const frameworkType = await getFrameworkType()
  let isVue = false
  let vueVersion = -1
  if (typeof frameworkType !== 'string') {
    const { framework, version } = frameworkType
    isVue = framework === 'vue'
    if (isVue) {
      vueVersion = version
    }
  }

  for (const currentPreset of presets) {
    const processConfigFunc = currentPreset?.[bundlerType] ?? (() => ({}))
    const overrides = processConfigFunc(vueVersion)
    config = mergeFunc(config, overrides)
  }
  return config
}

/**
 * Load preset
 * @param preset
 * @returns
 */
export async function loadPresetForString(
  preset: string,
): Promise<WebBuilderPreset[]> {
  try {
    const res = await import(preset)
    return res
  } catch (err) {
    logger.error(err)
    throw err
  }
}
