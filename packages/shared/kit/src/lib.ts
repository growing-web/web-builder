import colors from 'picocolors'
import fs from 'fs-extra'
import * as path from 'pathe'
import { defu as merge } from 'defu'
import semver from 'semver'
import minimatch from 'minimatch'

export { fs, merge, minimatch, path, semver, colors }

export {
  get,
  isString,
  isObject,
  isFunction,
  union,
  isUndefined,
} from 'lodash-es'
