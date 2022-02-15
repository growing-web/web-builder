import type { WebBuilderMode } from './web-builder'
import type { BundlerType } from './bundler'

export interface UserConfig {
  server?: {
    /**
     * open browser on server start
     * @default false
     */
    open?: boolean

    /**
     * specify whether to enable https
     * @default false
     */
    https?: boolean

    /**
     * create a cert certificate on server start
     * takes effect when https=true
     * @default true
     */
    mkcert?: boolean
  }

  build?: {
    /**
     * remove the dist directory before building the project
     * @default true
     */
    clean?: boolean

    /**
     * generate report.html to help analyze bundle content.
     * @default false
     */
    report?: boolean

    /**
     * generate report.json to help analyze bundle content.
     * @default false
     */
    reportJson?: boolean

    /**
     * generate sourcemap after building project.
     * @default false
     */
    sourcemap?: boolean

    /**
     * watch for changes.
     * @default false
     */
    watch?: boolean
  }

  /**
   * user plugins
   */
  plugins?: Plugins[]
}

export interface Plugins {
  __: unknown
}

export interface UserConfigExport {
  /**
   * environment
   */
  mode: WebBuilderMode
  /**
   * builder type
   */
  bundlerType: BundlerType
}
