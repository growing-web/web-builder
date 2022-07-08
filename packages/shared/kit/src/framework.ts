import type { FrameworkType, Recordable } from '@growing-web/web-builder-types'
import { getNpmLatestVersion } from './npm'
import semver from 'semver'
import { getDeps } from './package'

const FRAMEWORK_LIST: FrameworkType[] = ['vue', 'react', 'svelte', 'lit']

/**
 * Analyze project framework type
 */
async function loadFrameworkTypeAndVersion(
  cwd = process.cwd(),
): Promise<{ framework: FrameworkType; version: number | string }> {
  const { deps } = await getDeps(cwd)

  const versionMap: Recordable<number | string | null> = {}

  FRAMEWORK_LIST.forEach((key) => {
    versionMap[key] = null
  })

  for (const _key of Object.keys(deps)) {
    const key = _key as FrameworkType
    if (FRAMEWORK_LIST.includes(key)) {
      let version = deps[key].replace(/^[\^~]/, '')
      if (version === 'latest') {
        version = await getNpmLatestVersion(key)
      }
      const majorVersion = semver.major(version)
      if (key === 'vue') {
        if (majorVersion < 3) {
          const minorVersion = semver.minor(version)
          versionMap[key] = `${majorVersion}.${minorVersion}`
        } else {
          versionMap[key] = majorVersion
        }
      } else {
        versionMap[key] = majorVersion
      }
    }
  }

  const frameValues = Object.values(versionMap)

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

export { loadFrameworkTypeAndVersion }
