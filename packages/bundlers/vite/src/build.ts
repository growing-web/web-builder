import type {
  WebBuilder,
  WebBuilderStats,
} from '@growing-web/web-builder-types'
import { createBuildLibConfig, createConfig } from './config'
import { build, mergeConfig } from 'vite'

export function buildBundler(webBuilder: WebBuilder) {
  return async () => {
    const startTime = +new Date()

    const buildStats: WebBuilderStats['build'] = {
      time: 0,
      startTime,
    }

    const config = await createConfig(webBuilder)

    // support multiple entry build
    const libConfigs = await createBuildLibConfig(webBuilder)
    const configs: any[] = []
    if (libConfigs.length === 0) {
      configs.push(config)
    } else {
      libConfigs.forEach((conf) => {
        configs.push(mergeConfig(config, conf))
      })
    }

    try {
      const stats = await Promise.all(configs.map((c) => build(c)))
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
