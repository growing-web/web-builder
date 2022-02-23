import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: ['src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  externals: [
    'vite',
    '@growing-web/web-builder-types',
    '@growing-web/web-builder-toolkit',
    '@growing-web/web-builder-schema',
  ],
})
