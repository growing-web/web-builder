import type { WebBuilderBuildArg } from '@growing-web/web-builder-types'
import { defineWebBuilderCommand } from '../utils/define'
import { build } from '../actions'

export default defineWebBuilderCommand({
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
  action: async (rootDir: string, commandArgs: WebBuilderBuildArg) => {
    await build(rootDir, commandArgs)
  },
})
