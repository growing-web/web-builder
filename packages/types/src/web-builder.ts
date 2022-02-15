import type { Hookable } from 'hookable'
import type { BundlerType } from './bundler'
import type { UserConfig } from './config'
import type { WebBuilderHook } from './hook'
import type { WebBuilderManifest } from './manifest'

export type WebBuilderFormat = 'cjs' | 'umd' | 'esm' | 'system' | 'iife'

export type WebBuilderTarget = 'app' | 'lib'

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
  /**
   * your project root directory
   */
  rootDir?: string

  /**
   * builder type
   * @default vite
   */
  bundlerType?: BundlerType

  /**
   * current environment
   */
  mode?: WebBuilderMode

  /**
   * User configuration in profile
   */
  userConfig?: UserConfig

  /**
   * `project-manifest.json` manifest configuration content
   */
  manifest?: Partial<WebBuilderManifest>
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
