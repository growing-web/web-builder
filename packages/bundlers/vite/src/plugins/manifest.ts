import type { PluginOption } from 'vite'
import type { Recordable } from '@growing-web/web-builder-types'
import { readPackageJSON } from '@growing-web/web-builder-kit'

const cache = new Map()
export function createManifestPlugin(name = 'index'): PluginOption {
  let pkg: Recordable<any>
  let root = ''
  return {
    name: 'web-builder:create-import-map-manifest',
    config(resolveConfig) {
      root = resolveConfig.root!
    },
    async generateBundle({ format }, bundle) {
      if (!pkg) {
        pkg = await readPackageJSON(root)
      }

      for (const key in bundle) {
        const chunk = bundle[key]
        if (chunk.type === 'chunk' && (bundle[key] as any).isEntry) {
          const fmt = cache.get(format) ?? {}
          fmt[`${name === 'index' ? '.' : `./${name}`}`] = chunk.fileName
          cache.set(format, fmt)
        }
      }

      const emitManifest = (fileName: string) => {
        const manifest = cache.get(format)
        if (manifest) {
          this.emitFile({
            type: 'asset',
            fileName,
            source: `${JSON.stringify(
              {
                exports: manifest,
              },
              null,
              2,
            )}`,
          })
        }
      }

      if (['es', 'esm'].includes(format)) {
        emitManifest(`exports-manifest.json`)
      } else if (format === 'system') {
        emitManifest(`system-exports-manifest.json`)
      }
    },
  }
}
