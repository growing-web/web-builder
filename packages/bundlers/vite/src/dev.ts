import type { WebBuilder } from '@growing-web/web-builder-types'
import { createConfig } from './config'
import { createServer } from 'vite'

export function devBundler(webBuilder: WebBuilder) {
  return async () => {
    const configs = await createConfig(webBuilder)
    const ret = configs[0]
    const server = await createServer(ret)

    await server.listen()
    server.printUrls()
    return server
  }
}
