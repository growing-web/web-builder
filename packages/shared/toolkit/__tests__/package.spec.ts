import { describe, expect, test } from 'vitest'
import path from 'pathe'
import { readDependencies } from '../src'

describe('package test.', () => {
  test('readDependencies correct return .', async () => {
    const deps = await readDependencies(
      path.resolve(__dirname, './fixtures/package/correct-return/'),
    )

    expect(deps.vite).toEqual('latest')
  })

  test('readDependencies correct overrides .', async () => {
    const deps = await readDependencies(
      path.resolve(__dirname, './fixtures/package/correct-overrides/'),
    )

    expect(deps.vite).toEqual('latest')
  })
})
