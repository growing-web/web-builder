import type {
  WebBuilder,
  WebBuilderStats,
} from '@growing-web/web-builder-types'
import { createConfig } from './create-config'
import { build } from 'vite'

export function buildBundler(webBuilder: WebBuilder) {
  return async () => {
    const startTime = +new Date()

    const buildStats: WebBuilderStats['build'] = {
      time: 0,
      startTime,
    }

    const config = await createConfig(webBuilder)

    try {
      const stats = await build(config)
      buildStats.stats = stats
      buildStats.endTime = +new Date()
      buildStats.time = +new Date() - startTime
    } catch (error: any) {
      buildStats.error = error
      throw error
    } finally {
      webBuilder.stats ||= { build: {} }
      webBuilder.stats.build = buildStats
    }
    return webBuilder.stats
  }
}
