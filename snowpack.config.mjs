/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: { src: '/' },
  plugins: [['snowpack-plugin-svgr']],
  routes: [],
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    manifest: true
  },
  packageOptions: {},
  devOptions: {},
  buildOptions: {}
}