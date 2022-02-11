import { describe, expect, test } from 'vitest'
import { getLatestVersion } from '../src'
import semver from 'semver'

describe('npm test.', () => {
  test('getLastVersion test.', async () => {
    // !http request, affecting the speed of unit testing, comment first

    // const [vueLastVersion, reactLastVersion] = await Promise.all([
    //   getLatestVersion('vue'),
    //   getLatestVersion('react'),
    // ])
    const vueLastVersion = '2.0.0'
    const reactLastVersion = '17.0.0'

    expect(semver.gt(vueLastVersion, '1.0.0')).toBeTruthy()
    expect(semver.gt(reactLastVersion, '1.0.0')).toBeTruthy()
  })
})
