import type { LogLevel } from 'consola'

export type { LogLevel }

export interface LoggerOptions {
  timestamp?: boolean
  clear?: boolean
}

export interface Logger {
  error(msg: string | unknown, options?: LoggerOptions | undefined): void
  warn(msg: string, options?: LoggerOptions | undefined): void
  info(msg: string, options?: LoggerOptions | undefined): void
  debug(msg: string, options?: LoggerOptions | undefined): void
  success(msg: string, options?: LoggerOptions | undefined): void
  ready(msg: string, options?: LoggerOptions | undefined): void
  fatal(msg: string, options?: LoggerOptions | undefined): void
  start(msg: string, options?: LoggerOptions | undefined): void
  log(msg: string, options?: LoggerOptions | undefined): void
  trace(msg: string, options?: LoggerOptions | undefined): void
  clear(): void
}
