import type { InlineConfig } from 'vite'
import type {
  WebBuilderManifest,
  Recordable,
  WebBuilderTarget,
} from '@growing-web/web-builder-types'
import { readPackageJSON, logger } from '@growing-web/web-builder-toolkit'
import path from 'pathe'

export async function createLibPreset(
  rootDir: string,
  outDir: string,
  manifest: Partial<WebBuilderManifest>,
  target: WebBuilderTarget,
) {
  const { entry = '', formats = [] } = manifest

  const _entry = path.resolve(rootDir, entry)

  const pkg = await readPackageJSON(rootDir)

  const formatMap: Recordable<string | undefined> = {}

  formats.forEach((format) => {
    const map: Recordable<string> = {
      esm: 'module',
      system: 'system',
      cjs: 'main',
      umd: 'main',
      iife: 'main',
    }
    const realPath = (pkg as any)[map[format]] || pkg['main']

    if (realPath) {
      let realFile = path.relative(outDir, realPath)
      if (path.isAbsolute(outDir)) {
        realFile = path.resolve(outDir, realPath)
      }
      realFile = path.basename(realFile)

      const extname = path.extname(realFile)
      formatMap[format] = realFile.replace(
        new RegExp(extname + '$', ''),
        `.[hash].${format}${extname || '.js'}`,
      )
    }
  })

  if (target === 'lib' && Object.keys(formatMap).length === 0) {
    logger.error(
      `You must set the entry field in 'package.json', at least make sure the 'main' field exists`,
    )
    process.exit(1)
  }

  formatMap.es = formatMap.esm
  //   Reflect.deleteProperty(formatMap, 'esm')

  const libName = pkg.name?.replace(/^@[^/]+\//, '').replace(/\//g, '-') ?? ''

  const _formats = Array.from(new Set([...formats])).map((item) =>
    item === 'esm' ? 'es' : item,
  ) as any

  const buildConfig: InlineConfig = {
    build: {
      lib: {
        name: libName,
        entry: _entry,
        formats: _formats,
        fileName: (format) => {
          return formatMap[format] || ''
        },
      },
    },
  }
  return buildConfig
}
