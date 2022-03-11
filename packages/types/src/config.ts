import type { WebBuilderMode, WebBuilderFormat } from './web-builder'
import type { PluginInstance, PluginOptions } from './plugin'
import type { LogLevel } from './logger'
import type { BundlerType } from './bundler'

/**
 * Supported build output manifest formats
 */
export type ManifestOutputType = 'exports-manifest' | 'web-weight-manifest'

export interface WebBuilderConfig extends ManifestConfig, UserConfig {
  server?: UserConfig['server'] & ManifestConfig['server']

  pluginInstance?: PluginInstance
}

export interface WebBuilderInlineConfig extends WebBuilderConfig {
  configFile?: string | false
  envFile?: false
}

export interface UserConfig {
  /**
   * builderType
   * @default vite
   */
  bundlerType?: BundlerType

  root?: string

  /**
   * watch for changes.
   * @default false
   */
  watch?: boolean

  /**
   * Explicitly set a mode to run in. This will override the default mode for
   * each command, and can be overridden by the command line --mode option.
   */
  mode?: string

  /**
   * Directory to save cache files. Files in this directory are pre-bundled
   * @default 'node_modules/.web-builder'
   */
  cacheDir?: string

  /**
   * Define global variable replacements.
   * Entries will be defined on `window` during dev and replaced during build.
   */
  define?: Record<string, any>

  /**
   * Log level.
   * Default: 'info'
   */
  logLevel?: LogLevel

  /**
   * @default true
   */
  clearScreen?: boolean

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
  plugins?: PluginOptions[]
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
  manifests?: ManifestOutputType[]

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
export interface ManifestConfigEntry {
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
     * entry name
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
    assetFileNames?: string

    /**
     * js chunk file output format
     */
    chunkFileNames?: string

    /**
     * Entry file output format
     */
    entryFileNames?: string

    /**
     * output file format
     */
    formats?: WebBuilderFormat[]

    /**
     * whether to output sourcemap
     * @default false
     */
    sourcemap?: boolean

    meta?: {
      // umd global variable name
      umdName?: string
    }

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
    regular: string

    /**
     * replaced value
     */
    replacement: string
  }[]
}
