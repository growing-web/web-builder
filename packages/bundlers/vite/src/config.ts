import type { InlineConfig, ProxyOptions } from 'vite'
import type {
  ManifestServerProxy,
  WebBuilder,
  WebBuilderTarget,
  FrameworkType,
  ManifestConfigEntry,
  Recordable,
} from '@growing-web/web-builder-types'
import {
  loadFrameworkTypeAndVersion,
  createLogger,
  path,
  fs,
} from '@growing-web/web-builder-kit'
import {
  createReactPreset,
  createVuePreset,
  createPReactPreset,
} from './presets'
import { createPlugins } from './plugins'
import { mergeConfig } from 'vite'
import { URL } from 'url'

export async function createConfig(webBuilder: WebBuilder) {
  const logger = createLogger()
  if (!webBuilder.service) {
    logger.error('failed to initialize service.')
    process.exit(1)
  }

  const { mode, rootDir = path.resolve('.'), config } = webBuilder.service

  if (!config) {
    return []
  }

  const {
    watch,
    entries = [],
    server: { port, open, https, host, proxy = [] } = {},
    build: { clean } = {},
  } = config

  const viteConfigList: InlineConfig[] = []

  let emptied = false

  for (const entry of entries) {
    const { publicPath = '/', output = {} } = entry
    const {
      dir = 'dist',
      externals = [],
      sourcemap = false,
      globals = {},
      banner: { footer, header } = {},
    } = output

    let outputDir = dir

    const libEntries = ['ts', 'js', 'cjs', 'mjs', 'tsx', 'jsx']
    const target: WebBuilderTarget = libEntries.some((item) =>
      entry.input.endsWith(`.${item}`),
    )
      ? 'lib'
      : 'app'

    const filenamesMap: Recordable<any> = {}

    ;['assetFileNames', 'chunkFileNames', 'entryFileNames'].forEach((item) => {
      const filename = (output as any)?.[item]
      if (filename) {
        filenamesMap[item] = filename
      } else if (item === 'entryFileNames') {
        filenamesMap[item] =
          target === 'lib'
            ? '[name]-[format].js'
            : 'assets/[name]-[hash]-[format].js'
      }
    })

    // support ../xxxx
    if (dir && outputDir && !path.isAbsolute(outputDir)) {
      outputDir = path.resolve(rootDir, dir)
    }
    if (clean && !emptied) {
      fs.emptyDirSync(outputDir)
      emptied = true
    }

    let viteConfig: InlineConfig = {
      configFile: false,
      cacheDir: 'node_modules/.web-builder',
      root: rootDir,
      base: publicPath,
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
          strict: false,
        },
      },
      build: {
        target: 'esnext',
        minify: 'terser',
        // emptyOutDir: clean,
        sourcemap,
        watch: watch ? {} : null,
        outDir: outputDir,
        rollupOptions: {
          external: externals.map((item) => RegExp(item)),
          output: {
            globals,
            ...filenamesMap,
            banner: header,
            footer,
          },
        },
      },
    }

    const overrides: InlineConfig = {
      plugins: createPlugins({
        webBuilder,
        entry,
        config,
        mode,
      }),
    }
    const [frameworkConfig, libConfig] = await Promise.all([
      resolveFrameworkConfig(rootDir),
      configLibConfig(rootDir, entry, target),
    ])

    viteConfig = composeViteConfig(
      viteConfig,
      overrides,
      frameworkConfig,
      libConfig,
    )
    viteConfigList.push(viteConfig)
  }

  return viteConfigList
}

// Do the corresponding configuration according to the target field configured in project-manifest.json
export async function configLibConfig(
  rootDir: string,
  entry: ManifestConfigEntry,
  target: WebBuilderTarget,
) {
  const {
    input,
    output: { meta: { umdName = '' } = {}, formats = ['es', 'system'] } = {},
  } = entry

  const config: Record<WebBuilderTarget, InlineConfig> = {
    lib: {
      build: {
        lib: {
          name: umdName,
          entry: path.resolve(rootDir, input),
          formats: formats as any,
        },
      },
    },
    app: {},
  }

  return config[target]
}

/**
 * Automatically adapt the plug-in according to the framework used, currently only supports vue, react
 * @returns
 */
async function resolveFrameworkConfig(rootDir: string): Promise<InlineConfig> {
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

function composeViteConfig(...configs: InlineConfig[]) {
  let resultConfig: InlineConfig = {}
  for (const config of configs) {
    resultConfig = mergeConfig(resultConfig, config)
  }
  return resultConfig
}

/**
 * proxy field parsing
 * @param proxyList
 * @returns
 */
function parseProxy(
  proxyList: ManifestServerProxy[] = [],
): Record<string, ProxyOptions> {
  const proxyMap: Recordable<ProxyOptions> = {}

  for (const proxy of proxyList) {
    const { url, target, secure, changeOrigin, pathRewrite = [] } = proxy
    proxyMap[url] = {
      target,
      secure,
      changeOrigin,
      rewrite: (path) => {
        if (!pathRewrite) {
          return path
        }

        const { origin, pathname = '', search = '' } = new URL(path)
        let p = pathname
        pathRewrite.forEach(({ regular, replacement }) => {
          p = p.replace(new RegExp(regular, 'g'), replacement)
        })
        return `${origin}${p}${search}`
      },
    }
  }

  return proxyMap
}
