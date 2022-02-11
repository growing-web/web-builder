import type { InlineConfig, ProxyOptions } from 'vite'
import type {
  ManifestServerProxy,
  WebBuilderMode,
} from '@growing-web/web-builder-types'
import { mergeConfig } from 'vite'
import { URL } from 'url'
import { parse } from '@growing-web/web-builder-schema'
import { AbstractAdapter } from '@growing-web/web-builder-bundler-abstract'
import path from 'pathe'

export class ViteAdapter extends AbstractAdapter<InlineConfig> {
  async configAdapter(mode: WebBuilderMode) {
    const config = await parse({ mode })

    let viteConfig: InlineConfig = {
      base: '/',
    }

    if (config) {
      const {
        server = {},
        // entry,
        externals = {},
        publicPath: base = '/',
      } = config

      const { port = 3600, host = true, proxy = [] } = server

      const rollupExternals = Object.keys(externals)
      const globals = externals

      const inlineConfig: InlineConfig = {
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
          proxy: this.parseProxy(proxy),
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
          target: 'chrome70',
          cssTarget: 'chrome70',
          brotliSize: false,
          chunkSizeWarningLimit: 2048,
        },
        resolve: {
          alias: {
            '~': `${path.resolve(process.cwd(), 'src')}/`,
          },
        },
      }
      viteConfig = mergeConfig(viteConfig, inlineConfig)
    }
    return viteConfig
  }

  /**
   * proxy field parsing
   * @param proxyList
   * @returns
   */
  parseProxy(
    proxyList: ManifestServerProxy = [],
  ): Record<string, ProxyOptions> {
    const proxyObj: Record<string, ProxyOptions> = {}
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
}
