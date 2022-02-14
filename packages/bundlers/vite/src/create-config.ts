import type { InlineConfig, ProxyOptions } from 'vite'
import type {
  ManifestServerProxy,
  WebBuilder,
  WebBuilderManifest,
  WebBuilderTarget,
  FrameworkType,
  Recordable,
} from '@growing-web/web-builder-types'
import { loadFrameworkTypeAndVersion } from '@growing-web/web-builder-toolkit'
import { mergeConfig } from 'vite'
import {
  createReactPreset,
  createVuePreset,
  createLibPreset,
  createSveltePreset,
  createPReactPreset,
} from './presets'
import path from 'pathe'

export async function createConfig(webBuilder: WebBuilder) {
  const manifest = webBuilder.options?.manifest || ({} as WebBuilderManifest)
  const rootDir = webBuilder.options?.rootDir ?? path.resolve('.')

  const {
    server = {},
    externals = {},
    publicPath: base = '/',
    outDir = 'dist',
  } = manifest

  const { port, host, proxy } = server

  const rollupExternals: (string | RegExp)[] = []
  const globals: Recordable<string> = {}
  for (const key of Object.keys(externals)) {
    if (externals[key]) {
      rollupExternals.push(key)
      globals[key] = externals[key]
    } else {
      rollupExternals.push(new RegExp(key))
    }
  }

  //   const isUmd = formats.includes('umd') || formats.includes('iife')

  let viteConfig: InlineConfig = {
    base: '/',
  }

  const overrides: InlineConfig = {
    root: rootDir,
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
      outDir: outDir,
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

  const frameworkConfig = await configByFramework(rootDir)
  viteConfig = mergeConfig(viteConfig, frameworkConfig)

  const buildConfig = await configBuildTarget(rootDir, outDir, manifest)
  viteConfig = mergeConfig(viteConfig, buildConfig)
  return viteConfig
}

// Do the corresponding configuration according to the target field configured in project-manifest.json
async function configBuildTarget(
  rootDir: string,
  outDir: string,
  manifest: Partial<WebBuilderManifest>,
) {
  const { target = 'app' } = manifest
  const config: Record<WebBuilderTarget, any> = {
    lib: await createLibPreset(rootDir, outDir, manifest),
    app: null,
  }
  return config[target] || {}
}

/**
 * Automatically adapt the plug-in according to the framework used, currently only supports vue, react
 * @param webBuilder
 * @returns
 */
async function configByFramework(rootDir: string) {
  const { framework, version } = await loadFrameworkTypeAndVersion(rootDir)

  const config: Record<FrameworkType, any> = {
    vanilla: null,
    react: createReactPreset(),
    preact: createPReactPreset(),
    vue: createVuePreset(version),
    svelte: createSveltePreset(),
    lit: null,
  }

  return config[framework] || {}
}

/**
 * proxy field parsing
 * @param proxyList
 * @returns
 */
function parseProxy(
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
