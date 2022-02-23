import type { WebBuilder } from '@growing-web/web-builder-types'
import { createConfig } from './create-config'
import { createServer } from 'vite'

export function devBundler(webBuilder: WebBuilder) {
  return async () => {
    const config = await createConfig(webBuilder)
    const server = await createServer(config)
    await server.listen()
    server.printUrls()
    return server
  }
}
