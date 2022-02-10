import type { WebBuilderManifest } from '@growing-web/web-builder-types'
import { test, describe, expect } from 'vitest'
import { validate } from '@growing-web/web-builder-schema'

describe('schema validate test.', () => {
  /**
   * 捕获校验错误进行测试
   * @param type
   * @param config
   */
  const validateSchema = (type: string, config: WebBuilderManifest) => {
    let error: any
    try {
      validate(config)
    } catch (errorFromPlugin: any) {
      if (errorFromPlugin.name !== 'ValidationError') {
        throw error
      }
      error = errorFromPlugin
    } finally {
      if (type === 'success') {
        expect(error).toBeUndefined()
      } else if (type === 'failure') {
        expect(() => {
          throw error
        }).toThrowErrorMatchingSnapshot()
      }
    }
  }

  const tests: Record<'success' | 'failure', WebBuilderManifest[]> = {
    success: [
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
      },
      {
        schemaVersion: '0.0.0',
        entry: 'src/main.ts',
      },
      {
        schemaVersion: '0.0.0',
        entry: 'src/main.ts',
        externals: {
          Vue: 'Vue',
        },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'src/main.ts',
        publicPath: '/',
        externals: {},
        server: { port: 3000, proxy: [], host: '' },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'src/main.ts',
        publicPath: '/',
        externals: { lazy: 'React' },
        server: { port: 3000, proxy: [], host: '' },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: { proxy: [] },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: { proxy: [{ url: '/api', target: 'https://xxx' }] },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: {
          proxy: [
            {
              url: '/api',
              target: 'https://xxx',
              pathRewrite: [{ regular: /^\/api/, replacement: '' }],
            },
            {
              url: '/api',
              target: 'https://xxx',
              pathRewrite: [{ regular: '/api', replacement: '' }],
            },
          ],
        },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        externals: { vue: 'Vue' },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        env: {
          development: {
            publicPath: '/',
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        env: {
          development: {
            server: { port: 4000 },
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        outDir: 'build',
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        target: 'lib',
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        format: ['cjs'],
      },
    ],
    failure: [
      {
        schemaVersion: 1,
        entry: 'app.js',
      },
      {
        schemaVersion: '0.0.0',
        entry: 'src/main.ts',
        externals: {
          123: 'Vue',
        },
      },
      {
        entry: 'src/main.ts',
      },
      {
        schemaVersion: '0.0.0',
        externals: '',
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: { proxy: [''] },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: {},
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: { host: 100 },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: { port: '3000' },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: { proxy: [{}] },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        server: {
          proxy: [
            {
              url: '/api',
              target: 'https://xxx',
              pathRewrite: [{ regular: 123, replacement: '' }],
            },
          ],
        },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        env: {
          123: {
            server: { port: 4000 },
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        env: {
          development: {
            server: { port: 99999 },
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        outDir: 123,
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        target: 'web',
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        format: 'cjs',
      },
      {
        schemaVersion: '0.0.0',
        entry: 'app.js',
        format: ['umd'],
      },
    ] as any,
  }
  for (const type of Object.keys(tests) as ['success', 'failure']) {
    for (const value of tests[type]) {
      test(`should ${
        type === 'success' ? 'successfully validate' : 'throw an error on'
      } the patterns option: ${JSON.stringify(value)}`, () => {
        validateSchema(type, value)
      })
    }
  }
})
