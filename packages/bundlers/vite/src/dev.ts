import type { WebBuilder } from '@growing-web/web-builder-types'
import { createConfig } from './config'
import { createServer } from 'vite'
import { isString, persistencePort } from '@growing-web/web-builder-kit'

export function devBundler(webBuilder: WebBuilder) {
  return async () => {
    const configs = await createConfig(webBuilder, 'dev')

    // TODO support multiple entry dev server
    const ret = configs[0]
    const server = await createServer(ret)
    await server.listen()

    // Record the actual port number of the program, which is convenient for use by importmap
    const address = server.httpServer?.address()
    if (address && !isString(address)) {
      const { port } = address
      await persistencePort(port)
    }
    server.printUrls()
    return server
  }
}
