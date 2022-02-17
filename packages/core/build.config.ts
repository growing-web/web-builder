import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: ['./src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  externals: [
    '@growing-web/web-builder-types',
    'vite',
    '@growing-web/web-builder-bundler-vite',
    '@growing-web/web-builder-bundler-webpack',
  ],
})
