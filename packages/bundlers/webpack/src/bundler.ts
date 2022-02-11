import type { InlineConfig, PluginOption } from 'vite'
import type {
  WebBuilderBuildOptions,
  WebBuilderStartOptions,
  GetBundlerConfigOptions,
} from '@growing-web/web-builder-types'
import {
  parsePreset,
  transformPresetToConfig,
} from '@growing-web/web-builder-toolkit'
import { AbstractConfigBundler } from '@growing-web/web-builder-bundler-abstract'
import { ViteAdapter } from './config-adapter'
import { createServer, mergeConfig, build } from 'vite'
import visualizer from 'rollup-plugin-visualizer'
import viteMkCert from 'vite-plugin-mkcert'

export class ViteBundler extends AbstractConfigBundler<
  ViteAdapter,
  InlineConfig
> {
  constructor() {
    super(new ViteAdapter())
  }

  /**
   * Get launcher configuration
   * @param bundlerType
   * @param preset
   * @returns
   */
  public async getConfig({
    bundlerType = 'vite',
    preset,
    mode = 'production',
  }: GetBundlerConfigOptions) {
    let config = await this.adapter?.configAdapter(mode)
    const _preset = preset || (await parsePreset())
    if (_preset) {
      const presetConfig = await transformPresetToConfig(
        _preset,
        bundlerType,
        mergeConfig,
      )
      config = mergeConfig(config as any, presetConfig)
    }
    return config
  }

  /**
   * 启动应用
   * @param param0
   * @returns
   */
  async start({ mode, open, mkcert, https }: WebBuilderStartOptions = {}) {
    let config = await this.getConfig({ mode })

    const plugins: PluginOption[] = []

    if (mkcert) {
      plugins.push(viteMkCert())
    }

    config = mergeConfig(config || {}, {
      server: {
        open,
        https,
      },
      plugins,
    } as InlineConfig)

    if (mkcert) {
      config.server ||= {}
      config.server.https = true
    }

    const server = await createServer(config)
    await server.listen()
    server.printUrls()
    return server
  }

  /**
   * build app
   * @param param0
   */
  async build({
    mode,
    clean,
    report,
    reportJson,
    sourcemap,
    watch,
  }: WebBuilderBuildOptions = {}) {
    let config = await this.getConfig({ mode })

    const plugins: PluginOption[] = []

    // 分析插件
    if (report || reportJson) {
      plugins.push(
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          json: reportJson,
          filename: `report.${reportJson ? 'json' : 'html'}`,
        }) as PluginOption,
      )
    }
    config = mergeConfig(config || {}, {
      build: {
        emptyOutDir: clean,
        sourcemap: sourcemap,
        watch,
      },
      plugins,
    } as InlineConfig)

    await build(config)
  }
}
