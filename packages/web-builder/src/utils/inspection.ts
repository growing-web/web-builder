import chalk from 'chalk'
import clear from 'clear'
import updateNotifier from 'update-notifier'
import { satisfies } from 'semver'
import { logger } from '@growing-web/web-builder-toolkit'
import { PROJECT_NAME } from '@growing-web/web-builder-constants'
import { version, engines, name } from '../../package.json'

/**
 * show banner
 * @param _clear  whether to delete old console log messages
 */
export function loggerBanner(_clear?: boolean) {
  if (_clear) {
    clear()
  }
  logger.instance.info(chalk.green(`${PROJECT_NAME} v${version}`))
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
    message: `Update available ${chalk.red('{currentVersion}')} → ${chalk.green(
      '{latestVersion}',
    )}.\nRun ${chalk.cyan('pnpm add @growing-web/web-builder -D')} to update.`,
  })
}

export function inspection() {
  loggerBanner()
  checkEngines()
  updateNotice()
}
