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
      error = errorFromPlugin
    } finally {
      if (type === 'success') {
        expect(error).toBeUndefined()
      } else if (type === 'failure') {
        expect(() => {
          if (!error) {
            return
          }

          throw error
        }).toThrowErrorMatchingSnapshot()
      }
    }
  }

  const tests: Record<'success' | 'failure', WebBuilderManifest[]> = {
    success: [
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'src/app.js',
          foo: 'src/foo.js',
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        formats: {
          index: ['cjs', 'umd'],
        },
      },

      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
          foo: 'app.js',
        },
        formats: {
          index: ['cjs', 'umd'],
          foo: ['esm', 'system'],
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        exports: {
          index: {
            esm: 'app.js',
          },
          foo: {
            esm: 'app.js',
            system: 'app.js',
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        exports: {
          index: {
            esm: 'index.js',
          },
        },
        importmap: {
          packageName: '${packageName}',
          filename: {
            esm: 'esm-importmap.json',
            system: 'system-importmap.json',
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        externals: {
          Vue: 'Vue',
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        publicPath: '/',
        externals: {},
        server: { port: 3000, proxy: [], host: '' },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        publicPath: '/',
        externals: { lazy: 'React' },
        server: { port: 3000, proxy: [], host: '' },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        server: { proxy: [] },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        server: { proxy: [{ url: '/api', target: 'https://xxx' }] },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
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
        entries: {
          index: 'app.js',
        },
        externals: { vue: 'Vue' },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        env: {
          development: {
            publicPath: '/',
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        env: {
          development: {
            server: { port: 4000 },
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        outDir: 'build',
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        // target: 'lib',
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        formats: {
          index: ['cjs'],
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        sourcemap: false,
      },
    ],
    failure: [
      {
        schemaVersion: 1,
        entries: {
          index: 'app.js',
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        formats: {
          foo: 'cjs',
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        externals: {
          123: 'Vue',
        },
      },

      // FIXME
      //   {
      //     schemaVersion: '0.0.0',
      //     entry: 'app.js',
      //     exports: {
      //       index: {
      //         aaa: 'app.js',
      //       },
      //     },
      //   },
      //   {
      //     schemaVersion: '0.0.0',
      //     entry: 'app.js',
      //     importmap: {
      //       packageName: 'packageName',
      //       filename: {
      //         es: 'es-importmap.json',
      //       },
      //     },
      //   },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        importmap: {
          packageName: 1,
        },
      },

      {
        entries: 'src/main.ts',
      },
      {
        schemaVersion: '0.0.0',
        externals: '',
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        server: { proxy: [''] },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        server: { host: 100 },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        server: { port: '3000' },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        server: { proxy: [{}] },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
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
        entries: {
          index: 'app.js',
        },
        env: {
          123: {
            server: { port: 4000 },
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        env: {
          development: {
            server: { port: 99999 },
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        outDir: 123,
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        formats: 'cjs',
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        formats: ['umds'],
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
          foo: 'foo.html',
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {},
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          foo: 'foo.js',
        },
        exports: {
          index: {},
        },
        importmap: {
          filename: {
            esm: 'esm-importmap.json',
            system: 'system-importmap.json',
          },
        },
      },
      {
        schemaVersion: '0.0.0',
        entries: {
          index: 'app.js',
        },
        sourcemap: 'false',
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
