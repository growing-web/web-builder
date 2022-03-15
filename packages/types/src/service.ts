import type { WebBuilderConfig } from './config'
import type { BundlerType, FrameworkType } from './bundler'
import type { Recordable } from './tool'
import type {
  WebBuilder,
  WebBuilderCommand,
  WebBuilderMode,
  WebBuilderStats,
} from './web-builder'

export interface WebBuilderServiceOptions {
  command: WebBuilderCommand
  commandArgs: Recordable<any>
  rootDir: string
}

export type ServiceCommandAction<T> = (webBuilder: WebBuilder) => Promise<T>

export interface ServiceCommandActions<T = any> {
  [command: string]: ServiceCommandAction<T>
}

export interface BasicService {
  webBuilder?: WebBuilder
  command?: string
  rootDir: string
  commandArgs: Recordable<any>
  commandActions: ServiceCommandActions
  mode?: WebBuilderMode
  bundlerType: BundlerType
  config?: WebBuilderConfig
  execStat?: WebBuilderStats
  frameworkType?: FrameworkType
  frameworkVersion?: number

  prepare: () => Promise<void>
  mergeCommandArg: (config: WebBuilderConfig) => Promise<WebBuilderConfig>
  registerCommand: (
    command: string,
    commandFunction: ServiceCommandAction<any>,
  ) => Promise<void>
  execCommand: () => Promise<any>
  getCommandAction: (command: string) => ServiceCommandAction<any>
}
