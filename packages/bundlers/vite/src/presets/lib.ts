import type { InlineConfig } from 'vite'
import type {
  WebBuilderManifest,
  Recordable,
} from '@growing-web/web-builder-types'
import { readPackageJSON } from '@growing-web/web-builder-toolkit'
import path from 'pathe'

export async function createLibPreset(
  rootDir: string,
  outDir: string,
  manifest: Partial<WebBuilderManifest>,
) {
  const { entry = '', formats: formatList = [] } = manifest
  const _entry = path.resolve(rootDir, entry)

  let formats: any[] = []
  for (let fm of formatList) {
    if (!formats.includes(fm)) {
      formats.push(fm === 'esm' ? 'es' : fm)
    }
  }

  const pkg = await readPackageJSON(rootDir)

  const formatMap: Recordable<string | undefined> = {}

  formats.forEach((format) => {
    const map: Recordable<string> = {
      es: 'module',
      system: 'system',
      cjs: 'main',
      umd: 'main',
      iife: 'main',
    }
    const realPath = (pkg as any)[map[format]] || pkg['main']

    if (realPath) {
      formatMap[format] = path.relative(outDir, realPath)
    }
  })

  formats = Array.from(new Set([...formats]))

  const buildConfig: InlineConfig = {
    build: {
      lib: {
        entry: _entry,
        formats: formats,
        fileName: (format) => {
          return formatMap[format] || ''
        },
      },
    },
  }
  return buildConfig
}
