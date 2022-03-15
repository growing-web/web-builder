import type { BuildCLIOptions } from '@growing-web/web-builder-types'
import { defineCommand } from '../define'
import { build } from '../actions'

export default defineCommand({
  meta: {
    command: 'build [rootDir]',
    usage: 'project build command.',
    options: [
      {
        rawName: '--mode [string]',
        description: 'specify env mode.',
        default: 'production',
      },
      {
        rawName: '--no-clean',
        description:
          'do not remove the dist directory before building the project.',
      },
      {
        rawName: '--report',
        description: 'generate report.html to help analyze bundle content.',
      },
      {
        rawName: '--report-json',
        description: 'generate report.json to help analyze bundle content.',
      },
      {
        rawName: '--sourcemap',
        description: 'generate sourcemap after building project.',
      },
      {
        rawName: '--watch',
        description: 'watch for changes.',
      },
    ],
  },
  action: async (rootDir: string, commandArgs: BuildCLIOptions) => {
    await build(rootDir, commandArgs)
  },
})
