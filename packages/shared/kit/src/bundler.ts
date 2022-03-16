import type {
  ManifestServerProxy,
  Recordable,
} from '@growing-web/web-builder-types'
import { DEFAULT_CACHE_CONFIG_FILE } from '@growing-web/web-builder-constants'
import type { ProxyOptions } from 'vite'
import { path, fs } from './lib'
import { URL } from 'url'

/**
 * resolve field parsing
 * @param proxyList
 * @returns
 */
export function resolveProxy(
  proxyList: ManifestServerProxy[] = [],
): Record<string, ProxyOptions> {
  const proxyMap: Recordable<ProxyOptions> = {}

  for (const proxy of proxyList) {
    const { url, target, secure, changeOrigin = true, pathRewrite = [] } = proxy
    proxyMap[url] = {
      target,
      secure,
      changeOrigin,
      rewrite: (rewritePath) => {
        if (!pathRewrite) {
          return rewritePath
        }

        const _path = rewritePath.startsWith('http')
          ? rewritePath
          : `http://localhost/${rewritePath}`

        const { pathname = '', search = '' } = new URL(_path)

        let _pathname = pathname

        pathRewrite.forEach(({ regular, replacement }) => {
          _pathname = _pathname.replace(new RegExp(regular, 'g'), replacement)
        })

        return path.join(_pathname, search)
      },
    }
  }
  return proxyMap
}

export async function persistencePort(port: number) {
  await fs.outputJSON(path.resolve(process.cwd(), DEFAULT_CACHE_CONFIG_FILE), {
    port,
  })
}
