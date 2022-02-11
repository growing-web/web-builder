import pkg from '../../package.json'
import chalk from 'chalk'
import clear from 'clear'
import { PROJECT_NAME, Logger } from '@growing-web/web-builder-shared'

/**
 * show banner
 * @param _clear  whether to delete old console log messages
 */
export function showBanner(_clear?: boolean) {
  if (_clear) {
    clear()
  }
  Logger.instance.info(chalk.green(`${PROJECT_NAME} v${pkg.version}`))
}
