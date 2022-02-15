import type { AnyFunction } from './tool'
import type { WebBuilderMode } from './web-builder'

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

export interface WebBuilderDevArg {
  open?: boolean
  https?: boolean
  mkcert?: boolean
  mode?: WebBuilderMode
}

export interface WebBuilderBuildArg {
  mode?: WebBuilderMode
  clean?: boolean
  report?: boolean
  reportJson?: boolean
  sourcemap?: boolean
  watch?: boolean
}
