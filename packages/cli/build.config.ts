import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/cli'],
  externals: ['c12', 'execa', 'esbuild', 'cac'],
  rollup: {
    inlineDependencies: true,
  },
})
