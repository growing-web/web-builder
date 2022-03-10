import { defineCommand } from '../define'
import { fs } from '@growing-web/web-builder-kit'

export default defineCommand({
  meta: {
    command: `unlink [dir]`,
    usage: 'Create soft link.',
    options: [],
  },
  action: async (dir: string) => {
    await fs.unlink(dir)
  },
})
