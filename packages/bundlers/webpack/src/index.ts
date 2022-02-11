import type {
  WebBuilderBuildOptions,
  WebBuilderStartOptions,
} from '@growing-web/web-builder-types'
import { ViteBundler } from './bundler'
import { AbstractBundler } from '@growing-web/web-builder-bundler-abstract'

export class Bundler extends AbstractBundler {
  async start(options: WebBuilderStartOptions) {
    return await new ViteBundler().start(options)
  }

  async build(options: WebBuilderBuildOptions) {
    await new ViteBundler().build(options)
  }
}
