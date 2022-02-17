import type { InlineConfig, ProxyOptions } from 'vite'
import type {
  ManifestServerProxy,
  WebBuilder,
  WebBuilderManifest,
  WebBuilderTarget,
  FrameworkType,
  Recordable,
} from '@growing-web/web-builder-types'
import {
  loadFrameworkTypeAndVersion,
  logger,
} from '@growing-web/web-builder-toolkit'
import {
  createReactPreset,
  createVuePreset,
  createLibPreset,
  createPReactPreset,
} from './presets'
import { createPlugins } from './plugins'
import { mergeConfig } from 'vite'
import path from 'pathe'

export async function createConfig(webBuilder: WebBuilder) {
  if (!webBuilder.service) {
    logger.error('Failed to initialize service.')
    process.exit(1)
  }

  const {
    mode,
    rootDir = path.resolve('.'),
    userConfig = {},
    manifest = {} as WebBuilderManifest,
  } = webBuilder.service

  const {
    server = {},
    externals = {},
    publicPath: base = '/',
    outDir = 'dist',
  } = manifest

  const {
    server: { open, https } = {},
    build: { clean, sourcemap, watch } = {},
  } = userConfig

  const { port = 5500, host = true, proxy = [] } = server

  // externals
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

  let viteConfig: InlineConfig = {
    base: '/',
  }

  const overrides: InlineConfig = {
    root: rootDir,
    base,
    resolve: {
      alias: {
        '~': `${path.resolve(rootDir, 'src')}/`,
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      open,
      https,
      port,
      host,
      proxy: parseProxy(proxy),
      fs: {
        strict: true,
      },
    },
    build: {
      emptyOutDir: clean,
      sourcemap,
      watch: watch ? {} : null,
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
    plugins: createPlugins(userConfig, mode),
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
    svelte: null,
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
