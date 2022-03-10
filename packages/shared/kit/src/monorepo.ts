import fs from 'fs-extra'
import path from 'pathe'
import { findup, JSONReader } from './fs'
import fg from 'fast-glob'
import readYamlFile from 'read-yaml-file'

const WORK_SPACE_LERNA_FILE = 'lerna.json'
const WORK_SPACE_YARN_FILE = 'package.json'
const WORK_SPACE_PNPM_FILE = 'pnpm-workspace.yaml'

export function isLerna(root: string) {
  return fs.existsSync(path.join(root, WORK_SPACE_LERNA_FILE))
}

export function isYarnWorkspace(root: string) {
  const pkgPath = path.join(root, WORK_SPACE_YARN_FILE)

  if (!fs.existsSync(pkgPath)) {
    return false
  }

  const json = JSONReader(pkgPath, true)

  return Boolean(json.workspaces)
}

export function isPnpmWorkspace(root: string) {
  return fs.existsSync(path.join(root, WORK_SPACE_PNPM_FILE))
}

export function isMonorepo(root: string) {
  return isPnpmWorkspace(root) || isLerna(root) || isYarnWorkspace(root)
}

export async function findMonorepoRoot(root: string) {
  return findup(root, (dir) => {
    if (isMonorepo(dir)) {
      return dir
    }
  })
}

export async function findWorkspacePackages(
  root: string,
  //   options?: { includeRoot: boolean },
): Promise<string[]> {
  if (!isMonorepo(root)) {
    return []
  }

  //   const { includeRoot } = options || {}

  let resultPkgs: string[] = []

  if (isPnpmWorkspace(root)) {
    const yaml = await resolvePackagesManifest(root)
    if (yaml?.packages) {
      resultPkgs = findPackages(yaml.packages, root)
    }
  }

  if (isLerna(root) && !resultPkgs.length) {
    const lernaPath = path.join(root, WORK_SPACE_LERNA_FILE)
    const lernaJson = JSONReader(lernaPath)
    if (!lernaJson.useWorkspaces) {
      resultPkgs = findPackages(lernaJson.packages, root)
    }
  }

  if (isYarnWorkspace(root) && !resultPkgs.length) {
    const pkgPath = path.join(root, WORK_SPACE_YARN_FILE)
    const pkgJson = JSONReader(pkgPath)
    let workspaces = pkgJson.workspaces

    if (workspaces) {
      if (Array.isArray(workspaces)) {
        resultPkgs = findPackages(workspaces, root)
      } else if (Array.isArray(workspaces.packages)) {
        resultPkgs = findPackages(workspaces.packages, root)
      }
    }
  }
  return resultPkgs
}

function findPackages(packageSpecs: any[], rootDirectory: string) {
  return packageSpecs.reduce((pkgDirs: string, pkgGlob: string) => {
    return [
      ...pkgDirs,
      ...(fg.isDynamicPattern(pkgGlob)
        ? fg.sync(path.join(rootDirectory, pkgGlob), {
            onlyDirectories: true,
            onlyFiles: false,
          })
        : [path.join(rootDirectory, pkgGlob)]),
    ]
  }, [])
}

async function resolvePackagesManifest(
  dir: string,
): Promise<{ packages?: string[] } | null> {
  try {
    return await readYamlFile<{ packages?: string[] }>(
      path.join(dir, WORK_SPACE_PNPM_FILE),
    )
  } catch (err: any) {
    if (err['code'] === 'ENOENT') {
      // eslint-disable-line
      return null
    }
    throw err
  }
}
