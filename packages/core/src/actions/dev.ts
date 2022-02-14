import { loadBundler } from '../loader/bundler'
import { loadWebBuilder } from '../web-builder'

export async function dev(rootDir: string) {
  const webBuilder = await loadWebBuilder({ rootDir })
  const { dev } = await loadBundler(webBuilder)

  await dev()
  return webBuilder
}
