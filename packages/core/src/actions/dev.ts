import type {
  WebBuilderDevArg,
  UserConfig,
} from '@growing-web/web-builder-types'
import { loadBundler } from '../loader/bundler'
import { loadWebBuilder } from '../web-builder'

export async function dev(rootDir: string, args: WebBuilderDevArg) {
  const { mkcert, open, https } = args
  const processConfig: UserConfig = {
    server: {
      mkcert,
      open,
      https,
    },
  }

  const webBuilder = await loadWebBuilder({ rootDir }, processConfig)
  const { dev } = await loadBundler(webBuilder)

  await dev()
  return webBuilder
}
