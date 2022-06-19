import React, { useEffect, useRef, useState } from 'react'
import { Box, Heading, HStack, Icon, IconButton, NativeBaseProvider, View, VStack } from 'native-base'
import WebView from 'react-native-webview'
import { ActivityIndicator, NativeModules, Platform } from 'react-native'
import * as Linking from 'expo-linking'
import * as Sentry from 'sentry-expo'
import SunriseLogo from './components/SunriseLogo'
import { MaterialIcons } from '@expo/vector-icons'
import { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes'
import * as Location from 'expo-location'
import { LocationGeocodedAddress } from 'expo-location'
import { EventType, QueryParams } from 'expo-linking/src/Linking.types'
import * as qs from 'qs'

const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier
const langOnly = deviceLanguage.replace('-', '_').split('_')[0]

Sentry.init({
  dsn: 'https://998a4632c8bf4f38b7b43076af956f96@o1197651.ingest.sentry.io/6320411',
  enableInExpoDevelopment: true,
  debug: true // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

export enum MessageType {
  LocationFound = 'LocationFound',
  LocationDisabled = 'LocationDisabled',
  InfoOpen = 'InfoOpen',
  InfoClosed = 'InfoClosed'
}

interface Message {
  messageType: MessageType,
  payLoad?: object
}


export default function App() {

  const webViewRef = useRef<WebView>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [message, setMessage] = useState<Message| undefined>(undefined)
  const [readyForLocation, setReadyForLocation] = useState(false)
  const [urlParams, setUrlParams] = useState<QueryParams>({ 'lng' : langOnly, priorityEnabled: '0', mobile: '1' })

  const sendMessage = (toSend: Message) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(`${JSON.stringify(toSend)}`)
    }
  }

  const sendLocationMessage = () => {
    if (webViewRef.current && message && readyForLocation) {
      webViewRef.current.postMessage(`${JSON.stringify(message)}`)
    }
  }

  useEffect(() => {
    sendLocationMessage()
  }, [message, readyForLocation])


  const _handleOpenURL : (event: EventType) => void = ({ url }) => {
    const suppliedParams = Linking.parse(url).queryParams ?? {}

    const params = { ...urlParams, ...suppliedParams }
    setUrlParams(params)
  }

  useEffect(() => {
    Linking.addEventListener('url', _handleOpenURL)
    return () => {
      Linking.removeEventListener('url', _handleOpenURL)
    }
  }, [])

  const defaultLocation = {
    coords: { lat: -6.174903208804339, lng: 106.82721867845525 },
    address: { street: 'Monas', city: 'Jakarta', region: 'Java', name: 'Gambir' }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setMessage({ messageType: MessageType.LocationDisabled })
        return
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })

      const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude }

      const addresses: LocationGeocodedAddress[] = await Location.reverseGeocodeAsync({
        latitude: coords.lat,
        longitude: coords.lng
      })
      const address = addresses[0] || defaultLocation.address

      const foundLocation = {
        coords: coords,
        address: { street: address.street, city: address.city, region: address.region, name: address.name }
      }

      setMessage({ messageType: MessageType.LocationFound, payLoad: foundLocation })
    })()
  }, [])



  const title = langOnly === 'id' ? 'Kalkulator Solar Panel': 'Solar Calculator'
  const subTitle = langOnly === 'id' ? 'Menghitung PLTS on grid': 'How many panels do I need?'
  const baseUrl = 'https://matahariterbit.web.app'
  // const baseUrl = 'https://matahariterbit--pr82-feature-intensity-in-xs1iu3m8.web.app'
  // const baseUrl = 'http://192.168.1.4:8080'

  const uri = `${baseUrl}?${qs.stringify(urlParams)}`
  console.log(uri)
  const backGroundColor = '#0c4ac7'

  const onError = (e: WebViewErrorEvent) => Sentry.Native.captureMessage(`Error from webview: ${JSON.stringify(e)}`)

  const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})()`

  return (
    Platform.OS === 'web' ? <iframe src={baseUrl} height={896} width={414}/> :
      <NativeBaseProvider >
        <View style={{ flex: 1 }} backgroundColor={backGroundColor}>
          <View>
            <Box safeAreaTop bg={backGroundColor} />
            <HStack bg={backGroundColor} px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
              <HStack alignItems="center">
                <SunriseLogo width={50} height={50} style={{ marginLeft: 5 }} />
                <VStack style={{ marginLeft: 10 }}>
                  <Heading size="lg" color='white' bold>{title}</Heading>
                  <Heading size="xs" color='gray.300'>{subTitle}</Heading>
                </VStack>
              </HStack>
              <HStack>
                <IconButton icon={<Icon as={MaterialIcons} name="info" size="sm" color="white" />}
                  onPress={() => {
                    sendMessage(infoOpen ? { messageType: MessageType.InfoClosed } : { messageType: MessageType.InfoOpen })
                    setInfoOpen(!infoOpen)
                  }}
                />
              </HStack>
            </HStack>
          </View>
          <View style={{ flex:1 }}>
            <VStack style={{ width: '100%', height: '100%' }}>
              <WebView originWhitelist={[baseUrl]}
                ref={webViewRef}
                source={{
                  uri: uri,
                  baseUrl: ''
                }}
                automaticallyAdjustContentInsets={false}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator size="large" />}
                onLoadEnd={() => {
                  setReadyForLocation(true)
                  sendLocationMessage()
                }}
                geolocationEnabled={true}
                setSupportMultipleWindows={false}
                scrollEnabled={true}
                bounces={false}
                onError={onError}
                javaScriptEnabled={true}
                injectedJavaScript={injectedJavascript}
                onContentProcessDidTerminate={() => webViewRef.current?.reload()}
                onMessage={
                  (incomingMessage) => {
                    console.log('got da message!', incomingMessage.nativeEvent.data)
                    setReadyForLocation(true)
                    sendLocationMessage()
                  }
                }
              />
            </VStack>
          </View>
        </View>
      </NativeBaseProvider>
  )
}