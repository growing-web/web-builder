import consola from 'consola'
import { PROJECT_NAME } from './constants'

const logger = consola.create({
  // level: 4,
  defaults: {},
})

consola.wrapConsole()

function wrapMessage(message: string) {
  return `${PROJECT_NAME}: ${message}`
}

export class Logger {
  static get instance() {
    return logger
  }

  static error(message: any, ...arg: any[]) {
    logger.error(wrapMessage(message), ...arg)
  }

  static warn(message: any, ...arg: any[]) {
    logger.warn(wrapMessage(message), ...arg)
  }

  static info(message: any, ...arg: any[]) {
    logger.info(wrapMessage(message), ...arg)
  }

  static debug(message: any, ...arg: any[]) {
    logger.debug(wrapMessage(message), ...arg)
  }

  static success(message: any, ...arg: any[]) {
    logger.success(wrapMessage(message), ...arg)
  }

  static ready(message: any, ...arg: any[]) {
    logger.ready(wrapMessage(message), ...arg)
  }

  static fatal(message: any, ...arg: any[]) {
    logger.fatal(wrapMessage(message), ...arg)
  }

  static start(message: any, ...arg: any[]) {
    logger.start(wrapMessage(message), ...arg)
  }

  static log(message: any, ...arg: any[]) {
    logger.log(wrapMessage(message), ...arg)
  }

  static trace(message: any, ...arg: any[]) {
    logger.trace(wrapMessage(message), ...arg)
  }
}
