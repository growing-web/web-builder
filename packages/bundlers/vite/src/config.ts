import type { InlineConfig, ProxyOptions } from 'vite'
import type {
  ManifestServerProxy,
  WebBuilder,
  WebBuilderManifest,
  WebBuilderTarget,
  FrameworkType,
  Recordable,
  WebBuilderFormat,
} from '@growing-web/web-builder-types'
import {
  loadFrameworkTypeAndVersion,
  logger,
  _,
  path,
} from '@growing-web/web-builder-toolkit'
import {
  createReactPreset,
  createVuePreset,
  createLibPreset,
  createPReactPreset,
} from './presets'
import { createPlugins } from './plugins'
import { mergeConfig } from 'vite'
import { getPort } from 'get-port-please'

export async function createConfig(webBuilder: WebBuilder) {
  if (!webBuilder.service) {
    logger.error('failed to initialize service.')
    process.exit(1)
  }

  const hmrPortDefault = 23456 // Vite's default HMR port
  const hmrPort = await getPort({
    port: hmrPortDefault,
    ports: Array.from({ length: 20 }, (_, i) => hmrPortDefault + 1 + i),
  })

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
    sourcemap,
  } = manifest

  let outputDir = outDir

  const { server: { open, https } = {}, build: { clean, watch } = {} } =
    userConfig

  const { port = 5500, host = true, proxy = [] } = server

  // support ../xxxx
  if (!path.isAbsolute(outputDir)) {
    outputDir = path.resolve(rootDir, outDir)
  }

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

  // input
  //   const input: Recordable<string> = {}
  //   for (const [key, value] of Object.entries(entries)) {
  //     input[key] = path.resolve(rootDir, value)
  //   }

  let viteConfig: InlineConfig = {}

  const overrides: InlineConfig = {
    configFile: false,
    cacheDir: 'node_modules/.web-builder',
    // logLevel: 'warn',
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
      hmr: {
        clientPort: hmrPort,
        port: hmrPort,
      },
      open,
      https,
      port,
      host,
      proxy: parseProxy(proxy),
      fs: {
        strict: false,
      },
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      emptyOutDir: clean,
      sourcemap,
      watch: watch ? {} : null,
      outDir: outputDir,
      rollupOptions: {
        // input,
        external: rollupExternals || [],
        output: rollupExternals.length
          ? {
              globals,
              //   manualChunks: undefined,
            }
          : {},
      },
    },
    plugins: createPlugins(webBuilder, userConfig, mode),
  }
  viteConfig = mergeConfig(viteConfig, overrides)

  const frameworkConfig = await configByFramework(rootDir)
  viteConfig = mergeConfig(viteConfig, frameworkConfig)

  return viteConfig
}

// Do the corresponding configuration according to the target field configured in project-manifest.json
export async function createBuildLibConfig(webBuilder: WebBuilder) {
  const { rootDir = path.resolve('.'), manifest = {} as WebBuilderManifest } =
    webBuilder.service

  const { entries, formats, exports: _exports } = manifest

  const entryKeys = Object.keys(entries)

  const target: WebBuilderTarget = entryKeys.some((key) =>
    entries[key].endsWith('.html'),
  )
    ? 'app'
    : 'lib'

  const configList: any[] = []

  if (target === 'app') {
    return []
  }

  for (const key of entryKeys) {
    let entry = ''
    let entryFormat: WebBuilderFormat[] = []
    entry = entries[key]
    entryFormat = formats?.[key] ?? ['cjs', 'esm', 'system']
    const config: Record<WebBuilderTarget, any> = {
      lib: await createLibPreset({
        rootDir,
        entry,
        entryKey: key,
        format: entryFormat,
        _exports,
      }),
      app: null,
    }
    configList.push(config[target])
  }
  return configList.filter(Boolean)
}

/**
 * Automatically adapt the plug-in according to the framework used, currently only supports vue, react
 * @param webBuilder
 * @returns
 */
async function configByFramework(rootDir: string) {
  const { framework, version } = await loadFrameworkTypeAndVersion(rootDir)

  const config: Record<FrameworkType, any> = {
    react: createReactPreset(),
    preact: createPReactPreset(),
    vue: createVuePreset(version),
    svelte: null,
    lit: null,
    vanilla: null,
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
