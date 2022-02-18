import { describe, expect, test } from 'vitest'
import { getPackageManager, getNpmInstallMessage } from '../src'
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

  test('getPackageManager test.', async () => {
    expect(['yarn', 'npm', 'pnpm'].includes(getPackageManager())).toBeTruthy()
  })

  test('getNpmInstallMessage test.', async () => {
    expect(
      getNpmInstallMessage({
        packageName: 'node',
        client: 'npm',
      }),
    ).toEqual('npm install -g node')

    expect(
      getNpmInstallMessage({
        packageName: 'node',
        client: 'npm',
        global: false,
        dev: true,
        workspaceRoot: true,
      }).trim(),
    ).toEqual('npm install node -D -W')

    expect(
      getNpmInstallMessage({
        packageName: 'node',
        client: 'pnpm',
      }),
    ).toEqual('pnpm add -g node')

    expect(
      getNpmInstallMessage({
        packageName: 'node',
        client: 'pnpm',
        global: false,
        dev: true,
        workspaceRoot: true,
      }).trim(),
    ).toEqual('pnpm add node -D -W')

    expect(
      getNpmInstallMessage({
        packageName: 'node',
        client: 'yarn',
      }),
    ).toEqual('yarn global add node')

    expect(
      getNpmInstallMessage({
        packageName: 'node',
        client: 'yarn',
        global: false,
        dev: true,
        workspaceRoot: true,
      }).trim(),
    ).toEqual('yarn add node -D -W')
  })
})
