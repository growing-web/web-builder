import type { PackageJson } from 'pkg-types'
import { readPackageJSON as _readPackageJSON } from 'pkg-types'

// Load dependencies in package
// Include devDependencies
export async function readPackageJSON(
  cwd: string = process.cwd(),
): Promise<PackageJson> {
  const pkgJSON = await _readPackageJSON(cwd)
  return pkgJSON
}

export async function getDeps(cwd: string = process.cwd()) {
  const { dependencies = {}, devDependencies = {} } = await readPackageJSON(cwd)

  const deps = {
    ...devDependencies,
    ...dependencies,
  }

  const keys = Array.from(
    new Set([...Object.keys(devDependencies), ...Object.keys(dependencies)]),
  )
  return {
    keys,
    deps,
  }
}
