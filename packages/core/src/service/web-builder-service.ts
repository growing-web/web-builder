import type {
  WenBuilderServiceOptions,
  WebBuilderCommand,
} from '@growing-web/web-builder-types'
import { BasicService } from './basic-service'
import { loadBundler } from '../loader/bundler'

class WebBuilderService extends BasicService {
  constructor(props: WenBuilderServiceOptions) {
    super(props)
    super.registerCommand('dev', async () => await this.runCommand('dev'))
    super.registerCommand('build', async () => await this.runCommand('build'))
  }

  private async runCommand(action: WebBuilderCommand) {
    if (this.webBuilder) {
      const bundler = await loadBundler(this.webBuilder)
      return await bundler[action]()
    }
  }
}

export { WebBuilderService }
