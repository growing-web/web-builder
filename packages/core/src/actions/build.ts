import { loadBundler } from '../loader/bundler'
import { loadWebBuilder } from '../web-builder'

export async function build(rootDir: string) {
  const webBuilder = await loadWebBuilder({ rootDir })
  const { build } = await loadBundler(webBuilder)
  await build()
  return webBuilder
}
