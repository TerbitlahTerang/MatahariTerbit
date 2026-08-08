// Jest runs code as CommonJS, where `import.meta` is not valid syntax at runtime.
// This rewrites `import.meta.env` to `process.env` so Vite-style env var access
// (import.meta.env.VITE_X) keeps working under Jest.
module.exports = function transformImportMetaEnv() {
  return {
    name: 'transform-import-meta-env',
    visitor: {
      MemberExpression(path) {
        const { object, property } = path.node
        if (
          object.type === 'MetaProperty' &&
          object.meta.name === 'import' &&
          object.property.name === 'meta' &&
          property.name === 'env'
        ) {
          path.replaceWithSourceString('process.env')
        }
      }
    }
  }
}
