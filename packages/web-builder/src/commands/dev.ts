import type { WebBuilderDevArg } from '@growing-web/web-builder-types'
import { defineWebBuilderCommand } from '../utils/define'
import { dev } from '@growing-web/web-builder-core'
import path from 'pathe'
// import { WEB_BUILDER_HOOK } from '@growing-web/web-builder-constants'

export default defineWebBuilderCommand({
  meta: {
    command: 'dev [rootDir]',
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
  action: async (rootDir: string, args: WebBuilderDevArg) => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development'
    rootDir = path.resolve(rootDir || '.')
    await dev(rootDir, args)
  },
})
