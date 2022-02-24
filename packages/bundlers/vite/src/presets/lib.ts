import type { InlineConfig } from 'vite'
import type {
  Recordable,
  WebBuilderFormat,
  ManifestExportsType,
} from '@growing-web/web-builder-types'
import {
  readPackageJSON,
  logger,
  _,
  path,
} from '@growing-web/web-builder-toolkit'

interface CreateLibPresetOptions {
  entry: string
  format: WebBuilderFormat[]
  rootDir: string
  entryKey: string
  _exports?: ManifestExportsType
}

export async function createLibPreset(options: CreateLibPresetOptions) {
  const { rootDir, format, entry, entryKey, _exports = {} } = options

  const _entry = path.resolve(rootDir, entry)

  const pkg = await readPackageJSON(rootDir)

  const formatMap: Recordable<string | undefined> = {}

  format.forEach((fmt) => {
    const exportFmt = _exports[entryKey] || {}
    formatMap[fmt] = exportFmt[fmt] || `${entryKey}.${fmt}.js`
  })

  if (Object.keys(formatMap).length === 0) {
    logger.error(
      `You must set the entry field in 'package.json', at least make sure the 'main' field exists`,
    )
    process.exit(1)
  }

  formatMap.es = formatMap.esm
  Reflect.deleteProperty(formatMap, 'esm')

  const libName = pkg.name?.replace(/^@[^/]+\//, '').replace(/\//g, '-') ?? ''

  const _formats = _.union(format).map((item) =>
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
