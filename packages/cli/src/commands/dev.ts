import type { WebBuilderStartOptions } from '@growing-web/web-builder-types'
import { defineWebBuilderCommand } from '../utils/define'
import { getBundler } from '../get-bundler'

export default defineWebBuilderCommand({
  meta: {
    command: 'dev',
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
  action: async (options: WebBuilderStartOptions) => {
    const Bundler = await getBundler()
    await new Bundler().start(options)
  },
})
