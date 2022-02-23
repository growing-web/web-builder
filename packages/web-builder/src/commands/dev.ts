import type { WebBuilderDevArg } from '@growing-web/web-builder-types'
import { defineCommand } from '../define'
import { dev } from '../actions'

export default defineCommand({
  meta: {
    command: `dev [rootDir]`,
    usage: 'project dev server command.',
    options: [
      {
        rawName: '--open',
        description: 'open browser on server start.',
      },
      {
        rawName: '--mkcert',
        description: 'create a cert certificate on server start.',
      },
      {
        rawName: '--https',
        description: 'specify whether to enable https.',
      },
      {
        rawName: '--mode [string]',
        description: 'specify env mode.',
        default: 'development',
      },
    ],
  },
  action: async (rootDir: string, commandArgs: WebBuilderDevArg) => {
    await dev(rootDir, commandArgs)
  },
})
