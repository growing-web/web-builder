import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  externals: [
    'vite',
    'rollup',
    'consola',
    '@growing-web/web-builder-constants',
    'webpack',
    'unplugin',
    '@web/dev-server-core',
  ],
})
