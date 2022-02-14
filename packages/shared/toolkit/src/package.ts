import type { PackageJson } from 'pkg-types'
import { readPackageJSON as readPkgJSON } from 'pkg-types'

// Load dependencies in package
// Include devDependencies
export async function readPackageJSON(
  cwd: string = process.cwd(),
): Promise<PackageJson & { system?: string }> {
  const pkgJSON = await readPkgJSON(cwd)
  return pkgJSON
}
