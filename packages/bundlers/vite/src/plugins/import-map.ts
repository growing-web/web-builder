import type { PluginOption } from 'vite'
import type {
  ManifestImportmapType,
  Recordable,
} from '@growing-web/web-builder-types'
import { readPackageJSON } from '@growing-web/web-builder-toolkit'

export interface CreateImportMapManifestOptions {
  /**
   * @default process.cwd()
   */
  rootDir: string

  /**
   * @default importmap.json
   */
  filenameMap?: ManifestImportmapType['filename']
}

const DEFAULT_MANIFEST_NAME = 'importmap.json'

export function createImportMapManifestPlugin(
  options: CreateImportMapManifestOptions,
): PluginOption {
  const cache = new Map()
  let pkg: Recordable<any>
  return {
    name: 'web-builder:create-import-map-manifest',
    async generateBundle({ format }, bundle) {
      const { rootDir, filenameMap } = options
      if (!pkg) {
        pkg = await readPackageJSON(rootDir)
      }

      for (const key in bundle) {
        const chunk = bundle[key]
        if (chunk.type === 'chunk' && (bundle[key] as any).isEntry) {
          const fmt = cache.get(format) ?? []
          fmt.push(chunk.fileName)
          cache.set(format, fmt)
        }
      }

      const emitManifest = (fileName: string) => {
        const importMap = cache.get(format)

        if (importMap) {
          this.emitFile({
            type: 'asset',
            fileName,
            source: `${JSON.stringify(
              {
                imports: importMap,
              },
              null,
              2,
            )}`,
          })
        }
      }

      const _filenameMap = {
        ...(filenameMap || {}),
        es: filenameMap?.esm,
      }

      const filename = _filenameMap?.[format as 'esm']

      if (['es', 'esm'].includes(format)) {
        emitManifest(filename || DEFAULT_MANIFEST_NAME)
      } else if (format === 'system') {
        emitManifest(filename || `system-${DEFAULT_MANIFEST_NAME}`)
      }
    },
  }
}
