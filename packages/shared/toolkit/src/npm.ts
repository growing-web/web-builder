import latestVersion from 'latest-version'
import whichPMRuns from 'which-pm-runs'
import updateNotifier from 'update-notifier'
import { satisfies } from 'semver'
import { colors } from './lib'
import { logger } from './logger'

type NpmClientType = 'npm' | 'pnpm' | 'yarn'
interface NpmInstallOptions {
  workspaceRoot?: boolean
  dev?: boolean
  packageName: string
  global?: boolean
  client?: NpmClientType
}

export async function getLatestVersion(name: string) {
  const version = await latestVersion(name)
  return version
}

export function getPackageManager(): NpmClientType {
  const usedPM = whichPMRuns()
  return (usedPM?.name as NpmClientType) ?? 'npm'
}

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

  return messageMap[npmClient].replace(/\s+/g, ' ').trimEnd().trimStart()
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
