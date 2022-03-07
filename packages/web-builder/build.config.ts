import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: ['./src/index', 'src/actions/dev/forkDev'],
  declaration: true,
  externals: ['@growing-web/web-builder-types'],
})
