import type { WebBuilderDevArg } from '@growing-web/web-builder-types'
import path from 'pathe'
import { WebBuilderService } from '@growing-web/web-builder-core'

export async function dev(rootDir: string, commandArgs: WebBuilderDevArg) {
  process.env.NODE_ENV ||= 'development'
  rootDir = path.resolve(rootDir || '.')

  const webBuilderService = new WebBuilderService({
    command: 'dev',
    commandArgs,
    rootDir,
  })

  await webBuilderService.execCommand()
}
