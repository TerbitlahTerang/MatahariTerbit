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
  const baseUrl = 'https://matahariterbit--pr72-feature-71-improved-u4vtksnw.web.app/'
  return (
    Platform.OS === 'web' ? <iframe src={baseUrl} height={896} width={414}/> :
      <NativeBaseProvider><View style={{ flex: 1 }} backgroundColor='#1890ff'><WebView originWhitelist={['https://*']}
        source={{ uri: `${baseUrl}?lng=${langOnly}&priorityEnabled=0`, baseUrl: '' }}
        geolocationEnabled
        style={{ flex: 1, height: 2 }}
      />
      </View></NativeBaseProvider>
  )
}