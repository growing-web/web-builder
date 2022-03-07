import { describe, expect, test } from 'vitest'
import { getDeps } from '../src'
import semver from 'semver'
import path from 'path'

describe('getDeps()', () => {
  test('correct merge.', async () => {
    const root = path.join(__dirname, './fixtures/package/get-deps/')
    const { deps } = await getDeps(root)
    expect(deps.lodash).toEqual('1.0.0')
  })
})
