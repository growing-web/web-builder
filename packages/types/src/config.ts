import type { WebBuilderMode, WebBuilderFormat } from './web-builder'

/**
 * Supported build output manifest formats
 */
export type ManifestOutputType = 'exports' | 'web-weight'

export interface WebBuilderConfig extends ManifestConfig {
  server: UserConfig['server'] & ManifestConfig['server']
}

export interface UserConfig {
  /**
   * watch for changes.
   * @default false
   */
  watch?: boolean

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
}

export interface ManifestConfig {
  /**
   * The address of the schema.json file corresponding to the manifest
   */
  $schema?: string

  /**
   * manifest version number
   */
  schemaVersion: string

  /**
   * Build output manifests, which can support manifest file formats in different formats
   */
  manifests?: boolean | ManifestOutputType[]

  /**
   * Application entry configuration
   */
  entries: ManifestConfigEntry[]

  /**
   * Development server configuration
   */
  server?: ManifestConfigServer
}

/**
 * Application entry configuration
 */
interface ManifestConfigEntry {
  /**
   * entry file path
   */
  input: string

  /**
   * Build tools publicPath configuration
   * @default /
   */
  publicPath?: string

  /**
   * Export configuration
   */
  output?: {
    /**
     * global variable name
     */
    name?: string

    /**
     * shared dependencies
     */
    externals?: string[]

    /**
     * Build product output directory
     * @default dist
     */
    dir?: string

    /**
     * Resource file output format
     */
    assetFileName?: string

    /**
     * js chunk file output format
     */
    chunkFileName?: string

    /**
     * Entry file output format
     */
    entryFileName?: string

    /**
     * output file format
     */
    formats?: WebBuilderFormat[]

    /**
     * whether to output sourcemap
     * @default false
     */
    sourcemap?: boolean

    /**
     * Whether to output type definition file
     * @default false
     */
    declaration?: boolean

    /**
     * global variable definition
     */
    globals?: Record<string, string>

    /**
     * Output product meta information
     */
    banner?: {
      /**
       * header injection information
       */
      header?: string

      /**
       * Inject information at the bottom
       */
      footer?: string
    }
  }
}

/**
 * Development server configuration
 */
interface ManifestConfigServer {
  /**
   * The port number
   * @default 5500
   */
  port?: number

  /**
   * local development address
   */
  host?: string

  /**
   * Development server proxy configuration
   */
  proxy?: ManifestServerProxy[]
}

export type ManifestServerProxy = {
  /**
   * proxy matching url
   */
  url: string

  /**
   * url The destination address of the proxy
   */
  target: string

  /**
   * support https
   * @default false
   */
  secure?: boolean

  /**
   * Make target support domain names
   * @default true
   */
  changeOrigin?: boolean

  /**
   * path rewrite
   */
  pathRewrite?: {
    /**
     * regular string
     */
    regular: RegExp | string

    /**
     * replaced value
     */
    replacement: string
  }[]
}
