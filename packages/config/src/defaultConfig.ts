import type {
  WebBuilderConfig,
  ManifestConfig,
} from '@growing-web/web-builder-types'

import {
  DEFAULT_PORT,
  DEFAULT_SCHEMA_VERSION,
  DEFAULT_ENTRY_FILE,
} from '@growing-web/web-builder-constants'
export function createBuilderDefaultConfig(): WebBuilderConfig {
  return {
    bundlerType: 'vite',
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    entries: [],
    watch: false,
    server: {
      open: false,
      https: false,
      mkcert: true,
      port: DEFAULT_PORT,
      host: 'localhost',
    },
    build: {
      clean: true,
      report: false,
      reportJson: false,
    },
    plugins: [],
  }
}

export function createManifestDefaultConfig(): ManifestConfig {
  return {
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    entries: [
      {
        input: DEFAULT_ENTRY_FILE,
      },
    ],
    server: {
      port: DEFAULT_PORT,
    },
  }
}
