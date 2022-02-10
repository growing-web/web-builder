import { test, describe, expect } from 'vitest'
import { read } from '@growing-web/web-builder-schema'
import { resolve } from 'pathe'

describe('read manifest test.', () => {
  test('custom cwd.', async () => {
    const root = resolve(__dirname, 'fixtures/custom-cwd/')
    const ret = await read({ root, manifestFileName: 'project-manifest.json' })
    expect(ret.schemaVersion).toEqual('0.0.0')
  })

  test('default cwd.', async () => {
    const root = resolve(__dirname, 'fixtures/default-cwd/')
    const ret = await read({ root })
    expect(ret.schemaVersion).toEqual('0.0.0')
  })

  test('custom manifest filename.', async () => {
    const root = resolve(__dirname, 'fixtures/custom-manifest-filename/')
    const ret = await read({ root, manifestFileName: 'growing.json' })
    expect(ret.schemaVersion).toEqual('1.0.0')
  })
})
