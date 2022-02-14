import type { FrameworkType, Recordable } from '@growing-web/web-builder-types'
import { readPackageJSON } from 'pkg-types'
import { getLatestVersion } from './npm'
import semver from 'semver'

const FRAMEWORK_LIST: FrameworkType[] = [
  'vue',
  'react',
  'svelte',
  'preact',
  'lit',
]

/**
 * Analyze project framework type
 */
export async function loadFrameworkTypeAndVersion(
  cwd = process.cwd(),
): Promise<{ framework: FrameworkType; version: number }> {
  const { dependencies = {}, devDependencies = {} } = await readPackageJSON(cwd)

  const deps = {
    ...devDependencies,
    ...dependencies,
  }

  let versionMap: Recordable<number | null> = {}

  FRAMEWORK_LIST.forEach((key) => {
    versionMap[key] = null
  })

  for (const _key of Object.keys(deps)) {
    const key = _key as FrameworkType
    if (FRAMEWORK_LIST.includes(key)) {
      let version = deps[key].replace(/^[\^~]/, '')
      if (version === 'latest') {
        version = await getLatestVersion(key)
      }
      versionMap[key] = semver.major(version)
    }
  }

  let frameValues = Object.values(versionMap)

  // Not including framework is vanilla
  if (frameValues.every((item) => !item)) {
    return {
      framework: 'vanilla',
      version: 0,
    }
  }

  const installFramework: FrameworkType[] = []
  Object.entries(versionMap).forEach(([key, value]) => {
    if (value !== null) {
      installFramework.push(key as FrameworkType)
    }
  })

  // Multiple frameworks installed
  if (installFramework.length > 1) {
    throw new Error(
      `The current project has both ${installFramework.toString()} dependencies installed, please install one of them according to the project type, delete the other frameworks, and try again.`,
    )
  }

  for (const [key, version] of Object.entries(versionMap)) {
    if (versionMap[key] !== null) {
      return {
        framework: key as FrameworkType,
        version: version!,
      }
    }
  }
  return {
    framework: 'vanilla',
    version: 0,
  }
}
