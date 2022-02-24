import type {
  WebBuilder,
  WebBuilderStats,
  Recordable,
} from '@growing-web/web-builder-types'
import { createBuildLibConfig, createConfig } from './config'
import { build, mergeConfig } from 'vite'
import {
  readPackageJSON,
  colors,
  fs,
  path,
} from '@growing-web/web-builder-toolkit'

export function buildBundler(webBuilder: WebBuilder) {
  return async () => {
    const startTime = +new Date()

    const buildStats: WebBuilderStats['build'] = {
      time: 0,
      startTime,
    }

    const config = await createConfig(webBuilder)

    // support multiple entry build
    const libConfigs = await createBuildLibConfig(webBuilder)
    const configs: any[] = []
    if (libConfigs.length === 0) {
      configs.push(config)
    } else {
      libConfigs.forEach((conf) => {
        configs.push(mergeConfig(config, conf))
      })
    }

    try {
      const stats = await Promise.all(configs.map((c) => build(c)))
      // TODO multiple stats
      buildStats.stats = stats[0] as any

      await buildImportMap(webBuilder, config.build?.outDir)

      buildStats.endTime = +new Date()
      buildStats.time = +new Date() - startTime
    } catch (error: any) {
      buildStats.error = error
      throw error
    } finally {
      webBuilder.service.execStat ||= { build: buildStats }
    }
    return webBuilder.service.execStat
  }
}

async function buildImportMap(webBuilder: WebBuilder, outDir?: string) {
  const { rootDir, manifest } = webBuilder.service
  const { importmap, exports: _exports = {} } = manifest || {}

  if (importmap) {
    const pkg = await readPackageJSON(rootDir)
    const esmFiles: [string, string][] = []
    const systemFiles: [string, string][] = []
    const { packageName = pkg.name, filename: filenameMap } = importmap
    for (const key of Object.keys(_exports)) {
      esmFiles.push([key, _exports[key].esm!])
      systemFiles.push([key, _exports[key].system!])
    }

    const esmImportMap: Recordable<string> = {}
    const systemImportMap: Recordable<string> = {}

    const getKey = (key: string) =>
      packageName + (key === 'index' ? '' : `/${key}`)

    esmFiles.forEach(([key, value]) => {
      esmImportMap[`${getKey(key)}`] = value
    })

    systemFiles.forEach(([key, value]) => {
      systemImportMap[`${getKey(key)}`] = value
    })

    const { esm: esmFilename, system: systemFilename } = filenameMap || {}

    if (!outDir) {
      return
    }

    await Promise.all([
      writeImportMapFile(outDir, esmFilename, esmImportMap),
      writeImportMapFile(outDir, systemFilename, systemImportMap),
    ])
  }
}

async function writeImportMapFile(
  outDir?: string,
  filename?: string,
  data?: Recordable<any>,
) {
  if (outDir && filename) {
    fs.writeJSON(
      path.resolve(outDir, filename),
      {
        imports: data,
      },
      { spaces: 2 },
    )
    console.log(
      `${colors.green('created')}: ${colors.dim(
        path.relative(process.cwd(), outDir) + '/',
      )}${filename}`,
    )
  }
}
