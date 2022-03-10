import type { WebBuilder, PluginInstance } from '@growing-web/web-builder-types'
import rollupReplace from '@rollup/plugin-replace'
import type { DevServerConfig } from '@web/dev-server'
import { createLogger, path, fs } from '@growing-web/web-builder-kit'
import { fromRollup } from '@web/dev-server-rollup'

export async function createDevConfig(webBuilder: WebBuilder) {
  const logger = createLogger()
  if (!webBuilder.service) {
    logger.error('failed to initialize service.')
    process.exit(1)
  }

  const replace = fromRollup(rollupReplace)

  const { rootDir = path.resolve('.'), config } = webBuilder.service

  if (!config) {
    return []
  }

  const {
    watch,
    pluginInstance = [],
    clearScreen,
    entries = [],
    server: { port, open, https, host } = {},
  } = config

  const devServerConfigList: DevServerConfig[] = []

  for (const entry of entries) {
    // const { publicPath = '/' } = entry

    const conf: DevServerConfig = {
      port: port,
      open,
      rootDir,
      clearTerminalOnReload: clearScreen,
      nodeResolve: true,
      //   basePath: publicPath,
      http2: https,
      hostname: host,
      appIndex: entry.input,
      watch,
      plugins: [
        replace({
          include: [path.resolve(rootDir, '/**/*.{js,ts,tsx,jsx}')],
          preventAssignment: true,
          values: {
            'process.env.NODE_ENV': JSON.stringify('development'),
          },
        }),
        ...((pluginInstance as PluginInstance).webDevServer as any),
      ],
    }

    devServerConfigList.push(conf)
  }

  return devServerConfigList
}
