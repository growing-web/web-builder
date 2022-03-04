import type { WebBuilderConfig } from '@growing-web/web-builder-types'
export function createBuilderDefaultConfig(): WebBuilderConfig {
  return {
    schemaVersion: '1.0.0',
    entries: [],
    watch: false,
    server: {
      open: false,
      https: false,
      mkcert: true,
      port: 6060,
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
