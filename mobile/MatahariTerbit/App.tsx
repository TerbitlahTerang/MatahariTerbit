import React from 'react'
import { NativeBaseProvider, View } from 'native-base'
import WebView from 'react-native-webview'
import { NativeModules, Platform } from 'react-native'
import * as Sentry from 'sentry-expo'

const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier

Sentry.init({
  dsn: 'https://998a4632c8bf4f38b7b43076af956f96@o1197651.ingest.sentry.io/6320411',
  enableInExpoDevelopment: true,
  debug: true // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})


export default function App() {

  const langOnly = deviceLanguage.split('_')[0]
  const baseUrl = 'https://matahariterbit.web.app'
  const uri = `${baseUrl}?lng=${langOnly}&priorityEnabled=0&mobile=1`
  console.log('uri', uri)
  return (
    Platform.OS === 'web' ? <iframe src={baseUrl} height={896} width={414}/> :
      <NativeBaseProvider><View style={{ flex: 1 }} backgroundColor="#1890ff">
        <WebView originWhitelist={['https://*']}
          source={{
            uri: uri,
            baseUrl: ''
          }}
          geolocationEnabled
          style={{ flex: 1, height: 2 }}
        />
      </View></NativeBaseProvider>
  )
}