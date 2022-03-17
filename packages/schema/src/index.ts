import json from '../index.json'
export type Format = 'cjs' | 'umd' | 'esm' | 'system' | 'iife'

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
    formats?: Format[]

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

export default json
