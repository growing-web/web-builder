import type { Symlink } from '@growing-web/web-builder-types'
import { createSymlink } from '@growing-web/web-builder-kit'

export async function link(
  src: string,
  desc: string,
  { type }: { type: Symlink },
) {
  await createSymlink(src, desc, type)
}
