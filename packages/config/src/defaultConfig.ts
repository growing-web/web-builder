import type {
  WebBuilderConfig,
  ManifestConfig,
} from '@growing-web/web-builder-types'
import {
  DEFAULT_SERVER_PORT,
  DEFAULT_SCHEMA_VERSION,
  DEFAULT_ENTRY_FILE,
  DEFAULT_OUTPUT_DIR,
  LIB_ENTRIES_EXT,
  DEFAULT_OUTPUT_FORMAT,
} from '@growing-web/web-builder-constants'
import { tryResolvePaths } from '@growing-web/web-builder-kit'

export function createBuilderDefaultConfig(): WebBuilderConfig {
  return {
    bundlerType: 'vite',
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    entries: [],
    watch: false,
    server: {
      open: false,
      https: false,
      port: DEFAULT_SERVER_PORT,
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
  const input = tryResolvePaths(
    LIB_ENTRIES_EXT.map((ext) => {
      return `${DEFAULT_ENTRY_FILE}.${ext}`
    }),
  )

  return {
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    entries: [
      {
        input: input || DEFAULT_ENTRY_FILE,
        output: {
          dir: DEFAULT_OUTPUT_DIR,
          formats: DEFAULT_OUTPUT_FORMAT,
        },
      },
    ],
    server: {
      port: DEFAULT_SERVER_PORT,
    },
  }
}
