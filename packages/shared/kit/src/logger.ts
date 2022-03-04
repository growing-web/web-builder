import type { LoggerOptions, Logger } from '@growing-web/web-builder-types'
import { BUILDER_NAME } from '@growing-web/web-builder-constants'
import colors from 'picocolors'
import consola, { LogLevel, logType } from 'consola'

consola.wrapConsole()

export function createLogger(
  logLevel: LogLevel = LogLevel.Info,
  { allowClearScreen }: { allowClearScreen?: boolean } = {},
) {
  const logger = consola.create({
    level: logLevel,
    defaults: {},
  })

  const output = (
    type: logType,
    msg: string | unknown,
    options?: LoggerOptions,
  ) => {
    const prefix = `[${BUILDER_NAME}]`
    const tag =
      type === 'info'
        ? colors.cyan(colors.bold(prefix))
        : type === 'warn'
        ? colors.yellow(colors.bold(prefix))
        : colors.red(colors.bold(prefix))

    const message = `${
      options?.timestamp
        ? colors.dim(new Date().toLocaleTimeString()) + ' '
        : ''
    }${tag} ${msg}`

    if (options?.clear) {
      logger.clear()
    }
    ;(logger as any)[type](message)
  }

  const loggerInstance: Logger = {
    error(msg, options) {
      output('error', msg, options)
    },
    warn(msg, options) {
      output('warn', msg, options)
    },
    info(msg, options) {
      output('info', msg, options)
    },
    debug(msg, options) {
      output('debug', msg, options)
    },
    success(msg, options) {
      output('success', msg, options)
    },
    ready(msg, options) {
      output('ready', msg, options)
    },
    fatal(msg, options) {
      output('fatal', msg, options)
    },
    start(msg, options) {
      output('start', msg, options)
    },
    log(msg, options) {
      output('log', msg, options)
    },
    trace(msg, options) {
      output('trace', msg, options)
    },
    clear() {
      const canClearScreen =
        allowClearScreen && process.stdout.isTTY && !process.env.CI
      canClearScreen && logger.clear()
    },
  }
  return loggerInstance
}
