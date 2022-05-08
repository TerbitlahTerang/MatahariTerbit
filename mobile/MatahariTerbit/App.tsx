import React from 'react'
import {
  Box,
  Heading,
  NativeBaseProvider,
  View,
  Icon,
  HStack,
  IconButton,
  VStack
} from 'native-base'
import WebView from 'react-native-webview'
import { ImageBackground, NativeModules, Platform } from 'react-native'
import * as Sentry from 'sentry-expo'
import logo from './assets/dithered-image2.png'
import Sunrise from './assets/logo-sunrise.svg'
import { G, Path } from 'react-native-svg'
import SunriseLogo from './components/SunriseLogo'
import { MaterialIcons } from '@expo/vector-icons'

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

  const title = langOnly === 'id' ? 'Kalkulator Solar Panel': 'Solar Calculator'
  const subTitle = langOnly === 'id' ? 'Menghitung PLTS on grid': 'How many panels do I need?'
  const baseUrl = 'https://matahariterbitweb.app'
  // const baseUrl = 'http://192.168.1.4:8080'
  const uri = `${baseUrl}?lng=${langOnly}&priorityEnabled=0&mobile=1`
  console.log('uri', uri)
  const backGroundColor = '#0c4ac7'
  return (
    Platform.OS === 'web' ? <iframe src={baseUrl} height={896} width={414}/> :
      <NativeBaseProvider >
        <View style={{ flex: 1 }} backgroundColor={backGroundColor}>
          <ImageBackground resizeMode='repeat' source={logo} style={{ width: '100%', height: '100%' }} width={160} >
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
                <IconButton icon={<Icon as={MaterialIcons} name="info" size="sm" color="white" />} />
                <IconButton icon={<Icon as={MaterialIcons} name="settings" size="sm" color="white" />} />
              </HStack>
            </HStack>
              

            <WebView originWhitelist={['https://*', 'http://*']}
              source={{
                uri: uri,
                baseUrl: ''
              }}
              geolocationEnabled
              scrollEnabled={true}
              bounces={false}
              style={{ flex: 1, height: 2, backgroundColor: '#5689CE'  }}
            />
          </ImageBackground>
        </View>
      </NativeBaseProvider>
  )
}