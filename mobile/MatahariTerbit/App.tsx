import React, { useEffect, useState } from 'react'
import { NativeBaseProvider, View } from 'native-base'
import WebView from 'react-native-webview'
import { NativeModules, Platform } from 'react-native'
import * as Location from 'expo-location'
import { LocationGeocodedAddress } from 'expo-location'
import * as Sentry from 'sentry-expo'

interface Coords {
  lat: number
  lng: number
}

interface Address {
  street: string | null
  city: string | null
  region: string | null
  name: string | null
}

interface Location {
  coords: Coords
  address: Address
}

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

  const [location, setLocation] = useState<Location | undefined>(undefined)
  const [errorMsg, setErrorMsg] = useState('')

  const defaultLocation = {
    coords: { lat: -6.174903208804339, lng: 106.82721867845525 },
    address: { street: 'Monas', city: 'Jakarta', region: 'Java', name: 'Gambir' }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {

        setLocation(defaultLocation)
        setErrorMsg('Permission to access location was denied')
        return
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })

      const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude }

      const addresses: LocationGeocodedAddress[] = await Location.reverseGeocodeAsync({
        latitude: coords.lat,
        longitude: coords.lng
      })
      const address = addresses[0] || defaultLocation.address
      setLocation({
        coords: coords,
        address: { street: address.street, city: address.city, region: address.region, name: address.name }
      })
    })()
  }, [])

  console.log(errorMsg)

  const langOnly = deviceLanguage.split('_')[0]
  const baseUrl = 'https://matahariterbit--pr73-feature-71-improved-hpjk470p.web.app'
  const uri = `${baseUrl}?lng=${langOnly}&priorityEnabled=0&mobile=1&location=${JSON.stringify(location)}`
  console.log('uri', uri)
  return (
    Platform.OS === 'web' ? <iframe src={baseUrl} height={896} width={414}/> :
      <NativeBaseProvider><View style={{ flex: 1 }} backgroundColor="#1890ff">
        {location && <WebView originWhitelist={['https://*']}
          source={{
            uri: uri,
            baseUrl: ''
          }}
          geolocationEnabled
          style={{ flex: 1, height: 2 }}
        />}
      </View></NativeBaseProvider>
  )
}