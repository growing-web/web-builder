import type {
  GetBundlerConfigOptions,
  WebBuilderStartOptions,
  WebBuilderBuildOptions,
} from '@growing-web/web-builder-types'
import type { ViteDevServer } from 'vite'
import { AbstractAdapter } from './abstract-adapter'

export abstract class AbstractBundler {
  abstract start(options: WebBuilderStartOptions): Promise<ViteDevServer>

  abstract build(options: WebBuilderBuildOptions): Promise<void>
}

export abstract class AbstractConfigBundler<
  T extends AbstractAdapter<R>,
  R,
> extends AbstractBundler {
  adapter: T | null = null
  constructor(_adapter: T) {
    super()
    this.adapter = _adapter
  }

  abstract getConfig(options: GetBundlerConfigOptions): Promise<R | undefined>

  abstract start(options: WebBuilderStartOptions): Promise<ViteDevServer>

  abstract build(options: WebBuilderBuildOptions): Promise<void>
}
