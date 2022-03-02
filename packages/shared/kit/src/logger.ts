import consola from 'consola'
import { BUILDER_NAME } from '@growing-web/web-builder-constants'

const Logger = consola.create({
  // level: 4,
  defaults: {},
})

consola.wrapConsole()

function wrapMessage(message: string) {
  return `${BUILDER_NAME}: ${message}`
}

export class logger {
  static get instance() {
    return logger
  }

  static error(message: any, ...arg: any[]) {
    Logger.error(wrapMessage(message), ...arg)
  }

  static warn(message: any, ...arg: any[]) {
    Logger.warn(wrapMessage(message), ...arg)
  }

  static info(message: any, ...arg: any[]) {
    Logger.info(wrapMessage(message), ...arg)
  }

  static debug(message: any, ...arg: any[]) {
    Logger.debug(wrapMessage(message), ...arg)
  }

  static success(message: any, ...arg: any[]) {
    Logger.success(wrapMessage(message), ...arg)
  }

  static ready(message: any, ...arg: any[]) {
    Logger.ready(wrapMessage(message), ...arg)
  }

  static fatal(message: any, ...arg: any[]) {
    Logger.fatal(wrapMessage(message), ...arg)
  }

  static start(message: any, ...arg: any[]) {
    Logger.start(wrapMessage(message), ...arg)
  }

  static log(message: any, ...arg: any[]) {
    Logger.log(wrapMessage(message), ...arg)
  }

  static trace(message: any, ...arg: any[]) {
    Logger.trace(wrapMessage(message), ...arg)
  }
}
