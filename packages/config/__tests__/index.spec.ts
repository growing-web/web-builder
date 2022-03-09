import { test, describe, expect } from 'vitest'
import path from 'path'
import { resolveConfig } from '../src'

describe('resolveConfig().', () => {
  test(`compose config test.`, async () => {
    const rootDir = path.join(__dirname, './fixtures/resolve/')
    const config = await resolveConfig(
      {
        root: rootDir,
      },
      'build',
    )
    expect(config).toEqual({
      watch: true,
      $schema:
        'https://unpkg.com/@growing-web/web-builder@latest/web-project-manifest.json',
      schemaVersion: '1.0.0',
      pluginInstances: [],
      bundlerType: 'vite',
      entries: [
        {
          input: 'index.html',
          publicPath: '/',
          output: {
            dir: 'dist',
            externals: [],
            assetFileNames: 'assets/[name].[hash].[ext]',
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
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

  test(`inject variables.`, async () => {
    const rootDir = path.join(__dirname, './fixtures/resolve-inject/')

    const config = await resolveConfig(
      {
        root: rootDir,
      },
      'build',
    )
    expect(config).toEqual({
      $schema:
        'https://unpkg.com/@growing-web/web-builder@latest/web-project-manifest.json',
      schemaVersion: '1.0.0',
      pluginInstances: [],
      bundlerType: 'vite',
      entries: [
        {
          input: 'index.html',
          publicPath: '/',
          output: {
            externals: [],
            dir: `workspaceRoot/dist`,
            assetFileNames: 'assets/[name].[hash].[ext]',
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            sourcemap: true,
            declaration: true,
          },
        },
        {
          input: 'index.js',
          publicPath: '/',
          output: {
            name: 'sub',
            externals: ['jquery'],
            dir: `workspaceRoot/dist`,
            assetFileNames: '[name].[hash].[ext]',
            chunkFileNames: '[name]-[hash].js',
            entryFileNames: '[name].[format].js',
            formats: ['esm', 'system', 'umd'],
            sourcemap: true,
            declaration: true,
            globals: {
              jquery: '$',
            },
            meta: {
              umdName: 'MyLib',
            },
            banner: {
              footer: '/* follow me on Twitter! @growing-web */',
            },
          },
        },
      ],

      server: {
        open: false,
        https: false,
        mkcert: true,
        port: 3000,
        host: 'http://www.test.dev',
        proxy: [
          {
            url: '/api',
            target: 'http://localhost:8080/api?a=1&b=1',
            pathRewrite: [
              {
                regular: '^/api',
                replacement: '',
              },
            ],
          },
        ],
      },
      watch: false,
      build: {
        clean: true,
        report: false,
        reportJson: false,
      },
      plugins: [],
    })
  })
})
