import chalk from 'chalk'
import { cac } from 'cac'
import { logger } from '@growing-web/web-builder-toolkit'
import { PROJECT_NAME } from '@growing-web/web-builder-constants'
import { inspection } from './utils/inspection'
import { commands } from './commands'
import pkg from '../package.json'
import 'v8-compile-cache'

async function bootstrap() {
  inspection()

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
    logger.error(chalk.red('Invalid command!'))
    process.exit(1)
  })

  webBuild.version(pkg.version)
  webBuild.usage(PROJECT_NAME)
  webBuild.help()
  webBuild.parse()
}

process.on('unhandledRejection', (err) =>
  logger.error('[unhandledRejection]', err),
)

process.on('uncaughtException', (err) =>
  logger.error('[uncaughtException]', err),
)

bootstrap().catch((err: unknown) => {
  logger.error(err)
  process.exit(1)
})
