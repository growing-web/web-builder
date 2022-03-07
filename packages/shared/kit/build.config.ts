import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: ['./src/index'],
  declaration: true,
  externals: ['@growing-web/web-builder-types'],
})
