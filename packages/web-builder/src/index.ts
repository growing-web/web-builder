import { cac } from 'cac'
import {
  logger,
  colors,
  npmUpdateNotify,
  checkNodeEngines,
} from '@growing-web/web-builder-kit'
import { BUILDER_NAME } from '@growing-web/web-builder-constants'
import { commands } from './commands'
import pkg from '../package.json'
import 'v8-compile-cache'

export * from '@growing-web/web-builder-types'
export * from '@growing-web/web-builder-core'
export * from './actions'
export * from './define'

async function bootstrap() {
  logger.instance.info(colors.green(`v${pkg.version}`))

  checkNodeEngines(pkg.engines)
  npmUpdateNotify(pkg)

  process.env.__WEB_BUILDER_NAME__ = pkg.name
  process.env.__WEB_BUILDER_VERSION__ = pkg.version

  const webBuilder = cac(BUILDER_NAME)
  for (const { meta, action } of commands) {
    const { command, usage, options } = meta
    const _webBuilder = webBuilder.command(command).usage(usage)

    for (const { rawName, description, ...config } of options) {
      _webBuilder.option(rawName, description, config)
    }
    _webBuilder.action(action)
  }

  // Invalid command
  webBuilder.on('command:*', function () {
    logger.error(colors.red('Invalid command!'))
    process.exit(1)
  })

  webBuilder.version(pkg.version)
  webBuilder.usage(BUILDER_NAME)
  webBuilder.help()
  webBuilder.parse()
}

// process.on('unhandledRejection', (err) =>
//   logger.error('[unhandledRejection]', err),
// )

// process.on('uncaughtException', (err) =>
//   logger.error('[uncaughtException]', err),
// )

bootstrap().catch((err: unknown) => {
  logger.error(err)
  process.exit(1)
})
