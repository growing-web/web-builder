import type {
  WebBuilderBuildArg,
  UserConfig,
} from '@growing-web/web-builder-types'
import { loadBundler } from '../loader/bundler'
import { loadWebBuilder } from '../web-builder'

export async function build(rootDir: string, args: WebBuilderBuildArg) {
  const { report, reportJson, sourcemap, watch, clean } = args
  const processConfig: UserConfig = {
    build: {
      report,
      reportJson,
      sourcemap,
      watch,
      clean,
    },
  }

  const webBuilder = await loadWebBuilder({ rootDir }, processConfig)
  const { build } = await loadBundler(webBuilder)
  await build()
  return webBuilder
}
