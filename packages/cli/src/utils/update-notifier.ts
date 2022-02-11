import updateNotifier from 'update-notifier'
import pkg from '../../package.json'
import chalk from 'chalk'

/**
 * web builder version update check notification
 */
export function updateNotice() {
  const notifier = updateNotifier({
    pkg,
    shouldNotifyInNpmScript: true,
  })
  notifier?.notify({
    message: `Update available ${chalk.red('{currentVersion}')} → ${chalk.green(
      '{latestVersion}',
    )}.\nRun ${chalk.cyan('pnpm add @growing-web/web-builder -D')} to update.`,
  })
}
