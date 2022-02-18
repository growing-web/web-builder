import type {
  WebBuilderMode,
  BundlerType,
  UserConfig,
} from '@growing-web/web-builder-types'
import JoyCon from 'joycon'
import path from 'pathe'
import fs from 'fs'
import _ from 'lodash'
import { bundleRequire } from 'bundle-require'
import { jsoncParse, logger, colors } from '@growing-web/web-builder-toolkit'
import { CONFIG_FILES } from '@growing-web/web-builder-constants'

/**
 * Load custom configuration
 * @param webBuilder
 */
export async function loadUserConfig(
  rootDir: string,
  bundlerType: BundlerType,
  mode?: WebBuilderMode,
) {
  const configJoycon = new JoyCon()
  const configPath = await configJoycon.resolve(
    CONFIG_FILES,
    rootDir,
    path.parse(rootDir).root,
  )
  if (configPath) {
    if (configPath.endsWith('.json')) {
      const data = await loadJson(configPath)
      if (data) {
        return { path: configPath, data: data as UserConfig, type: 'json' }
      }
      return {}
    }

    const config = await bundleRequire({
      filepath: configPath,
    })

    const ret = config.mod.default || config.mod
    let data: UserConfig = {}
    if (_.isFunction(ret)) {
      data = await ret({ mode, bundlerType })
    } else if (_.isObject(ret)) {
      data = ret
    }
    if (!_.isObject(data)) {
      logger.error(
        `The content of ${colors.cyan(
          `web-builder.config.{ts,js,mjs,json}`,
        )} or the return value type of the function needs to be an object type`,
      )
      process.exit(1)
    }
    return {
      path: configPath,
      data,
      type: 'js',
    }
  }
  return {}
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
