import type { ManifestConfig, UserConfig } from './config'
import type { BundlerType } from './bundler'
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
  manifest?: ManifestConfig
  mode?: WebBuilderMode
  bundlerType: BundlerType
  userConfig?: UserConfig
  execStat?: WebBuilderStats

  prepare: () => Promise<void>
  resolveManifest: () => Promise<void>
  resolveUserConfig: () => Promise<void>
  registerCommand: (
    command: string,
    commandFunction: ServiceCommandAction<any>,
  ) => Promise<void>
  execCommand: () => Promise<any>
  getCommandAction: (command: string) => ServiceCommandAction<any>
}
