/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: { src: '/' },
  plugins: [['snowpack-plugin-svgr']],
  routes: [],
  optimize: {
    bundle: true,
    target: 'es2018',
  },
  packageOptions: {},
  devOptions: {},
  buildOptions: {}
}