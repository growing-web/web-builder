import latestVersion from 'latest-version'
import updateNotifier from 'update-notifier'
import { satisfies } from 'semver'
import { colors } from './lib'
import { logger } from './logger'
import findYarnWorkspaceRoot from 'find-yarn-workspace-root'
import findPnpmWorkspaceRoot from '@pnpm/find-workspace-dir'
import { findup } from './fs'
import fs from 'fs'
import path from 'pathe'

export type NpmClientType = 'npm' | 'pnpm' | 'yarn'

interface NpmInstallOptions {
  workspaceRoot?: boolean
  dev?: boolean
  packageName: string
  global?: boolean
  client?: NpmClientType
}

export const packageManagerLocks: Record<NpmClientType, any> = {
  yarn: 'yarn.lock',
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
}

export async function getLatestVersion(name: string) {
  const version = await latestVersion(name)
  return version
}

export function getPackageManager(rootDir: string = process.cwd()) {
  return findup(rootDir, (dir) => {
    for (const name in packageManagerLocks) {
      if (
        fs.existsSync(
          path.resolve(dir, packageManagerLocks[name as NpmClientType]),
        )
      ) {
        return name
      }
    }
  })
}

// export function getPackageManager(): NpmClientType {
//   const usedPM = whichPMRuns()
//   return (usedPM?.name as NpmClientType) ?? 'npm'
// }

export function getNpmInstallMessage({
  dev,
  workspaceRoot = false,
  packageName,
  global = true,
  client,
}: NpmInstallOptions) {
  const npmClient = client || getPackageManager()

  const suffix = `${packageName} ${dev ? '-D' : ''} ${
    workspaceRoot ? '-W' : ''
  }`

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
      `${getNpmInstallMessage({
        dev: true,
        global: false,
        packageName: name,
      })}`,
    )} to update.`,
  })
}

export async function checkNodeEngines(engines: { node: string }) {
  const currentNode = process.versions.node
  const nodeRange = engines?.node ?? ''

  if (!satisfies(currentNode, nodeRange)) {
    logger.error(
      `Current version of Node.js (\`${currentNode}\`) is unsupported and might cause issues.\n       Please upgrade to a compatible version (${nodeRange}).`,
    )
    process.exit(1)
  }
}

export async function findWorkspaceRoot(cwd: string) {
  const npmClient = getPackageManager(cwd)
  let root: string | null | undefined = cwd
  if (npmClient === 'pnpm') {
    root = await findPnpmWorkspaceRoot(cwd)
  } else if (npmClient === 'yarn') {
    root = findYarnWorkspaceRoot()
  }

  return root
}
