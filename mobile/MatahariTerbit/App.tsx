import React from 'react'
import { View, NativeBaseProvider } from 'native-base'
import WebView from 'react-native-webview'
import { Platform, NativeModules } from 'react-native'



const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier

export default function App() {


  const langOnly = deviceLanguage.split('_')[0]
  return (
    Platform.OS === 'web' ? <iframe src="https://matahariterbit.web.app/" height={896} width={414}/> :
      <NativeBaseProvider><View style={{ flex: 1 }}><WebView originWhitelist={['*']}
        source={{ uri: `http://192.168.1.4:8080/?lng=${langOnly}&priorityEnabled=0`, baseUrl: '' }}
        style={{ flex: 1, height: 2 }}
      />
      </View></NativeBaseProvider>
  )
}