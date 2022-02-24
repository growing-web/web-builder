import type { WebBuilderBuildArg } from '@growing-web/web-builder-types'
import { WebBuilderService } from '@growing-web/web-builder-core'
import { useWebBuilder, logger, path } from '@growing-web/web-builder-toolkit'
import { WEB_BUILDER_HOOK } from '@growing-web/web-builder-constants'

export async function build(rootDir: string, commandArgs: WebBuilderBuildArg) {
  process.env.NODE_ENV ||= 'production'
  rootDir = path.resolve(rootDir || '.')

  const webBuilderService = new WebBuilderService({
    command: 'build',
    commandArgs,
    rootDir,
  })

  await webBuilderService.execCommand()

  const webBuilder = useWebBuilder()

  webBuilder.hook(WEB_BUILDER_HOOK.BUILD_ERROR, (error) => {
    logger.error(`Build Error:`, error)
    process.exit(1)
  })
}
