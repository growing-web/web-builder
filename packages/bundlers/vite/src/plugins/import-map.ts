import type { PluginOption } from 'vite'
import { readPackageJSON } from '@growing-web/web-builder-toolkit'

export interface CreateImportMapManifestOptions {
  /**
   * @default process.cwd()
   */
  rootDir: string

  /**
   * @default importmap.json
   */
  filename?: string
}

const DEFAULT_MANIFEST_NAME = 'importmap.json'

export function createImportMapManifestPlugin(
  options: CreateImportMapManifestOptions,
): PluginOption {
  const cache = new Map()

  return {
    name: 'web-builder:create-import-map-manifest',

    async generateBundle({ format }, bundle) {
      const { rootDir, filename = DEFAULT_MANIFEST_NAME } = options
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
          emitManifest(filename)
        } else if (format === 'system') {
          emitManifest(`system-${filename}`)
        }
      }
    },
  }
}
