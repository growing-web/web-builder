import type { InlineConfig, ProxyOptions } from 'vite'
import type {
  ManifestServerProxy,
  WebBuilder,
  WebBuilderManifest,
  Recordable,
} from '@growing-web/web-builder-types'
import { mergeConfig } from 'vite'
import path from 'pathe'

export async function createConfig(webBuilder: WebBuilder) {
  const manifest = webBuilder.options?.manifest || ({} as WebBuilderManifest)

  const {
    server = {},
    // entry,
    externals = {},
    publicPath: base = '/',
  } = manifest

  const { port, host, proxy } = server

  const rollupExternals = Object.keys(externals)
  const globals = externals

  let viteConfig: InlineConfig = {
    base: '/',
  }

  const overrides: InlineConfig = {
    base,
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      port,
      host,
      proxy: parseProxy(proxy),
      fs: {
        strict: true,
      },
    },
    build: {
      rollupOptions: {
        external: rollupExternals || [],
        output: rollupExternals.length
          ? {
              globals,
              //   manualChunks: undefined,
            }
          : {},
      },
    },
    resolve: {
      alias: {
        '~': `${path.resolve(process.cwd(), 'src')}/`,
      },
    },
  }
  viteConfig = mergeConfig(viteConfig, overrides)
  return viteConfig
}

/**
 * proxy field parsing
 * @param proxyList
 * @returns
 */
function parseProxy(
  proxyList: ManifestServerProxy = [],
): Recordable<ProxyOptions> {
  const proxyObj: Recordable<ProxyOptions> = {}
  for (const proxy of proxyList) {
    const { url, target, secure, changeOrigin, pathRewrite = [] } = proxy
    proxyObj[url] = {
      target,
      secure,
      changeOrigin,
      rewrite: (path) => {
        if (!pathRewrite) {
          return path
        }
        const { origin, pathname = '', search = '' } = new URL(path)
        let _path = pathname
        pathRewrite.forEach(({ regular, replacement }) => {
          _path = _path.replace(new RegExp(regular, 'g'), replacement)
        })
        return origin + _path + search
      },
    }
  }

  return proxyObj
}
