import type { Hookable } from 'hookable'
import type { WebBuilderHook } from './hook'
import type { RollupOutput, RollupWatcher } from 'rollup'
import type { BasicService } from './service'

export type WebBuilderFormat = 'cjs' | 'umd' | 'esm' | 'system' | 'iife'
export type WebBuilderTarget = 'app' | 'lib'
export type WebBuilderMode = 'development' | 'production' | string
export type WebBuilderCommand = 'build' | 'dev'

export interface WebBuilder {
  _version: string

  options: WebBuilderOptions
  hooks: Hookable<WebBuilderHook>
  hook: WebBuilder['hooks']['hook']
  callHook: WebBuilder['hooks']['callHook']
  addHooks: WebBuilder['hooks']['addHooks']

  ready: () => Promise<void>
  close: () => Promise<void>

  service: BasicService
}

/**
 * web-builder stats
 */
export interface WebBuilderStats {
  build?: {
    /**
     * start build time
     */
    startTime?: number

    /**
     * end build time
     */
    endTime?: number

    /**
     * time consuming to build
     */

    time?: number

    /**
     * build product information
     */
    stats?: (RollupOutput | RollupOutput[] | RollupWatcher)[]

    /**
     * error message
     */
    error?: Error | null
  }
}

export interface WebBuilderOptions {
  /**
   * your project root directory
   */
  rootDir?: string
}

export interface LoadWebBuilderOptions {
  /**
   *  Whether the webBuilder has been initialized
   */
  ready?: boolean

  /**
   * current environment
   */
  mode?: WebBuilderMode

  /**
   * service
   */
  service: BasicService
}
