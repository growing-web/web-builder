import colors from 'picocolors'
import fs from 'fs-extra'
import path from 'pathe'
import merge from 'defu'
import semver from 'semver'

export { fs, merge, path, semver, colors }

export {
  get,
  isString,
  isObject,
  isFunction,
  union,
  isUndefined,
} from 'lodash-es'
