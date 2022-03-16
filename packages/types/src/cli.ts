import type { AnyFunction } from './tool'
import type { WebBuilderMode } from './web-builder'

export type Symlink = 'file' | 'dir' | 'junction'

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

export interface ServerCLIOptions {
  open?: boolean
  https?: boolean
  strictPort?: boolean
  mode?: WebBuilderMode
}

export interface BuildCLIOptions {
  mode?: WebBuilderMode
  clean?: boolean
  report?: boolean
  reportJson?: boolean
  sourcemap?: boolean
  watch?: boolean
}
