import { describe, expect, test } from 'vitest'
import path from 'pathe'
import { loadFrameworkTypeAndVersion } from '../src'

describe('framework test.', () => {
  test('is a vanilla app.', async () => {
    const ret = await loadFrameworkTypeAndVersion(
      path.join(__dirname, './fixtures/framework/vanilla-app/'),
    )
    expect(ret.framework).toEqual('vanilla')
    expect(ret.version).toBe(0)
  })

  test('is a vue and react app.', async () => {
    let err: any
    try {
      await loadFrameworkTypeAndVersion(
        path.join(__dirname, './fixtures/framework/vue-react-app/'),
      )
    } catch (error) {
      err = error
    }
    expect(() => {
      throw err
    }).toThrowErrorMatchingSnapshot()
  })

  test('is a vue app.', async () => {
    const ret = await loadFrameworkTypeAndVersion(
      path.join(__dirname, './fixtures/framework/vue-app/'),
    )
    expect(ret.framework).toBe('vue')
    expect(typeof ret.version === 'number').toBeTruthy()
  })

  test('is a react app.', async () => {
    const ret = await loadFrameworkTypeAndVersion(
      path.join(__dirname, './fixtures/framework/react-app/'),
    )
    expect(ret.framework).toBe('react')
    expect(typeof ret.version === 'number').toBeTruthy()
  })
})
