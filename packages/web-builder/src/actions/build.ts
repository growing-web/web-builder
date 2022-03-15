import type { BuildCLIOptions } from '@growing-web/web-builder-types'
import { WEB_BUILDER_HOOK } from '@growing-web/web-builder-constants'

export async function build(rootDir: string, commandArgs: BuildCLIOptions) {
  process.env.NODE_ENV ||= 'production'

  const [{ WebBuilderService }, { useWebBuilder, createLogger, path }] =
    await Promise.all([
      import('@growing-web/web-builder-core'),
      import('@growing-web/web-builder-kit'),
    ])

  const logger = createLogger()

  const webBuilderService = new WebBuilderService({
    command: 'build',
    commandArgs,
    rootDir: path.resolve(rootDir || '.'),
  })

  await webBuilderService.execCommand()

  const webBuilder = useWebBuilder()

  webBuilder.hook(WEB_BUILDER_HOOK.BUILD_ERROR, (error) => {
    logger.error(`Build Error: ${error?.toString()}`)
    process.exit(1)
  })
}
