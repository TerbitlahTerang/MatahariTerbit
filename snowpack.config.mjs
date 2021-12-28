/** @type {import('snowpack').SnowpackUserConfig } */
export default {
    mount: { src: '/' },
    plugins: [
        ['snowpack-plugin-svgr'],
        ['snowpack-plugin-markdown', {}]
    ],
    routes: [],
    optimize: {},
    packageOptions: {},
    devOptions: {},
    buildOptions: {
        bundle: true,
        minify: true,
        treeshake: true,
        manifest: true
    }
}