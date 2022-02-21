import type { PluginOption } from 'vite'
import { readPackageJSON } from '@growing-web/web-builder-toolkit'

export interface CreateImportMapManifestOptions {
  /**
   * @default process.cwd()
   */
  rootDir: string

  /**
   * @default systemjs-importmap.json
   */
  systemFileName?: string

  /**
   * @default importmap.json
   */
  esmFileName?: string
}

const DEFAULT_ESM_MANIFEST_NAME = 'importmap.json'
const DEFAULT_SYSTEM_MANIFEST_NAME = 'systemjs-importmap.json'

export function createImportMapManifestPlugin(
  options: CreateImportMapManifestOptions,
): PluginOption {
  const cache = new Map()

  return {
    name: 'vite: create-import-map-manifest',

    async generateBundle({ format }, bundle) {
      const {
        rootDir,
        systemFileName = DEFAULT_SYSTEM_MANIFEST_NAME,
        esmFileName = DEFAULT_ESM_MANIFEST_NAME,
      } = options
      const pkg = await readPackageJSON(rootDir)

      const name = pkg.name

      if (name) {
        if (!cache.get(format)) {
          for (const key in bundle) {
            const chunk = bundle[key]
            if (chunk.type === 'chunk' && (bundle[key] as any).isEntry) {
              cache.set(format, {
                [name]: chunk.fileName,
              })
            }
          }
        }

        const emitManifest = (fileName: string) => {
          const importMap = cache.get(format)
          if (importMap) {
            this.emitFile({
              type: 'asset',

              // custom-${name}.json => custom-xxxx.json
              fileName: fileName.replace(/(\{\w+\})/, name),
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

        if (['es', 'esm'].includes(format)) {
          emitManifest(esmFileName)
        } else if (format === 'system') {
          emitManifest(systemFileName)
        }
      }
    },
  }
}
