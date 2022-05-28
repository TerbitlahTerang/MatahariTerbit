/** @type {import('snowpack').SnowpackUserConfig } */
export default {
    mount: { src: '/' },
    plugins: [
        ['snowpack-plugin-svgr'],
        ['@snowpack/plugin-sass'],
        ['snowpack-plugin-markdown', {}]
    ],
    routes: [],
    optimize: {
        bundle: true,
        minify: true,
        target: 'es2018'
    },
    packageOptions: {},
    devOptions: {},
    buildOptions: {
        treeshake: true,
    }
}