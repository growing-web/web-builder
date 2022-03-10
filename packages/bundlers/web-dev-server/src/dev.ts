import type { WebBuilder } from '@growing-web/web-builder-types'
import { startDevServer } from '@web/dev-server'
import { createDevConfig } from './config'
import { bundlerWebSite } from './webSite'

export function devBundler(webBuilder: WebBuilder) {
  return async () => {
    const configs = await createDevConfig(webBuilder)
    const config = configs[0]

    await bundlerWebSite(webBuilder)

    await startDevServer({
      autoExitProcess: true,
      readCliArgs: false,
      readFileConfig: false,
      config: config,
    })
  }
}
