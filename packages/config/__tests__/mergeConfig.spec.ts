import { test, describe, expect } from 'vitest'
import { mergeManifestConfig } from '../src'
import { createManifestDefaultConfig } from '../src/defaultConfig'

describe('mergeConfig test.', () => {
  test(`default merge.`, async () => {
    const overrides = {
      entries: [
        {
          output: {
            formats: ['esm', 'cjs'],
          },
        },
      ],
      server: {
        port: 3030,
      },
    }

    const config = mergeManifestConfig(createManifestDefaultConfig(), overrides)
    expect(config).toEqual({
      schemaVersion: '1.0.0',
      entries: [
        {
          input: 'index.html',
          output: {
            dir: 'dist',
            formats: ['esm', 'cjs'],
            entryFileNames: '[name].js',
          },
        },
      ],
      server: {
        port: 3030,
      },
    })
  })

  test(`common field merge.`, async () => {
    const overrides = {
      server: {
        port: 3030,
      },
    }
    const defaultConfig = {
      schemaVersion: '1.0.0',
      server: {
        port: 6060,
      },
    }

    const config = mergeManifestConfig(defaultConfig, overrides)
    expect(config).toEqual({
      schemaVersion: '1.0.0',
      server: {
        port: 3030,
      },
    })
  })

  test(`array field merge.`, async () => {
    const overrides = {
      server: {
        port: 3030,
      },
      arr: [1, 2],
    }
    const defaultConfig = {
      schemaVersion: '1.0.0',
      server: {
        port: 6060,
      },
      arr: [3, 4],
    }

    const config = mergeManifestConfig(defaultConfig, overrides)

    expect(config).toEqual({
      schemaVersion: '1.0.0',
      server: {
        port: 3030,
      },
      arr: [3, 4, 1, 2],
    })
  })

  test(`complex array field merge.`, async () => {
    const overrides = {
      entries: [
        {
          input: 'index.html',
        },
        {
          input: 'index1.html',
        },
      ],
      server: {
        port: 3030,
      },
      arr: [1, 2],
    }
    const defaultConfig = {
      entries: [
        {
          input: 'a.html',
        },
      ],
      schemaVersion: '1.0.0',
      server: {
        port: 6060,
      },
      arr: [3, 4],
    }

    const config = mergeManifestConfig(defaultConfig, overrides)

    expect(config).toEqual({
      entries: [
        {
          input: 'index.html',
        },
        {
          input: 'index1.html',
        },
      ],
      schemaVersion: '1.0.0',
      server: {
        port: 3030,
      },
      arr: [3, 4, 1, 2],
    })
  })

  test(`entries field merge.`, async () => {
    const overrides = {
      entries: [
        {
          input: '',
        },
      ],
    }
    const defaultConfig = {
      entries: [
        {
          input: 'index.html',
          output: {
            dir: 'dist',
          },
        },
        {
          input: 'index.js',
          output: {
            dir: 'dist',
          },
        },
      ],
    }

    const config = mergeManifestConfig(defaultConfig, overrides)
    expect(config).toEqual({
      entries: [
        {
          input: '',
          output: {
            dir: 'dist',
          },
        },
        {
          input: 'index.js',
          output: {
            dir: 'dist',
          },
        },
      ],
    })
  })

  test(`full merge.`, async () => {
    const overrides = {
      schemaVersion: '2.0.0',
      entries: [
        {
          input: 'index.js',
        },
      ],
      server: {
        port: 6061,
      },
    }
    const defaultConfig = {
      schemaVersion: '1.0.0',
      entries: [
        {
          input: 'index.html',
        },
      ],
      server: {
        port: '6060',
      },
    }

    const config = mergeManifestConfig(defaultConfig, overrides)
    expect(config).toEqual({
      schemaVersion: '2.0.0',
      entries: [
        {
          input: 'index.js',
        },
      ],
      server: {
        port: 6061,
      },
    })
  })
})
