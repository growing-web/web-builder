export const USER_CONFIG_FILES = [
  'web-builder.config.ts',
  'web-builder.config.js',
  'web-builder.config.mjs',
  'web-builder.config.cjs',
  'web-builder.config.json',
]

export const WEB_PROJECT_CONFIG_FILES = ['web-project.json']

export const WEB_SITE_CONFIG = 'web-site.json'
export const WEB_SITE_WORKSPACE = 'workspace'

export const DEFAULT_SERVER_PORT = 6060
export const DEFAULT_SCHEMA_VERSION = '1.0.0'
export const DEFAULT_ENTRY_FILE = 'src/index'
export const DEFAULT_OUTPUT_FORMAT = ['esm' as const]
export const DEFAULT_OUTPUT_DIR = 'dist'
export const DEFAULT_CACHE_DIR = 'node_modules/.web-builder/'
export const DEFAULT_CACHE_DEP_DIR = `${DEFAULT_CACHE_DIR}/dep`
export const DEFAULT_CACHE_CONFIG_FILE = `${DEFAULT_CACHE_DIR}/__CONFIG__.json`

export const TARGET_LIB = 'lib'
export const TARGET_APP = 'app'

export const LIB_ENTRIES_EXT = ['ts', 'js', 'cjs', 'mjs', 'tsx', 'jsx']
