import { FrameworkType } from '@growing-web/web-builder-types'
import { readDependencies } from './package'
import semver from 'semver'
import { getLatestVersion } from './npm'

/**
 * Analyze project types, currently only support vue, react, vanilla
 */
export async function getFrameworkType(
  cwd = process.cwd(),
): Promise<FrameworkType | { framework: FrameworkType; version: number }> {
  const deps = await readDependencies(cwd)

  let vueVersion = null
  let reactVersion = null

  for (const key of Object.keys(deps)) {
    if (['vue', 'react'].includes(key)) {
      let version = deps[key].replace(/^[\^~]/, '')
      if (version === 'latest') {
        version = await getLatestVersion(key)
      }
      if (key === 'vue') {
        vueVersion = semver.major(version)
      } else if (key === 'react') {
        reactVersion = semver.major(version)
      }
    }
  }

  // Not including vue and react is vanilla
  if (vueVersion === null && reactVersion === null) {
    return 'vanilla'
  }

  // Both vue and react are installed
  if (vueVersion !== null && reactVersion !== null) {
    throw new Error(
      `The current project has both 'vue' or 'react' dependencies installed, please install one of them according to the project type, delete the other frameworks, and try again.`,
    )
  }

  if (vueVersion !== null) {
    return {
      framework: 'vue',
      version: vueVersion,
    }
  }

  if (reactVersion !== null) {
    return {
      framework: 'react',
      version: reactVersion,
    }
  }

  return 'vanilla'
}
