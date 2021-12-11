/** @type {import("snowpack").SnowpackUserConfig } */
process.env.SNOWPACK_PUBLIC_PACKAGE_VERSION = '1.0.0'
process.env.SNOWPACK_PUBLIC_SERVICE_WORKER = 'sw.js'

export default {
  mount: { src: '/' },
  plugins: [['snowpack-plugin-svgr'],[
    '@snowpack/plugin-typescript',
    [
      '@snowpack/plugin-webpack',
      {
        extendConfig: (config) => {
          const { glob } = require('glob')
          const { InjectManifest } = require('workbox-webpack-plugin')
          const additionalManifestEntries = [
            ...glob.sync('*.{png,html,json,txt}', { cwd: './build' })
          ].map((e) => ({ url: e, revision: process.env.SNOWPACK_PUBLIC_PACKAGE_VERSION }))

          config.plugins.push(
            new InjectManifest({
              'mode': 'development',
              'additionalManifestEntries': additionalManifestEntries,
              'swSrc': 'serviceWorker.js',
              'swDest': process.env.SNOWPACK_PUBLIC_SERVICE_WORKER
            })
          )
          return config
        }
      }
    ]
  ]
  ],
  routes: [
    {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
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