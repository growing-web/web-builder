import clear from 'clear'
import updateNotifier from 'update-notifier'
import { satisfies } from 'semver'
import { logger, colors } from '@growing-web/web-builder-toolkit'
import { version, engines, name } from '../../package.json'

/**
 * show banner
 * @param _clear  whether to delete old console log messages
 */
export function loggerBanner(_clear?: boolean) {
  if (_clear) {
    clear()
  }
  logger.instance.info(colors.green(`v${version}`))
}

export async function checkEngines() {
  const currentNode = process.versions.node
  const nodeRange = engines?.node ?? ''

  if (!satisfies(currentNode, nodeRange)) {
    logger.error(
      `Current version of Node.js (\`${currentNode}\`) is unsupported and might cause issues.\n       Please upgrade to a compatible version (${nodeRange}).`,
    )
    process.exit(1)
  }
}

/**
 * web builder version update check notification
 */
export function updateNotice() {
  const notifier = updateNotifier({
    pkg: { name, version },
    shouldNotifyInNpmScript: true,
  })
  notifier?.notify({
    message: `Update available ${colors.red(
      '{currentVersion}',
    )} → ${colors.green('{latestVersion}')}.\nRun ${colors.cyan(
      'pnpm add @growing-web/web-builder -D',
    )} to update.`,
  })
}
