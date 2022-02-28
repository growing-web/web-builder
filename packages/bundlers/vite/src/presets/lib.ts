import type { InlineConfig } from 'vite'
import type {
  Recordable,
  WebBuilderFormat,
  ManifestExportsType,
} from '@growing-web/web-builder-types'
import { logger, _, path } from '@growing-web/web-builder-toolkit'

interface CreateLibPresetOptions {
  entry: string
  format: WebBuilderFormat[]
  rootDir: string
  _exports?: ManifestExportsType
}

export async function createLibPreset(options: CreateLibPresetOptions) {
  const { rootDir, format, entry, _exports = {} } = options

  const formatMap: Recordable<string | undefined> = {}
  const _entry = path.resolve(rootDir, entry)

  const entryName = path.basename(_entry).replace(path.extname(_entry), '')

  format.forEach((fmt) => {
    const exportFileName = _exports[fmt]?.replace('[name]', entryName)
    formatMap[fmt] = exportFileName || `${entryName}.${fmt}.js`
  })

  if (Object.keys(formatMap).length === 0) {
    logger.error(
      `You must set the entry field in 'package.json', at least make sure the 'main' field exists`,
    )
    process.exit(1)
  }

  formatMap.es = formatMap.esm
  Reflect.deleteProperty(formatMap, 'esm')

  const _formats = _.union(format).map((item) =>
    item === 'esm' ? 'es' : item,
  ) as any

  const buildConfig: InlineConfig = {
    build: {
      lib: {
        name: _exports?.name ?? '',
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
