import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  externals: ['vite', 'rollup', '@growing-web/web-builder-constants'],
})
