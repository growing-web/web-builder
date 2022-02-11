import type { AnyFunction } from './tool'

export type WebBuilderFormat = 'cjs' | 'esm' | 'system' | 'iife'

export type WebBuilderMode = 'development' | 'production' | string

export interface DefineWebBuilderCommand {
  /**
   * Command meta information
   */
  meta: WebBuilderCommandMeta
  /**
   * command action
   */
  action: AnyFunction
}

export interface WebBuilderCommandMeta {
  /**
   * command string
   */
  command: string
  /**
   * Command usage description
   */
  usage: string
  options: {
    /**
     * extra parameter directive
     * @example '--mode [string]'
     */
    rawName: string
    description: string
    default?: any
    type?: any[]
  }[]
}

export interface WebBuilderStartOptions {
  open?: boolean
  https?: boolean
  mkcert?: boolean
  mode?: WebBuilderMode
}

export interface WebBuilderBuildOptions {
  mode?: WebBuilderMode
  clean?: boolean
  report?: boolean
  reportJson?: boolean
  sourcemap?: boolean
  watch?: boolean
}
