import Icon, { DollarOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Divider, Drawer, Select, Steps, Typography } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from './assets/icons/logo-sunrise.svg'
import { InputData, InputForm } from './components/InputForm'
import { ResultTable } from './components/ResultTable'
import { ROIBreakdown } from './components/ROIBreakdown'
import { ROIChart } from './components/ROIChart'
import SolarPanelIcon from './assets/icons/solar-panel.svg'
import { GOOGLE_ANALYTICS_TRACKING_ID, INITIAL_INPUT_DATA } from './constants'
import { calculateResultData, ResultData } from './services/CalculationService'
import { Documentation } from './services/DocumentationService'
import { InfoPane } from './components/InfoPane'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'
import { BooleanParam } from 'serialize-query-params/lib/params'
import { FinancialResultBreakdown } from './components/FinancialResultBreakdown'
import { Coordinate, mapStore } from './util/mapStore'
import ReactGA from 'react-ga4'
import * as Analytics from './services/Analytics'
import { Category } from './services/Analytics'
import { VendorList } from './components/VendorsList'

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

interface LocationMessage {
  messageType: MessageType,
  payLoad: {
    coords: Coordinate
  }
}

interface AndroidEvent {
  data: string
}

ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_ID)
ReactGA.send('pageview')

export const App: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const changeLanguage = (value: string) => {
    Analytics.event(Category.Navigation, 'Language', value)
    i18n.changeLanguage(value)
  }
  
  const [inputData, setInputData] = useState<InputData>(INITIAL_INPUT_DATA)
  const resultData: ResultData = useMemo(() => {
    const res = calculateResultData(inputData)
    Analytics.valueEvent(Category.Navigation, 'Calculate', 'Consumption', res.consumptionPerMonthInKwh)
    return res
  }, [inputData])

  const [documentation, setDocumentation] = useState<Documentation | null>(null)
  const [documentationTitle, setDocumentationTitle] = useState<String | null>(null)
  const [documentationFullWidth, setDocumentationFullWidth] = useState(false)

  const [expertMode] = useQueryParam('expertMode', BooleanParam)
  const [language] = useQueryParam('lng', StringParam)
  const [mobile] = useQueryParam('mobile', BooleanParam)
  const [vendors] = useQueryParam('vendors', withDefault(BooleanParam, true))

  const [cacheBuster, setCacheBuster] = useState<number>(0)

  function handleEvent(data: string) {
    const message: Message = JSON.parse(data)

    Analytics.event(Category.NativeEvent, message.messageType)
    switch (message.messageType) {
      case MessageType.LocationFound: {
        const mess: LocationMessage = JSON.parse(data)
        mapStore.setLocation(mess.payLoad.coords, true)
        break
      }

      case  MessageType.LocationDisabled:
        mapStore.setLocation(INITIAL_INPUT_DATA.location.location, false)
        break

      case  MessageType.InfoOpen:
        openDocumentation(Documentation.AppInfo, t('title'), true)
        break
      case  MessageType.InfoClosed: {
        closeDocumentation()
        break
      }
    }
  }

  useEffect(() => {
    if (mobile) {
      window.addEventListener('message', (event) => {
        handleEvent(event.data)
      })
      document.addEventListener('message', (evt: unknown) => {
        const androidEvent = evt as AndroidEvent
        handleEvent(androidEvent.data)
      })
    }
  })

  const closeDocumentation = () => {
    setDocumentationFullWidth(false)
    setDocumentationTitle(null)
    setDocumentation(null)
  }

  const openDocumentation = (doc: Documentation, title: String, fullWidth: boolean = false) => {
    setDocumentationTitle(title)
    setDocumentationFullWidth(fullWidth)
    setDocumentation(doc)
  }

  const [current, setCurrent] = useState<number>(0)

  useEffect(() => {
    Analytics.event(Category.Wizard, 'Next', current.toString())
    if (current === 0) {
      handleScroll(firstRef.current)
    }
    if (current === 1) {
      handleScroll(secondRef.current)
    }
    if (current === 2) {
      handleScroll(thirdRef.current)
    }
  }, [current])



  const handleScroll = (e: HTMLElement | null) => {
    const moveTo = (ev: HTMLElement) => {
      return function () {
        const y = ev.getBoundingClientRect().top + window.scrollY + -50
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
    if (e) {
      setTimeout(moveTo(e), 200)
    }
  }

  const firstRef = useRef(null)
  const secondRef = useRef(null)
  const thirdRef = useRef(null)

  return (
    <div className="container">
      {!mobile &&
          <nav className="app-nav">
            <div className="app-nav-logo"><Logo width={40} height={40} viewBox="0 0 32 32"/></div>
            <Typography.Title ellipsis>{t('title')}</Typography.Title>
            {language ? (<></>) :
              (<div className="app-nav-extra">
                <Select onChange={changeLanguage} defaultValue={i18n.resolvedLanguage} bordered={false}
                  style={{ color: '#FFFFFF' }} size="large">
                  <Select.Option key="en" value="en">🇺🇸 EN</Select.Option>
                  <Select.Option key="id" value="id">🇮🇩 ID</Select.Option>
                </Select>
              </div>)
            }
          </nav>
      }
      <Drawer title={(<div>{documentationTitle}</div>)} visible={documentation !== null} onClose={closeDocumentation} width={
        documentationFullWidth ? '100%' : (window.innerWidth > 900 ? '40%' : '82%')
      } >
        <InfoPane documentation={documentation!}/>
      </Drawer>
      <div className="card">
        <div className="card-header">
          <Steps direction="vertical" size="small" current={current}  >
            <Steps.Step icon={<EditOutlined/>}
              title={<span>{t('wizard.information.title')}</span>}
              status={inputData.pvOut ? undefined : 'wait'}
              subTitle={
                <div className="card-body" style={{ display: current >= 0 ? 'block' : 'none' }}>
                  <InputForm  initialValue={INITIAL_INPUT_DATA} onOpenDocumentation={openDocumentation}
                    onChange={(data) => setInputData(data)} expertMode={expertMode === true} mobile={mobile === true}/>
                  {current === 0 &&
                                                <Button type="primary" style={{ marginTop: '15px', float: 'right' }} size="large"
                                                  onClick={() => {
                                                    setCurrent(1)
                                                  }}>
                                                  {t('wizard.information.button')}
                                                  <Icon component={() => (<SolarPanelIcon/>)}/>
                                                </Button>}
                </div>}/>
            <Steps.Step
              icon={<Icon component={() => (<SolarPanelIcon/>)}/>}
              disabled={!inputData.pvOut}
              status={inputData.pvOut ? undefined : 'wait'}
              title={<span>{t('wizard.characteristics.title')}</span>}
              subTitle={
                <div ref={secondRef} className="card-body" style={{ display: current >= 1 ? 'block' : 'none' }}>
                  <ResultTable   results={resultData} onOpenDocumentation={openDocumentation} calculatorSettings={inputData.calculatorSettings}/>
                  {current === 1 && <Button type="primary"  style={{ marginTop: '15px', float: 'right' }} size="large"
                    onClick={() => {
                      setCurrent(2)
                      setCacheBuster(Math.random)
                    }}>
                    {t('wizard.characteristics.button')}
                    <DollarOutlined/>
                  </Button>}
                </div>}
            />
            <Steps.Step
              icon={<DollarOutlined/>} disabled={!inputData.pvOut}
              status={inputData.pvOut ? undefined : 'wait'}
              title={
                <span>
                  {t('wizard.roi.title')}
                </span>
              }
              subTitle={
                <div ref={thirdRef}  className="card-body" style={{ display: current >= 2 ? 'block' : 'none' }}>
                  <FinancialResultBreakdown results={resultData} onOpenDocumentation={openDocumentation} calculatorSettings={inputData.calculatorSettings} />
                  <Divider orientation="left">{t('chart.heading')}</Divider>
                  <ROIChart mobile={mobile === true} cacheBuster={cacheBuster} yearly={resultData.projection} inverterLifetimeInYears={inputData.calculatorSettings.inverterLifetimeInYears}/>
                  {
                    vendors ? (<><Divider orientation="left">{t('vendors.title')}</Divider>
                      <VendorList resultData={resultData} connectionPower={inputData.connectionPower} /></>) : (<><Divider orientation="left">{t('roiTable.title')}</Divider><ROIBreakdown yearly={resultData.projection}/></>)
                  }
                </div>}
            />
          </Steps>
        </div>
      </div>
    </div>
  )
}
