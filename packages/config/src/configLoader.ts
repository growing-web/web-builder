import JoyCon from 'joycon'
import { bundleRequire } from 'bundle-require'
import {
  colors,
  path,
  fs,
  isFunction,
  isObject,
  jsoncParse,
} from '@growing-web/web-builder-kit'

export interface ConfigLoaderOptions {
  rootDir?: string
  functionParams?: Record<string, any>
  configFiles: string[]
}

/**
 * Load custom configuration
 */
export async function loadConfig<T extends object>(
  options: ConfigLoaderOptions,
): Promise<T> {
  const { rootDir = process.cwd(), functionParams = {}, configFiles } = options
  const configJoycon = new JoyCon()

  const configPath = await configJoycon.resolve(
    configFiles,
    rootDir,
    path.parse(rootDir).root,
  )
  if (configPath) {
    if (configPath.endsWith('.json')) {
      const data = await loadJson(configPath)
      return data || {}
    }

    const config = await bundleRequire({
      filepath: configPath,
    })

    const ret = config.mod.default || config.mod

    let data: T = {} as T
    if (isFunction(ret)) {
      data = await ret(functionParams)
    } else if (isObject(ret)) {
      data = ret as T
    }

    if (!isObject(ret)) {
      throw new Error(
        `The content of ${colors.cyan(
          `${configPath}`,
        )} or the return value type of the function needs to be an object type`,
      )
    }
    return data
  }
  return {} as T
}

async function loadJson(filepath: string) {
  try {
    return jsoncParse(await fs.promises.readFile(filepath, 'utf8'))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to parse ${path.relative(process.cwd(), filepath)}: ${
          error.message
        }`,
      )
    } else {
      throw error
    }
  }
}
