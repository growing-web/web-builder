import fs from 'fs-extra'
import path from 'pathe'
import { findup } from './fs'

const WORK_SPACE_LERNA_FILE = 'lerna.json'
const WORK_SPACE_YARN_FILE = 'package.json'
const WORK_SPACE_PNPM_FILE = 'pnpm-workspaces.yaml'

export function isLerna(cwd: string) {
  return fs.existsSync(path.join(cwd, WORK_SPACE_LERNA_FILE))
}

export function isYarnWorkspace(cwd: string) {
  const pkgPath = path.join(cwd, WORK_SPACE_YARN_FILE)

  if (!fs.existsSync(pkgPath)) {
    return false
  }

  const json = fs.readJSONSync(pkgPath)

  return Boolean(json.workspaces)
}

export function isPnpmWorkspace(cwd: string) {
  return fs.existsSync(path.join(cwd, WORK_SPACE_PNPM_FILE))
}

export function isMonorepo(cwd: string) {
  return isPnpmWorkspace(cwd) || isLerna(cwd) || isYarnWorkspace(cwd)
}

export async function findMonorepoRoot(cwd: string) {
  return findup(cwd, (dir) => {
    if (isMonorepo(dir)) {
      return dir
    }
  })
}
