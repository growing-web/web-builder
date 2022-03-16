import type {
  WebBuilder,
  Recordable,
  ManifestConfig,
} from '@growing-web/web-builder-types'
import {
  WEB_PROJECT_CONFIG_FILES,
  WEB_SITE_CONFIG,
  WEB_SITE_WORKSPACE,
} from '@growing-web/web-builder-constants'
import {
  fs,
  path,
  readPackageJSON,
  JSONReader,
  findWorkspacePackages,
  findMonorepoRoot,
  minimatch,
  createSymlink,
} from '@growing-web/web-builder-kit'

type ImportMap = { imports: Recordable<any> }

interface PackageMeta {
  data: ManifestConfig
  file: string
  dir: string
  name: string | undefined
  isRoot: boolean
}

export async function bundlerWebSite(webBuilder: WebBuilder) {
  const { mode, rootDir } = webBuilder.service

  if (!fs.existsSync(path.resolve(rootDir, WEB_SITE_CONFIG))) {
    return
  }

  const { config: { entries = [] } = {} } = webBuilder.service

  const entry = entries?.[0]

  let dest = ''
  const outputDir = entry.output?.dir ?? DEFAULT_OUTPUT_DIR
  if (outputDir && !path.isAbsolute(outputDir)) {
    dest = path.resolve(rootDir, outputDir)
  }

  const cwd = process.cwd()
  await createSymlink(
    path.resolve(cwd, '../'),
    path.resolve(cwd, WEB_SITE_WORKSPACE),
    'dir',
  )

  await generateImportMap(dest, rootDir, mode)
}

async function generateImportMap(
  dest: string,
  rootDir: string,
  mode: string | undefined,
) {
  const webSiteJson = JSONReader(WEB_SITE_CONFIG)

  const isDevelopment = (mode || process.env.NODE_ENV) === 'development'

  const publicPath = webSiteJson.publicPath || '/'

  const manifestFilename = isDevelopment
    ? EXPORTS_MANIFEST
    : SYSTEM_EXPORTS_MANIFEST

  const output = path.resolve(dest, manifestFilename)

  const workspaceRoot = await findMonorepoRoot(rootDir)
  if (!workspaceRoot || !WEB_PROJECT_CONFIG_FILES?.[0]) {
    return
  }

  const imports = webSiteJson?.importmap?.imports ?? {}

  if (isDevelopment) {
    const devImportmap = await generateDevImportmap(workspaceRoot, imports)
    fs.writeJSONSync(output, devImportmap)
  } else {
    const prodImportmap = await generateProdImportmap({
      workspaceRoot,
      imports,
      manifestFilename,
      publicPath,
      outDir: dest,
    })
    fs.writeJSONSync(output, prodImportmap)
  }
}

function getImportmapValue(
  name: string,
  value: string,
  manifestFilename: string,
  dest: string,
) {
  if (value.includes('workspace:*')) {
    const importmap = JSONReader(
      path.resolve(dest, normalizeBasename(name), manifestFilename),
    )

    // FIXME support mpa
    return importmap.exports['.']
  }

  if (isAbsolutePath(value)) {
    return value
  }

  throw new Error(`Cannot import: {"${name}": "${value}"}`)
}

function isAbsolutePath(p: string) {
  return /^(\/|https?)/.test(p)
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

/**
 * Generate the importmap required by the local development environment
 * @param root
 * @returns
 */
async function generateDevImportmap(
  workspaceRoot: string,
  imports: Recordable<any>,
): Promise<ImportMap> {
  const packageMeta = await findWorkspacesInfo(workspaceRoot)

  const convertedImports = await convertDevImports({
    workspaceRoot,
    imports,
    packageMeta,
  })

  const devImports: Recordable<string> = {}
  packageMeta.forEach(({ data, name }) => {
    const { port, host = 'localhost' } = data.server || {}
    const { entries } = data || {}
    const entry = entries?.[0]?.input
    if (port && name && entry) {
      let key = `${host}:${port}/${entry}`
      if (!key.startsWith('http')) {
        if (key.startsWith('//')) {
          key = `http:${key}`
        } else {
          key = `http://${key}`
        }
      }
      devImports[name] = key
    }
  })
  return { imports: { ...convertedImports, ...devImports } }
}

async function generateProdImportmap({
  workspaceRoot,
  imports,
  publicPath,
  outDir,
  manifestFilename,
}: {
  workspaceRoot: string
  imports: Recordable<any>
  publicPath: string
  outDir: string
  manifestFilename: string
}) {
  const packageMeta = await findWorkspacesInfo(workspaceRoot)

  const convertedImports = await convertProdImports({
    imports,
    packageMeta,
    outDir,
    manifestFilename,
    publicPath,
  })
  return convertedImports
}

async function convertProdImports({
  imports,
  packageMeta,
  outDir,
  manifestFilename,
  publicPath,
}: {
  outDir: string
  imports: Recordable<any>
  packageMeta: PackageMeta[]
  publicPath: string
  manifestFilename: string
}): Promise<ImportMap> {
  const names = packageMeta.map((item) => item.name)
  const resultMap: Recordable<any> = {}

  for (const [key, value] of Object.entries(imports)) {
    if (!key.trim().endsWith('*')) {
      const val = names.find((item) => item === key)
      if (val) {
        resultMap[key] = toPublicPath(
          publicPath,
          key,
          getImportmapValue(key, value, manifestFilename, outDir),
        )
      }
    } else {
      names.forEach((name) => {
        if (!name) {
          return
        }
        const match = minimatch(name, key)
        if (match) {
          resultMap[name] = toPublicPath(
            publicPath,
            name,
            getImportmapValue(name, value, manifestFilename, outDir),
          )
        }
      })
    }
  }
  return { imports: resultMap }
}

/**
 *
 * @param imports Convert workspace content
 */
async function convertDevImports({
  workspaceRoot,
  imports,
  packageMeta,
}: {
  workspaceRoot: string

  imports: Recordable<any>
  packageMeta: PackageMeta[]
}) {
  const resultMap: Recordable<any> = {}

  for (const [key, value] of Object.entries(imports)) {
    if (!key.trim().endsWith('*')) {
      packageMeta.forEach(({ dir, name, data }) => {
        if (value.trim().startsWith('workspace:*')) {
          if (path.basename(dir) === key || name === key) {
            const projectDir = path.join(
              WEB_SITE_WORKSPACE,
              path.relative(workspaceRoot, dir),
            )
            resultMap[key] = covertDevWorkspace(projectDir, data)
          }
        } else {
          resultMap[key] = value
        }
      })
    } else {
      packageMeta.forEach(({ dir, name, data }) => {
        if (!name) {
          return
        }
        if (!value.trim().startsWith('workspace:*')) {
          throw new Error(`Cannot import: {"${name}": "${value}"}`)
        }

        const projectDir = path.join(
          `/${WEB_SITE_WORKSPACE}`,
          path.relative(workspaceRoot, dir),
        )

        const match = minimatch(name, key)
        if (match) {
          resultMap[name] = covertDevWorkspace(projectDir, data)
        }
      })
    }
  }
  return resultMap
}

function covertDevWorkspace(projectDir: string, data: ManifestConfig) {
  const { entries } = data || {}
  const entry = entries[0]?.input
  if (entry) {
    return path.join(projectDir, entry)
  }
  return ''
}

export async function findWorkspacesInfo(root: string) {
  const dirs = await findWorkspacePackages(root)
  const projectFilename = WEB_PROJECT_CONFIG_FILES?.[0]

  const workspaceDirs: string[] = []
  dirs.forEach((dir) => {
    const projectFilePath = path.resolve(dir, projectFilename)
    if (fs.existsSync(projectFilePath)) {
      workspaceDirs.push(projectFilePath)
    }
  })

  let packageMeta = await Promise.all(
    workspaceDirs.map(async (file) => {
      const data: ManifestConfig = fs.readJSONSync(file)
      const dir = path.dirname(file)
      const pkg = await readPackageJSON(dir)
      let isRoot = false
      const webSiteFile = path.resolve(dir, WEB_SITE_CONFIG)
      if (fs.existsSync(webSiteFile)) {
        isRoot = true
      }
      return { data, file, dir, name: pkg.name, isRoot }
    }),
  )

  packageMeta = packageMeta.filter((item) => {
    return !item.isRoot
  })

  if (!packageMeta || packageMeta.length === 0) {
    return []
  }
  return packageMeta
}
