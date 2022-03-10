import { describe, expect, test } from 'vitest'
import { getDeps, findWorkspacePackages } from '../src'
import path from 'path'

describe('getDeps()', () => {
  test('correct merge.', async () => {
    const root = path.join(__dirname, './fixtures/package/get-deps/')
    const { deps } = await getDeps(root)
    expect(deps.lodash).toEqual('latest')
  })
})

describe('findWorkspacePackages()', () => {
  test('find yarn workspace packages.', async () => {
    const root = path.join(__dirname, './fixtures/package/yarn/')
    const pkgs = await findWorkspacePackages(root)
    const bn = pkgs.map((pkg) => path.basename(pkg))
    expect(bn).toEqual(['pkg', 'sub-1', 'sub-2'])
  })

  test('find yarn2 workspace packages.', async () => {
    const root = path.join(__dirname, './fixtures/package/yarn2/')
    const pkgs = await findWorkspacePackages(root)
    const bn = pkgs.map((pkg) => path.basename(pkg))
    expect(bn).toEqual(['pkg', 'sub-1', 'sub-2'])
  })

  test('find lerna workspace packages.', async () => {
    const root = path.join(__dirname, './fixtures/package/lerna/')
    const pkgs = await findWorkspacePackages(root)
    const bn = pkgs.map((pkg) => path.basename(pkg))
    expect(bn).toEqual(['pkg', 'sub-1', 'sub-2'])
  })

  test('find pnpm workspace packages.', async () => {
    const root = path.join(__dirname, './fixtures/package/pnpm/')
    const pkgs = await findWorkspacePackages(root)
    const bn = pkgs.map((pkg) => path.basename(pkg))
    expect(bn).toEqual(['sub-1', 'sub-2', 'pkg'])
  })
})
