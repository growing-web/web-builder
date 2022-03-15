import type { ServerCLIOptions } from '@growing-web/web-builder-types'

export async function dev(rootDir: string, commandArgs: ServerCLIOptions) {
  process.env.NODE_ENV ||= 'development'

  const [{ WebBuilderService }, { path }] = await Promise.all([
    import('@growing-web/web-builder-core'),
    import('@growing-web/web-builder-kit'),
  ])

  const webBuilderService = new WebBuilderService({
    command: 'dev',
    commandArgs,
    rootDir: path.resolve(rootDir || '.'),
  })

  await webBuilderService.execCommand()
}
