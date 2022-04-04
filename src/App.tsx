import Icon, { DollarOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons'
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
import { StringParam, useQueryParam } from 'use-query-params'
import { BooleanParam } from 'serialize-query-params/lib/params'
import { FinancialResultBreakdown } from './components/FinancialResultBreakdown'

export const App: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
  }
  const [inputData, setInputData] = useState<InputData>(INITIAL_INPUT_DATA)
  const resultData: ResultData = useMemo(() => calculateResultData(inputData), [inputData])

  const [documentation, setDocumentation] = useState<Documentation | null>(null)
  const [documentationTitle, setDocumentationTitle] = useState<String | null>(null)

  const [expertMode] = useQueryParam('expertMode', BooleanParam)
  const [language] = useQueryParam('lng', StringParam)

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
    if ((e.target as HTMLInputElement).tagName !== 'SPAN')
      return

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
        { language ? (<></>) :
          (<div className="app-nav-extra">
            <Select onChange={changeLanguage} defaultValue={i18n.resolvedLanguage} bordered={false}
              style={{ color: '#FFFFFF' }} size="large">
              <Select.Option key="en" value="en">🇺🇸 EN</Select.Option>
              <Select.Option key="id" value="id">🇮🇩 ID</Select.Option>
            </Select>
          </div>)
        }
      </nav>
      <Drawer title={(<div><InfoCircleOutlined size={24}/> {documentationTitle}</div>)} visible={documentation !== null} onClose={closeDocumentation} width={window.innerWidth > 900 ? '40%' : '82%'} >
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
                    onChange={(data) => setInputData(data)} expertMode={expertMode === true}/>
                  {current === 0 &&
                                                <Button style={{ marginTop: '5px', float: 'right' }} size="large"
                                                  onClick={() => {
                                                    setCurrent(1)
                                                  }}>
                                                  {t('wizard.information.button')}
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
                  <ResultTable results={resultData} onOpenDocumentation={openDocumentation} calculatorSettings={inputData.calculatorSettings}/>
                  {current === 1 && <Button style={{ marginTop: '5px', float: 'right' }} size="large"
                    onClick={() => {
                      setCurrent(2)
                    }}>
                    {t('wizard.characteristics.button')}
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
                  <FinancialResultBreakdown results={resultData} onOpenDocumentation={openDocumentation} calculatorSettings={inputData.calculatorSettings} />
                  <Divider orientation="left">{t('chart.heading')}</Divider>
                  <ROIChart yearly={resultData.projection} inverterLifetimeInYears={inputData.calculatorSettings.inverterLifetimeInYears}/>
                  <Divider orientation="left">{t('roiTable.title')}</Divider>
                  <div>&nbsp;</div>
                  <ROIBreakdown yearly={resultData.projection}/>
                </div>}
            />
          </Steps>
        </div>
      </div>
    </div>
  )
}
