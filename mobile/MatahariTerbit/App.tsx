import React, { useEffect, useState } from 'react'
import { View, NativeBaseProvider } from 'native-base'
import WebView from 'react-native-webview'
import { Platform, NativeModules } from 'react-native'
import * as Location from 'expo-location'

interface Coords {
  lat: number
  lng: number
}

const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier

export default function App() {

  const [location, setLocation] = useState<Coords>({ lat: 6.174903208804339, lng: 106.82721867845525 })
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      const loc = await Location.getCurrentPositionAsync({})
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude })
    })()
  }, [])

  const langOnly = deviceLanguage.split('_')[0]
  const baseUrl = 'https://matahariterbit--pr72-feature-71-improved-u4vtksnw.web.app/'
  return (
    Platform.OS === 'web' ? <iframe src={baseUrl} height={896} width={414}/> :
      <NativeBaseProvider><View style={{ flex: 1 }} backgroundColor='#1890ff'>
        {errorMsg && <span>{errorMsg}</span>}
        <WebView originWhitelist={['https://*', 'http://*']}
          source={{ uri: `${baseUrl}?lng=${langOnly}&priorityEnabled=0&mobile=1&location=${JSON.stringify(location)}`, baseUrl: '' }}
          geolocationEnabled
          style={{ flex: 1, height: 2 }}
        />
      </View></NativeBaseProvider>
  )
}