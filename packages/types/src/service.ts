import type { Recordable } from './tool'
import type { WebBuilder, WebBuilderCommand } from './web-builder'

export interface WenBuilderServiceOptions {
  command: WebBuilderCommand
  commandArgs: Recordable<any>
  rootDir: string
}

export type ServiceCommandAction<T> = (webBuilder: WebBuilder) => Promise<T>

export interface ServiceCommandActions<T = any> {
  [command: string]: ServiceCommandAction<T>
}
