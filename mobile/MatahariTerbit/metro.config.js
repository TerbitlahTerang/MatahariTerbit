const { getDefaultConfig } = require('expo/metro-config')
const { getSentryExpoConfig } = require('@sentry/react-native/metro')

const config = getSentryExpoConfig(__dirname)

// 1. Disable the new "Package Exports" logic which breaks NativeBase
config.resolver.unstable_enablePackageExports = false

// 2. Explicitly map tslib to the main entry point
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'tslib': require.resolve('tslib')
}

module.exports = config