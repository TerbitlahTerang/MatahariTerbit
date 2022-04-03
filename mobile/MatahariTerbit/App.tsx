import React from 'react'
import { extendTheme, HStack, Switch, Text, useColorMode, View } from 'native-base'
import WebView from 'react-native-webview'
import { Platform } from 'react-native'

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark'
}

// extend the theme
export const theme = extendTheme({ config })
type MyThemeType = typeof theme
declare module 'native-base' {
  interface ICustomTheme extends MyThemeType {
  }
}
export default function App() {
  return (
    (Platform.OS === 'web' ? <iframe src="https://matahariterbit.web.app/" height={896} width={414}/> :
      <View style={{ flex: 1 }}>:<WebView originWhitelist={['*']}
        source={{ uri: 'https://matahariterbit.web.app/', baseUrl: '' }}
        style={{ flex: 1, height: 2 }}
      />
      </View>)
  )
}