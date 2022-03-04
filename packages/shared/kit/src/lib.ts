import colors from 'picocolors'
import fs from 'fs-extra'
import path from 'pathe'
import merge from 'defu'
import semver from 'semver'

import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import union from 'lodash/union'
import get from 'lodash/get'

export {
  fs,
  merge,
  path,
  semver,
  colors,
  // lodash
  get,
  isString,
  isObject,
  isFunction,
  union,
}
