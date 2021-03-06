import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: ['src/index'],
  declaration: true,
  externals: [
    '@growing-web/web-builder-types',
    '@growing-web/web-builder-constants',
    '@growing-web/web-builder-kit',
    'unplugin',
  ],
})
