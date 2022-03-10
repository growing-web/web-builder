import type { Symlink } from '@growing-web/web-builder-types'
import { defineCommand } from '../define'
import { link } from '../actions'

export default defineCommand({
  meta: {
    command: `link [src] [target]`,
    usage: 'Create soft link.',
    options: [
      {
        rawName: '--type',
        description: 'soft link type, optional file | dir | junction.',
        default: 'dir',
      },
    ],
  },
  action: async (src: string, target: string, { type }: { type: Symlink }) => {
    await link(src, target, { type })
  },
})
