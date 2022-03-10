import type {
  Recordable,
  BundlerType,
  WebBuilder,
  WebBuilderMode,
  WebBuilderStats,
  WebBuilderConfig,
  WebBuilderServiceOptions,
  ServiceCommandActions,
  ServiceCommandAction,
} from '@growing-web/web-builder-types'
import { loadWebBuilder } from '../webBuilder'
import { createLogger, merge, isUndefined } from '@growing-web/web-builder-kit'
import { resolveConfig } from '@growing-web/web-builder-config'

const logger = createLogger()

class BasicService {
  public webBuilder?: WebBuilder
  public command?: 'build' | 'dev'
  public rootDir: string = process.cwd()
  public commandArgs: Recordable<any> = {}
  public commandActions: ServiceCommandActions = {}
  public config?: WebBuilderConfig
  public mode?: WebBuilderMode
  public bundlerType: BundlerType = 'vite'
  public execStat?: WebBuilderStats

  constructor({ command, commandArgs, rootDir }: WebBuilderServiceOptions) {
    this.command = command
    this.commandArgs = commandArgs

    this.rootDir = rootDir
    this.mode = commandArgs.mode || process.env.NODE_ENV
  }

  public async prepare() {
    this.webBuilder = await loadWebBuilder({
      service: this,
    })

    const config = await resolveConfig(
      {
        root: this.rootDir,
        mode: this.mode,
      },
      this.command || 'dev',
      this.command === 'build' ? 'production' : 'development',
    )

    this.config = await this.mergeCommandArg(config)
    this.config.mode = this.mode
    this.config.root = this.rootDir
    this.bundlerType = this.config?.bundlerType ?? 'vite'
  }

  public async mergeCommandArg(config: WebBuilderConfig) {
    let resultConfig = config
    const arg = { ...(this.commandArgs || {}) }
    const commandArg: any =
      this.command === 'dev' ? { server: arg } : { build: arg }
    resultConfig = merge(commandArg, config)

    // common arg
    if (!isUndefined(arg.watch)) {
      resultConfig.watch = arg.watch
    }
    return resultConfig
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
      logger.error(`command ${command} already been registered`)
      process.exit(1)
    }
  }

  public async execCommand() {
    await this.prepare()
    const { command } = this

    if (command && this.webBuilder) {
      return await this.getCommandAction(command)(this.webBuilder)
    }
  }
}

export { BasicService }
