/** @type {import('snowpack').SnowpackUserConfig } */
export default {
    mount: { src: '/' },
    plugins: [
        ['snowpack-plugin-svgr'],
        ['@snowpack/plugin-sass'],
        ['snowpack-plugin-markdown', {}]
    ],
    routes: [],
    optimize: {},
    packageOptions: {},
    devOptions: {},
    buildOptions: {
        treeshake: true,
    }
}