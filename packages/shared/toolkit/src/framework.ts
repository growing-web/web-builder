import { FrameworkType } from '@growing-web/web-builder-types'
import { readPackageJSON } from 'pkg-types'
import { getLatestVersion } from './npm'
import semver from 'semver'

/**
 * Analyze project types, currently only support vue, react, vanilla
 */
export async function loadFrameworkTypeAndVersion(
  cwd = process.cwd(),
): Promise<{ framework: FrameworkType; version: number }> {
  const { dependencies = {}, devDependencies = {} } = await readPackageJSON(cwd)

  const deps = {
    ...devDependencies,
    ...dependencies,
  }

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
    return {
      framework: 'vanilla',
      version: 0,
    }
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
  return {
    framework: 'vanilla',
    version: 0,
  }
}
