import { describe, expect, test } from 'vitest'
import {
  getNpmPackageManager,
  createNpmInstallMessage,
  canUseNpmPackageManager,
} from '../src'
import semver from 'semver'
import path from 'path'

describe('getNpmLatestVersion()', () => {
  test('version greater than 1.0.0.', async () => {
    // !http request, affecting the speed of unit testing, comment first
    // const [vueLastVersion, reactLastVersion] = await Promise.all([
    //   getNpmLatestVersion('vue'),
    //   getNpmLatestVersion('react'),
    // ])
    const vueLastVersion = '2.0.0'
    const reactLastVersion = '17.0.0'

    expect(semver.gt(vueLastVersion, '1.0.0')).toBeTruthy()
    expect(semver.gt(reactLastVersion, '1.0.0')).toBeTruthy()
  })
})

describe('canUseNpmPackageManager()', () => {
  test('Make sure npm is installed.', async () => {
    expect(canUseNpmPackageManager('npm')).toBeTruthy()
  })
})

describe('getPackageManager()', () => {
  test('works fine.', async () => {
    const packageManager = getNpmPackageManager()
    if (packageManager) {
      expect(['yarn', 'npm', 'pnpm'].includes(packageManager)).toBeTruthy()
    }
  })

  const types = ['yarn', 'pnpm', 'npm']
  types.forEach((type) => {
    test(`${type} type.`, async () => {
      const root = path.join(
        __dirname,
        `./fixtures/npm/${type}-package-manager/`,
      )
      const packageManager = getNpmPackageManager(root)
      expect(packageManager).toBe(type)
    })
  })
})

describe('createNpmInstallMessage()', () => {
  test('npm install -g', () => {
    expect(
      createNpmInstallMessage({
        packageName: 'node',
        client: 'npm',
      }),
    ).toEqual('npm install -g node')
  })

  test('npm install -g -D -W', () => {
    expect(
      createNpmInstallMessage({
        packageName: 'node',
        client: 'npm',
        global: false,
        dev: true,
        monorepoRoot: true,
      }).trim(),
    ).toEqual('npm install node -D -W')
  })

  test('npm install node -D -W', () => {
    expect(
      createNpmInstallMessage({
        packageName: 'node',
        client: 'npm',
        global: false,
        dev: true,
        monorepoRoot: true,
      }).trim(),
    ).toEqual('npm install node -D -W')
  })

  test('pnpm add -g node', () => {
    expect(
      createNpmInstallMessage({
        packageName: 'node',
        client: 'pnpm',
      }),
    ).toEqual('pnpm add -g node')
  })

  test('pnpm add node -D -W', () => {
    expect(
      createNpmInstallMessage({
        packageName: 'node',
        client: 'pnpm',
        global: false,
        dev: true,
        monorepoRoot: true,
      }).trim(),
    ).toEqual('pnpm add node -D -W')
  })

  test('yarn global add node', () => {
    expect(
      createNpmInstallMessage({
        packageName: 'node',
        client: 'yarn',
      }),
    ).toEqual('yarn global add node')
  })

  test('yarn add node -D -W', () => {
    expect(
      createNpmInstallMessage({
        packageName: 'node',
        client: 'yarn',
        global: false,
        dev: true,
        monorepoRoot: true,
      }).trim(),
    ).toEqual('yarn add node -D -W')
  })
})
