import type {
  Recordable,
  BundlerType,
  WebBuilder,
  WebBuilderMode,
  WebBuilderStats,
  WebBuilderManifest,
  WebBuilderServiceOptions,
  UserConfig,
  ServiceCommandActions,
  ServiceCommandAction,
} from '@growing-web/web-builder-types'
import { loadWebBuilder } from '../web-builder'
import { logger, findWorkspaceRoot } from '@growing-web/web-builder-toolkit'
import { loadManifest, loadUserConfig } from '../loader'
import merge from 'defu'

class BasicService {
  public webBuilder?: WebBuilder
  public command?: string
  public rootDir: string = process.cwd()
  public commandArgs: Recordable<any> = {}
  public commandActions: ServiceCommandActions = {}
  public manifest?: WebBuilderManifest
  public mode?: WebBuilderMode
  public bundlerType: BundlerType = 'vite'
  public userConfig?: UserConfig
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
    await Promise.all([this.resolveManifest(), this.resolveUserConfig()])
  }

  public async resolveManifest() {
    const manifest = await loadManifest(this.mode)

    try {
      let manifestStr = JSON.stringify(manifest)

      const workspaceRoot = await findWorkspaceRoot(this.rootDir)
      const replaceData: Recordable<string> = {
        workspaceRoot: workspaceRoot ?? '',
      }
      manifestStr = manifestStr.replace(/\$\{(\w+)\}/g, (_, $1) => {
        return replaceData[$1]
      })

      this.manifest = JSON.parse(manifestStr)

      return
    } catch (error) {
      this.manifest = manifest
    }

    this.manifest = manifest
  }

  public async resolveUserConfig() {
    const { data: userConfig = {} } = await loadUserConfig(
      this.rootDir,
      this.bundlerType,
      this.mode,
    )

    const defaultUserConfig: Partial<UserConfig> = {
      server: {
        open: false,
        https: false,
        mkcert: true,
      },
      build: {
        clean: true,
        report: false,
        reportJson: false,
        sourcemap: false,
        watch: false,
      },
    }

    const arg = { ...(this.commandArgs || {}) }
    const commandArg: any =
      this.command === 'dev' ? { server: arg } : { build: arg }

    this.userConfig = merge(
      this.userConfig || {},
      commandArg,
      userConfig,
      defaultUserConfig,
    )
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
