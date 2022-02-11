import chalk from 'chalk'
import { cac } from 'cac'
import { Logger, PROJECT_NAME } from '@growing-web/web-builder-shared'
import { showBanner } from './utils/banner'
import { checkEngines } from './utils/engines'
import { updateNotice } from './utils/update-notifier'
import { commands } from './commands'
import pkg from '../package.json'
import 'v8-compile-cache'

async function main() {
  const webBuild = cac(PROJECT_NAME)
  for (const { meta, action } of commands) {
    const { command, usage, options } = meta
    const _webBuild = webBuild.command(command).usage(usage)

    for (const { rawName, description, ...config } of options) {
      _webBuild.option(rawName, description, config)
    }
    _webBuild.action(action)
  }

  // Invalid command
  webBuild.on('command:*', function () {
    Logger.error(chalk.red('Invalid command!'))
    process.exit(1)
  })

  webBuild.version(pkg.version)
  webBuild.usage(PROJECT_NAME)
  webBuild.help()
  webBuild.parse()
}

showBanner()
checkEngines()
updateNotice()

process.on('unhandledRejection', (err) =>
  Logger.error('[unhandledRejection]', err),
)

process.on('uncaughtException', (err) =>
  Logger.error('[uncaughtException]', err),
)

main().catch((err: unknown) => {
  Logger.error(err)
  process.exit(1)
})
