import updateNotifier from 'update-notifier'
import { colors } from './lib'
import { findup } from './fs'
import { exec } from 'child_process'
import { execaSync } from 'execa'
import fs from 'fs'
import path from 'path'

export type NpmClientType = 'npm' | 'pnpm' | 'yarn'

interface NpmInstallOptions {
  monorepoRoot?: boolean
  dev?: boolean
  packageName: string
  global?: boolean
  client?: NpmClientType
}

const PACKAGE_MANAGER_LOCKS = {
  yarn: 'yarn.lock',
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
}

export function getNpmLatestVersion(name: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`npm view ${name} version`, (err, stdout) => {
      if (err) {
        reject(err)
      }
      resolve(stdout)
    })
  })
}

export function getNpmPackageManager(rootDir: string = process.cwd()) {
  return findup(rootDir, (dir) => {
    for (const key of Object.keys(PACKAGE_MANAGER_LOCKS)) {
      const _key = key as NpmClientType
      if (fs.existsSync(path.join(dir, PACKAGE_MANAGER_LOCKS[_key]))) {
        if (canUseNpmPackageManager(_key)) {
          return _key
        }
        return 'npm'
      }
    }
  })
}

export function createNpmInstallMessage({
  dev,
  monorepoRoot = false,
  packageName,
  global = true,
  client,
}: NpmInstallOptions) {
  const npmClient = client || getNpmPackageManager()

  const suffix = `${packageName} ${dev ? '-D' : ''} ${monorepoRoot ? '-W' : ''}`

  const npmMessage = `npm install ${global ? '-g' : ' '} ${suffix}`
  const yarnMessage = `yarn ${global ? 'global' : ''} add ${suffix}`
  const pnpmMessage = `pnpm add ${global ? '-g' : ''} ${suffix}`

  const messageMap: Record<NpmClientType, string> = {
    npm: npmMessage,
    pnpm: pnpmMessage,
    yarn: yarnMessage,
  }

  return messageMap[npmClient as NpmClientType]
    .replace(/\s+/g, ' ')
    .trimEnd()
    .trimStart()
}

/**
 * web builder version update check notification
 */
export function npmUpdateNotify({
  name,
  version,
}: {
  name: string
  version: string
}) {
  const notifier = updateNotifier({
    pkg: { name, version },
    shouldNotifyInNpmScript: true,
  })
  notifier?.notify({
    message: `Update available ${colors.red(
      '{currentVersion}',
    )} → ${colors.green('{latestVersion}')}.\nRun ${colors.cyan(
      `${createNpmInstallMessage({
        dev: true,
        global: false,
        packageName: name,
      })}`,
    )} to update.`,
  })
}

export function canUseNpmPackageManager(
  packageManager: 'npm' | 'pnpm' | 'yarn',
) {
  try {
    execaSync(packageManager, ['--version'], { env: process.env })
    return true
  } catch (e) {
    return false
  }
}
