import { test, describe, expect } from 'vitest'
import path from 'path'
import { resolveConfig } from '../src'

describe('resolveConfig test.', () => {
  const rootDir = path.join(__dirname, './fixtures/resolve/')

  test(`compose config test.`, async () => {
    const config = await resolveConfig({
      rootDir,
    })
    expect(config).toEqual({
      watch: true,
      $schema:
        'https://unpkg.com/@growing-web/web-builder@latest/web-project-manifest.json',
      schemaVersion: '1.0.0',
      entries: [
        {
          input: 'index.html',
          publicPath: '/',
          output: {
            dir: 'dist',
            externals: [],
            assetFileName: 'assets/[name].[hash].[ext]',
            chunkFileName: 'assets/[name]-[hash].js',
            entryFileName: 'assets/[name]-[hash].js',
            sourcemap: true,
            declaration: true,
          },
        },
      ],
      server: {
        open: true,
        https: true,
        mkcert: true,
        port: 3000,
        host: 'http://www.test.dev',
        proxy: [
          {
            url: '/api',
            target: 'http://localhost:8080/api',
            pathRewrite: [
              {
                regular: '^/api',
                replacement: '',
              },
            ],
          },
        ],
      },
      build: {
        clean: true,
        report: true,
        reportJson: true,
      },
      plugins: [],
    })
  })
})
