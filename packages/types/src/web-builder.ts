import type { Hookable } from 'hookable'
import type { WebBuilderHook } from './hook'
import type { WebBuilderManifest } from './manifest'

export type WebBuilderFormat = 'cjs' | 'esm' | 'system' | 'iife'

export type WebBuilderMode = 'development' | 'production' | string

export interface WebBuilder {
  _version: string

  options: WebBuilderOptions
  hooks: Hookable<WebBuilderHook>
  hook: WebBuilder['hooks']['hook']
  callHook: WebBuilder['hooks']['callHook']
  addHooks: WebBuilder['hooks']['addHooks']

  ready: () => Promise<void>
  close: () => Promise<void>
}

export interface WebBuilderOptions {
  manifest?: WebBuilderManifest
}

export interface LoadWebBuilderOptions {
  /**
   * your project root directory
   */
  rootDir: string
  /**
   *  Whether the webBuilder has been initialized
   */
  ready?: boolean

  /**
   * current environment
   */
  mode?: WebBuilderMode
}
