import type {
  WebBuilder,
  DevServerPlugin,
} from '@growing-web/web-builder-types'
import type { DevServerConfig } from '@web/dev-server'
import { createLogger, path, fs } from '@growing-web/web-builder-kit'
import { fromRollup } from '@web/dev-server-rollup'

export async function createConfig(webBuilder: WebBuilder) {
  const logger = createLogger()
  if (!webBuilder.service) {
    logger.error('failed to initialize service.')
    process.exit(1)
  }

  const { rootDir = path.resolve('.'), config } = webBuilder.service

  if (!config) {
    return []
  }

  const {
    watch,
    pluginInstances = [],
    clearScreen,
    entries = [],
    server: { port, open, https, host } = {},
    build: { clean } = {},
  } = config

  const devServerConfigList: DevServerConfig[] = []

  let emptied = false

  for (const entry of entries) {
    const { output = {}, publicPath = '/' } = entry
    const { dir = 'dist' } = output

    let outputDir = dir

    if (clean && !emptied) {
      fs.emptyDirSync(outputDir)
      emptied = true
    }

    const conf: DevServerConfig = {
      port: port,
      open,
      rootDir,
      clearTerminalOnReload: clearScreen,
      nodeResolve: true,
      basePath: publicPath,
      http2: https,
      hostname: host,
      appIndex: entry.input,
      watch,
      plugins: pluginInstances as DevServerPlugin[],
    }

    devServerConfigList.push(conf)
  }

  return devServerConfigList
}
