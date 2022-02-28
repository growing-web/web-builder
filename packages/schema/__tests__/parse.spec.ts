import { test, describe, expect } from 'vitest'
import { parse } from '@growing-web/web-builder-schema'
import { resolve } from 'pathe'

describe('parse manifest test.', () => {
  test('wrong configuration value.', async () => {
    const root = resolve(__dirname, 'fixtures/wrong-configuration/')
    let err: any
    try {
      await parse({ root, manifestFileName: 'project-manifest.json' })
    } catch (error) {
      err = error
    }
    expect(() => {
      throw err.toString().replace(process.cwd(), '')
    }).toThrowErrorMatchingSnapshot()
  })

  test('correct environment variable configuration.', async () => {
    const root = resolve(__dirname, 'fixtures/env/')

    const manifest = await parse({
      root,
      manifestFileName: 'project-manifest.json',
      mode: 'production',
    })
    expect(manifest.publicPath).toBe('http://dev.test.com')
    expect(manifest.server?.port).toBe(3200)
    expect(manifest.server?.host).toBe('http://dev.test.com')
  })
})
