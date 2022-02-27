import Icon, { DollarOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Divider, Drawer, Select, Steps, Typography } from 'antd'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from './assets/icons/logo.svg'
import { InputData, InputForm } from './components/InputForm'
import { ResultTable } from './components/ResultTable'
import { ROIBreakdown } from './components/ROIBreakdown'
import { ROIChart } from './components/ROIChart'
import SolarPanelIcon from './assets/icons/solar-panel.svg'
import { INITIAL_INPUT_DATA } from './constants'
import { calculateResultData, ResultData } from './services/CalculationService'
import { Documentation } from './services/DocumentationService'
import { InfoPane } from './components/InfoPane'

export const App: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
  }
  const [inputData, setInputData] = useState<InputData>(INITIAL_INPUT_DATA)
  const resultData: ResultData = useMemo(() => calculateResultData(inputData), [inputData])

  const [documentation, setDocumentation] = useState<Documentation | null>(null)
  const [documentationTitle, setDocumentationTitle] = useState<String | null>(null)

  const closeDocumentation = () => {
    setDocumentation(null)
    setDocumentationTitle(null)
  }

  const openDocumentation = (doc: Documentation, title: String) => {
    setDocumentation(doc)
    setDocumentationTitle(title)
  }

  const [current, setCurrent] = useState<number>(0)

  const setStep = (newNumber: number) => {
    if (newNumber > current) {
      setCurrent(newNumber)
    }
  }

  const handleScroll: React.MouseEventHandler<HTMLElement> = (e) => {
    const moveTo = (ev: EventTarget & HTMLElement) => {
      return function () {
        const y = ev.getBoundingClientRect().top + window.scrollY + -5
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
    setTimeout(moveTo(e.currentTarget), 200)
  }

  return (
    <div className="container">
      <nav className="app-nav">
        <div className="app-nav-logo"><Logo width={40} height={40} viewBox="0 0 32 32"/></div>
        <Typography.Title ellipsis>{t('title')}</Typography.Title>
        <div className="app-nav-extra">
          <Select onChange={changeLanguage} defaultValue={i18n.resolvedLanguage} bordered={false}
            style={{ color: '#FFFFFF' }} size="large">
            <Select.Option key="en" value="en">🇺🇸 EN</Select.Option>
            <Select.Option key="id" value="id">🇮🇩 ID</Select.Option>
          </Select>
        </div>
      </nav>
      <Drawer title={documentationTitle} visible={documentation !== null} onClose={closeDocumentation} width={window.innerWidth > 900 ? '40%' : '82%'} >
        <InfoPane documentation={documentation!}/>
      </Drawer>
      <div className="card">
        <div className="card-header">
          <Steps direction="vertical" size="small" current={current} onChange={setStep}>
            <Steps.Step icon={<EditOutlined/>}
              onClick={handleScroll}
              title={<span>{t('wizard.information.title')}</span>}
              status={inputData.pvOut ? undefined : 'wait'}
              subTitle={
                <div className="card-body" style={{ display: current >= 0 ? 'block' : 'none' }}>
                  <InputForm initialValue={INITIAL_INPUT_DATA} onOpenDocumentation={openDocumentation}
                    onChange={(data) => setInputData(data)}/>
                  {current === 0 &&
                                                <Button style={{ marginTop: '5px', float: 'right' }} size="large"
                                                  onClick={() => {
                                                    setCurrent(1)
                                                  }}>
                                                    Calculate
                                                  <Icon component={() => (<SolarPanelIcon/>)}/>
                                                </Button>}
                </div>}/>
            <Steps.Step
              onClick={handleScroll}
              icon={<Icon component={() => (<SolarPanelIcon/>)}/>}
              disabled={!inputData.pvOut}
              status={inputData.pvOut ? undefined : 'wait'}
              title={<span>{t('wizard.characteristics.title')}</span>}
              subTitle={
                <div className="card-body" style={{ display: current >= 1 ? 'block' : 'none' }}>
                  <ResultTable results={resultData} onOpenDocumentation={openDocumentation}/>
                  {current === 1 && <Button style={{ marginTop: '5px', float: 'right' }} size="large"
                    onClick={() => {
                      setCurrent(2)
                    }}>
                                        Calculate
                    <DollarOutlined/>
                  </Button>}
                </div>}
            />
            <Steps.Step
              onClick={handleScroll}
              icon={<DollarOutlined/>} disabled={!inputData.pvOut}
              status={inputData.pvOut ? undefined : 'wait'}
              title={
                <span>
                  {t('wizard.roi.title')}
                </span>
              }
              subTitle={
                <div className="card-body" style={{ display: current >= 2 ? 'block' : 'none' }}>
                  <ROIChart yearly={resultData.projection}/>
                  <Divider/>
                  <ROIBreakdown yearly={resultData.projection}/>
                </div>}
            />
          </Steps>
        </div>
      </div>
    </div>
  )
}
