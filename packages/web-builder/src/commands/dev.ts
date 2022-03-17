import type { ServerCLIOptions } from '@growing-web/web-builder-types'
import { defineCommand } from '../define'
import { dev } from '../actions'

export default defineCommand({
  meta: {
    command: `dev [rootDir]`,
    usage: 'Run web-builder development server.',
    options: [
      {
        rawName: '--open',
        description: 'open browser on server start.',
      },
      {
        rawName: '--https',
        description: 'specify whether to enable https.',
      },
      {
        rawName: '--strict-port',
        description:
          'When set to true, if the port is already in use, exit without making subsequent port attempts.',
        default: false,
      },
      {
        rawName: '--mode [string]',
        description: 'specify env mode.',
        default: 'development',
      },
    ],
  },
  action: async (rootDir: string, commandArgs: ServerCLIOptions) => {
    await dev(rootDir, commandArgs)
  },
})
