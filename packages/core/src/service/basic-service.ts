import type {
  Recordable,
  WebBuilder,
  Nullable,
  WenBuilderServiceOptions,
  ServiceCommandActions,
  ServiceCommandAction,
} from '@growing-web/web-builder-types'
import { loadWebBuilder } from '../web-builder'
import { logger } from '@growing-web/web-builder-toolkit'

class BasicService {
  protected webBuilder: Nullable<WebBuilder> = null
  private command: Nullable<string> = null
  private rootDir: string = process.cwd()
  private commandArgs: Recordable<any> = {}
  private commandActions: ServiceCommandActions = {}

  constructor({ command, commandArgs, rootDir }: WenBuilderServiceOptions) {
    this.command = command
    this.commandArgs = commandArgs
    this.rootDir = rootDir
  }

  private async initWebBuilder() {
    this.webBuilder = await loadWebBuilder({ rootDir: this.rootDir }, {})
  }

  public async registerCommand(
    command: string,
    commandFunction: ServiceCommandAction<any>,
  ) {
    if (this.commandActions[command]) {
      logger.warn(`command ${command} already been registered`)
    }
    this.commandActions[command] = commandFunction
  }

  public getCommandAction(command: string): ServiceCommandAction<any> {
    if (this.commandActions[command]) {
      return this.commandActions[command]
    } else {
      throw new Error(`command ${command} is not support`)
    }
  }

  public async execCommand() {
    await this.initWebBuilder()
    const { command } = this

    if (command && this.webBuilder) {
      return await this.getCommandAction(command)(this.webBuilder)
    }
  }
}

export { BasicService }
