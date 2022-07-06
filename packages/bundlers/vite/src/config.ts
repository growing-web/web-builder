import type { InlineConfig } from 'vite'
import type {
  WebBuilder,
  WebBuilderTarget,
  FrameworkType,
  ManifestConfigEntry,
  Recordable,
  PluginInstance,
} from '@growing-web/web-builder-types'
import { createLogger, path, resolveProxy } from '@growing-web/web-builder-kit'
import {
  TARGET_LIB,
  TARGET_APP,
  DEFAULT_CACHE_DEP_DIR,
  LIB_ENTRIES_EXT,
  DEFAULT_OUTPUT_DIR,
  DEFAULT_OUTPUT_FORMAT,
} from '@growing-web/web-builder-constants'
import { createReactPreset, createVuePreset } from './presets'
import { createPlugins } from './plugins'
import { mergeConfig } from 'vite'
import fs from 'fs-extra'

const OUTPUT_FILENAME = ['assetFileNames', 'chunkFileNames', 'entryFileNames']

export async function createConfig(
  webBuilder: WebBuilder,
  command: 'dev' | 'build',
) {
  const logger = createLogger()
  if (!webBuilder.service) {
    logger.error('failed to initialize service.')
    process.exit(1)
  }

  const { mode, rootDir = path.resolve('.'), config } = webBuilder.service

  if (!config) {
    return []
  }

  const resolveRoot = (p: string) => path.resolve(rootDir, p)

  const {
    watch,
    pluginInstance = [],
    entries = [],
    server: { port, open, https, host, proxy = [], strictPort = false } = {},
    build: { clean } = {},
  } = config

  const viteConfigList: InlineConfig[] = []

  for (const entry of entries) {
    const { publicPath = '/', output = {} } = entry
    const {
      dir = DEFAULT_OUTPUT_DIR,
      sourcemap = false,
      globals = {},
      formats,
      banner: { footer, header } = {},
    } = output

    const { externals = [] } = output

    if (externals.includes('*')) {
      try {
        const json = fs.readJSONSync(path.join(rootDir, 'package.json'), {
          encoding: 'utf-8',
        })
        const deps = Object.keys(json.dependencies || {})
        externals.push(...deps)
      } catch (error) {
        // TODO
      }
    }

    let outputDir = dir

    const isLib = LIB_ENTRIES_EXT.some((item) =>
      entry.input.endsWith(`.${item}`),
    )
    const target: WebBuilderTarget = isLib ? TARGET_LIB : TARGET_APP

    const filenamesMap: Recordable<any> = {}

    const setFormats = formats && formats.length > 1

    OUTPUT_FILENAME.forEach((item) => {
      let filename = (output as Recordable<any>)?.[item]
      if (filename) {
        // ${name}.js => [name].js
        filename = filename.replace(/\$\{([^}]+)\}/g, (_: any, $1: string) => {
          return `[${$1}]`
        })

        filenamesMap[item] = filename
      } else if (item === 'entryFileNames') {
        filenamesMap[item] =
          target === TARGET_LIB
            ? setFormats
              ? '[name].[format].js'
              : '[name].js'
            : 'assets/[name]-[hash]-[format].js'
      }
    })

    // support ../xxxx
    if (dir && outputDir && !path.isAbsolute(outputDir)) {
      outputDir = resolveRoot(dir)
    }

    let viteConfig: InlineConfig = {
      configFile: false,
      //   logLevel: 'warn',
      cacheDir: DEFAULT_CACHE_DEP_DIR,
      root: rootDir,
      base: publicPath,
      resolve: {
        alias: {
          '~': `${resolveRoot('src')}/`,
        },
      },
      define: {
        'process.env': process.env,
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
        strictPort,
        https,
        port,
        host: ['localhost', '127.0.0.1'].includes(host!) ? true : host,
        proxy: resolveProxy(proxy),
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
          external: externals,
          output: {
            globals,
            ...filenamesMap,
            banner: header,
            footer,
          },
        },
      },
    }

    const pluginOverrides: InlineConfig = {
      plugins: [
        ...createPlugins({
          webBuilder,
          entry,
          config,
          mode,
        }),
        ...(pluginInstance as PluginInstance).vite,
      ],
    }

    const [frameworkConfig, libConfig] = await Promise.all([
      resolveFrameworkConfig(webBuilder),
      resoveLibConfig(rootDir, entry, target),
    ])

    viteConfig = composeViteConfig(
      viteConfig,
      pluginOverrides,
      frameworkConfig,
      command === 'build' ? libConfig : {},
    )

    viteConfigList.push(viteConfig)
  }

  return viteConfigList
}

// Do the corresponding configuration according to the target field configured in project-manifest.json
export async function resoveLibConfig(
  rootDir: string,
  entry: ManifestConfigEntry,
  target: WebBuilderTarget,
) {
  const {
    input,
    output: {
      meta: { umdName = '' } = {},
      formats = DEFAULT_OUTPUT_FORMAT,
    } = {},
  } = entry

  const config: Record<WebBuilderTarget, InlineConfig> = {
    [TARGET_LIB]: {
      build: {
        lib: {
          name: umdName,
          entry: path.resolve(rootDir, input),
          formats: formats as any,
        },
      },
    },
    [TARGET_APP]: {},
  }

  return config[target]
}

/**
 * Automatically adapt the plug-in according to the framework used, currently only supports vue, react
 * @returns
 */
async function resolveFrameworkConfig(
  webBuilder: WebBuilder,
): Promise<InlineConfig> {
  const { frameworkType, frameworkVersion } = webBuilder.service

  const config: Record<FrameworkType, any> = {
    react: createReactPreset(),
    vue: createVuePreset(frameworkVersion),
    svelte: null,
    lit: null,
    vanilla: null,
  }

  return (await config[frameworkType!]) || {}
}

function composeViteConfig(...configs: InlineConfig[]) {
  let resultConfig: InlineConfig = {}
  for (const config of configs) {
    resultConfig = mergeConfig(resultConfig, config)
  }
  return resultConfig
}
