import type { ManifestConfig } from '@growing-web/web-builder-types'
import { test, describe, expect } from 'vitest'
import path from 'path'
import {
  resolveUserConfig,
  resolveManifestConfig,
  validateManifestConfig,
} from '../src'

describe('resolve UserConfig test.', () => {
  const testFiles = ['cjs', 'module-js', 'ts', 'json', 'mjs']

  const _resolveUserConfig = async (root: string, mode = 'development') => {
    const rootDir = path.join(__dirname, root)
    const config = await resolveUserConfig(
      {
        mode: mode,
        command: 'dev',
      },
      rootDir,
    )
    return config
  }

  testFiles.forEach((file) => {
    test(`can load .${file} file`, async () => {
      const config = await _resolveUserConfig(`./fixtures/config/${file}/`)
      expect(config).toEqual({ foo: 'foo' })
    })
  })

  test(`when the configuration file does not exist`, async () => {
    const config = await _resolveUserConfig(`./fixtures/config/un-exits/`)
    expect(config).toEqual({})
  })

  test(`when the configuration include wrong value`, async () => {
    try {
      await _resolveUserConfig(`./fixtures/config/throw/`)
    } catch (error: any) {
      expect(error.message).to.include(
        'or the return value type of the function needs to be an object type',
      )
    }
  })

  test(`normal when the return value is a function`, async () => {
    const config = await _resolveUserConfig(
      `./fixtures/config/function-param/`,
      'dev',
    )
    expect(config).toEqual({ mode: 'dev' })
  })
})

describe('resolve ManifestConfig test.', () => {
  const _resolveManifestConfig = async (root: string) => {
    const rootDir = path.join(__dirname, root)
    const config = await resolveManifestConfig(rootDir)
    return config
  }
  test(`manifest files can be parsed by default.`, async () => {
    const config = await _resolveManifestConfig(`./fixtures/manifest/resolve/`)
    expect(config.schemaVersion).toBe('1.0.0')
  })

  test(`when manifest file does not exist.`, async () => {
    const config = await _resolveManifestConfig(
      `./fixtures/manifest/non-exits/`,
    )
    expect(config).toEqual({})
  })
})

describe('validate manifestConfig test.', () => {
  /**
   * Catch validation errors for testing
   * @param type
   * @param config
   */
  const validateConfigBySchema = (type: string, config: ManifestConfig) => {
    let error: any
    try {
      validateManifestConfig(config)
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

  const tests: Record<'success' | 'failure', ManifestConfig[]> = {
    success: [
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js' }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          { input: 'app.js' },
          { input: 'foo.js', output: { name: 'foo' } },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', publicPath: '/' }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', publicPath: '/' }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', output: { formats: ['umd', 'cjs'] } }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', output: { name: 'MyLib' } }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', output: { dir: 'dir' } }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', output: { externals: ['vue'] } }],
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: { assetFileNames: '[name].[hash].[ext]' },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          { input: 'app.js', output: { chunkFileNames: '[name]-[hash].js' } },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          { input: 'app.js', output: { entryFileNames: '[name].[format].js' } },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', output: { sourcemap: true } }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', output: { declaration: true } }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', output: { globals: { jquery: '$' } } }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: { banner: { header: 'header', footer: 'footer' } },
          },
        ],
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
          port: 6060,
        },
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
          host: 'localhost',
        },
      },
      {
        schemaVersion: '1.0.0',
        manifests: ['exports-manifest'],
        entries: [
          {
            input: 'app.js',
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
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
      },
      {
        $schema:
          'https://unpkg.com/@growing-web/web-builder@latest/web-project-manifest.json',
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'index.html',
            publicPath: '/',
            output: {
              name: 'index',
              dir: 'dist',
              externals: [],
              assetFileNames: 'assets/[name].[hash].[ext]',
              chunkFileNames: 'assets/[name]-[hash].js',
              entryFileNames: 'assets/[name]-[hash].js',
              sourcemap: true,
              declaration: true,
              meta: {
                umdName: 'MyLib',
              },
            },
          },
          {
            input: 'index.js',
            publicPath: '/',
            output: {
              name: 'sub',
              dir: 'dist',
              externals: ['jquery'],
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
                header: '/* library version 1.0.0 */',
                footer: '/* follow me on Twitter! @growing-web */',
              },
            },
          },
        ],
        server: {
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
      },
    ],
    failure: [
      {
        schemaVersion: 1,
        entries: [{ input: 'app.js' }],
      },
      {
        schemaVersion: 'a.b.c',
        entries: [{ input: 'app.js' }],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{ input: 'app.js', publicPath: './' }],
      },
      {
        schemaVersion: '1.0.0',
        manifests: ['exports'],
        entries: [
          {
            input: 'app.js',
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [{}],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              formats: ['es'],
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              formats: 'esm',
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              externals: {
                123: 'Vue',
              },
            },
          },
        ],
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              name: 123,
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              dir: 123,
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              sourcemap: 'inline',
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              assetFileName: 1,
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              chunkFileNames: 1,
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              entryFileName: 1,
            },
          },
        ],
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              declaration: 'false',
            },
          },
        ],
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              banner: 'false',
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              banner: {
                header: 1,
                footer: 2,
              },
            },
          },
        ],
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              globals: ['$'],
            },
          },
        ],
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
          port: '3000',
        },
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
          port: 1111111,
        },
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
          port: 6060,
          host: true,
        },
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
          port: 6060,
          host: 100,
        },
      },

      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
          port: 6060,
          host: 100,
          proxy: {},
        },
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
          },
        ],
        server: {
          port: 6060,
          host: 100,
          proxy: [
            {
              url: 123,
              target: '123',
            },
          ],
        },
      },
      {
        schemaVersion: '1.0.0',
        entries: [
          {
            input: 'app.js',
            output: {
              name: 'index',
            },
          },
          {
            input: 'foo.js',
            output: {
              name: 'index',
            },
          },
        ],
      },
    ] as any,
  }
  for (const type of Object.keys(tests) as ['success', 'failure']) {
    for (const value of tests[type]) {
      test(`should ${
        type === 'success' ? 'successfully validate' : 'throw an error on'
      } the patterns option: ${JSON.stringify(value)}`, () => {
        validateConfigBySchema(type, value)
      })
    }
  }
})
