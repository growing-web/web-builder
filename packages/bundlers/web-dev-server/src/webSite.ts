import type {
  WebBuilder,
  WebSiteOption,
  Recordable,
} from '@growing-web/web-builder-types'
import {
  EXPORTS_MANIFEST,
  SYSTEM_EXPORTS_MANIFEST,
} from '@growing-web/web-builder-constants'
import { fs, path, readPackageJSON } from '@growing-web/web-builder-kit'

type ImportMap = { imports: Recordable<any> }

export async function bundlerWebSite(webBuilder: WebBuilder) {
  const { mode, rootDir, config: { webSite } = {} } = webBuilder.service

  if (!webSite) {
    return
  }

  await buildImportMap(webSite, rootDir, mode)
}

async function buildImportMap(
  webSite: WebSiteOption,
  rootDir: string,
  mode: string | undefined,
) {
  const {
    outputDir = 'dist',
    configFilename: { dev = 'web-site.dev.json', prod = 'web-site.json' } = {},
  } = webSite

  const [devWebSiteJson, prodWebSiteJson] = await Promise.all([
    JSONReader(dev),
    JSONReader(prod),
  ])
  const isDevelopment = (mode || process.env.NODE_ENV) === 'development'

  const publicPath =
    (isDevelopment
      ? devWebSiteJson.publicPath || prodWebSiteJson.publicPath
      : prodWebSiteJson.publicPath) || '/'

  const exportsManifestFilename = isDevelopment
    ? EXPORTS_MANIFEST
    : SYSTEM_EXPORTS_MANIFEST

  const dest = path.resolve(rootDir, outputDir)
  const output = path.resolve(dest, exportsManifestFilename)

  const pkgJson = await readPackageJSON(rootDir)

  const importmap = assignImportMap(
    { imports: {} },
    pkgJson,
    exportsManifestFilename,
    prodWebSiteJson,
    publicPath,
    dest,
  )

  if (isDevelopment && devWebSiteJson.importmap) {
    const devImportmap = devWebSiteJson.importmap
    if (devImportmap && devImportmap.imports) {
      Object.keys(devImportmap.imports).forEach((name) => {
        importmap.imports[name] = devImportmap.imports[name]
      })
    }
  }
  fs.writeJSONSync(output, importmap)
}

function assignImportMap(
  target: ImportMap,
  pkg: Recordable<any>,
  exportsManifestFilename: string,
  source: ImportMap,
  publicPath: string,
  dest: string,
) {
  Object.keys(source.imports).forEach((name) => {
    const value = source.imports[name]
    dependenciesFilter(pkg.dependencies, name).forEach((name) => {
      target.imports[name] = toPublicPath(
        publicPath,
        name,
        getImportmapValue(name, value, exportsManifestFilename, dest),
      )
    })
  })
  return target
}

function getImportmapValue(
  name: string,
  value: string,
  exportsManifestFilename: string,
  dest: string,
) {
  if (value.includes('workspace:*')) {
    const importmap = JSONReader(
      `${dest}${normalizeBasename(name)}/${exportsManifestFilename}`,
    )
    return importmap.imports[name]
  }

  if (isAbsolutePath(value)) {
    return value
  }

  throw new Error(`Cannot import: {"${name}": "${value}"}`)
}

function dependenciesFilter(dependencies: Recordable<any>, name: string) {
  const results = []

  if (name.includes('*')) {
    const regx = new RegExp(
      '^' +
        name.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') +
        '$',
    )

    Object.keys(dependencies).forEach((name) => {
      if (regx.test(name)) {
        results.push(name)
      }
    })
  } else {
    results.push(name)
  }

  return results
}

function isAbsolutePath(p: string) {
  return path.isAbsolute(p)
}

function toPublicPath(publicPath: string, name: string, path: string) {
  if (isAbsolutePath(path)) {
    return path
  }
  return `${publicPath}${normalizeBasename(name)}/${path}`
}

function normalizeBasename(name: string) {
  return name.replace('@', '')
}

function JSONReader(filename: string) {
  try {
    return fs.readJSONSync(filename, { encoding: 'utf-8' })
  } catch (error) {
    return {}
  }
}
