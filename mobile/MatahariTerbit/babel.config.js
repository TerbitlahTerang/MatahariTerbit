module.exports = function(api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This forces Babel to handle the TypeScript helpers (like __extends)
      // globally so they aren't 'undefined'
      ['@babel/plugin-transform-runtime', { helpers: true }]
    ]
  }
}