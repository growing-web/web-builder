import type {
  WebBuilderManifest,
  WebBuilder,
} from '@growing-web/web-builder-types'
import merge from 'defu'
import { UserConfig } from '../../types/src/config'

export function mergeManifest(
  webBuilder: WebBuilder,
  manifest: WebBuilderManifest,
) {
  const defaultManifest: Partial<WebBuilderManifest> = {
    target: 'app',
    formats: [],
    server: {
      port: 5500,
      host: true,
      proxy: [],
    },
  }

  webBuilder.options.manifest = merge(manifest, defaultManifest)
}

export function mergeUserConfig(
  webBuilder: WebBuilder,
  userConfig: UserConfig,
  processConfig: UserConfig,
) {
  webBuilder.options.userConfig ||= {}

  const defaultUserConfig: Partial<UserConfig> = {
    server: {
      open: false,
      https: false,
      mkcert: true,
    },
    build: {
      clean: true,
      report: false,
      reportJson: false,
      sourcemap: false,
      watch: false,
    },
  }

  webBuilder.options.userConfig = merge(
    webBuilder.options.userConfig,
    processConfig,
    userConfig,
    defaultUserConfig,
  )
}
