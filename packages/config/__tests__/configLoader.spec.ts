import { test, describe, expect } from 'vitest'
import path from 'path'
import { configLoader } from '../src'

describe('configLoader test.', () => {
  test(`correct load order`, async () => {
    const rootDir = path.join(__dirname, `./fixtures/config/priority/`)
    const config = await configLoader({
      rootDir,
      configFiles: [
        'web-builder.config.json',
        'web-builder.config.ts',
        'web-builder.config.js',
      ],
    })

    expect(config).toEqual({ type: 'json' })
  })
  test(`custom filename.`, async () => {
    const rootDir = path.join(__dirname, `./fixtures/config/custom-filename/`)
    const config = await configLoader({
      rootDir,
      configFiles: ['custom-filename.ts', 'custom-filename.js'],
    })

    expect(config).toEqual({ content: 'custom-filename' })
  })
})
