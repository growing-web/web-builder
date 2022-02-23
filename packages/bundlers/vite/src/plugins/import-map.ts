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

  /**
   * @default package.name
   */
  packageName?: string
}

const DEFAULT_MANIFEST_NAME = 'importmap.json'

let count = []
export function createImportMapManifestPlugin(
  options: CreateImportMapManifestOptions,
): PluginOption {
  const cache = new Map()
  let pkg: Recordable<any>
  return {
    name: 'web-builder:create-import-map-manifest',
    async generateBundle({ format }, bundle) {
      const { rootDir, packageName, filenameMap } = options
      if (!pkg) {
        pkg = await readPackageJSON(rootDir)
      }

      const name = packageName || pkg.name

      if (name) {
        if (!cache.get(format)) {
          for (const key in bundle) {
            const chunk = bundle[key]
            if (chunk.type === 'chunk' && (bundle[key] as any).isEntry) {
              cache.set(format, {
                [name]: chunk.fileName,
              })
              count.push(chunk.fileName)
            }
          }
        }

        const emitManifest = (fileName: string) => {
          const importMap = cache.get(format)
          console.log(importMap)

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
      }
    },
  }
}
