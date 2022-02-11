import path from 'pathe'
import fse from 'fs-extra'

// Load dependencies in package
// Include devDependencies
export async function readDependencies(
  cwd: string = process.cwd(),
): Promise<Record<string, string>> {
  const pkgJson = await fse.readJSON(path.resolve(cwd, 'package.json'))
  const { dependencies = {}, devDependencies = {} } = pkgJson || {}
  const deps = Object.assign(dependencies, devDependencies)
  return deps
}
