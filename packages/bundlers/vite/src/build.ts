import type {
  WebBuilder,
  WebBuilderStats,
} from '@growing-web/web-builder-types'
import { createConfig } from './config'
import { build } from 'vite'

export function buildBundler(webBuilder: WebBuilder) {
  return async () => {
    const startTime = +new Date()

    const buildStats: WebBuilderStats['build'] = {
      time: 0,
      startTime,
    }

    const configs = await createConfig(webBuilder)

    try {
      const stats = await Promise.all(configs.map((item) => build(item)))
      // TODO multiple stats
      buildStats.stats = stats[0] as any

      buildStats.endTime = +new Date()
      buildStats.time = +new Date() - startTime
    } catch (error: any) {
      buildStats.error = error
      throw error
    } finally {
      webBuilder.service.execStat ||= { build: buildStats }
    }
    return webBuilder.service.execStat
  }
}
