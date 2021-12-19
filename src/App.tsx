import { DollarOutlined, EditOutlined, PieChartOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Row, Select, Steps, Typography } from 'antd'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from './assets/icons/logo.svg'
import { InputData, InputForm } from './components/InputForm'
import { ResultTable } from './components/ResultTable'
import { ROIBreakdown } from './components/ROIBreakdown'
import { ROIChart } from './components/ROIChart'
import { SolarPanelsPane } from './components/SolarPanelsPane'
import { INITIAL_INPUT_DATA } from './constants'
import { calculateResultData, fromResultData, yearlyProjection } from './services/CalculationService'

export const App: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const changeLanguage = (value: string) => { i18n.changeLanguage(value) }
  const [inputData, setInputData] = useState<InputData>(INITIAL_INPUT_DATA)
  const resultData = useMemo(() => calculateResultData(inputData), [inputData])
  const projection = useMemo(() => yearlyProjection(30, fromResultData(resultData)), [resultData])

  const [current, setCurrent] = useState<number>(0)

  return (
    <div className="container">
      <nav className="app-nav">
        <div className="app-nav-logo"><Logo width={40} height={40} viewBox="0 0 32 32" /></div>
        <Typography.Title ellipsis>{t('title')}</Typography.Title>
        <div className="app-nav-extra">
          <Select onChange={changeLanguage} defaultValue={i18n.resolvedLanguage} bordered={false} style={{ color: '#FFFFFF' }} size="large">
            <Select.Option key="en" value="en">🇺🇸 EN</Select.Option>
            <Select.Option key="id" value="id">🇮🇩 ID</Select.Option>
          </Select>
        </div>
      </nav>

      <div className="card">
        <div className="card-header">
          <Steps direction="vertical" size="small" current={current} onChange={setCurrent}>
            <Steps.Step icon={<EditOutlined />}
              title={<span>{t('wizard.information.title')}</span>}
              subTitle={
                <div className="card-body"
                  style={{ display: current >= 0 ? 'block' : 'none' }}
                >
                  <InputForm initialValue={INITIAL_INPUT_DATA} onChange={(data) => setInputData(data)} />
                </div>} />
            <Steps.Step
              icon={<PieChartOutlined />}
              disabled={!inputData.pvOut}
              status={inputData.pvOut ? undefined : 'wait'}
              title={<span>{t('wizard.characteristics.title')}</span>}
              subTitle={
                <div className="card-body"
                  style={{ display: current >= 1 ? 'block' : 'none' }}
                >
                  <SolarPanelsPane numberOfPanels={resultData.numberOfPanels} />
                  <ResultTable results={resultData} />
                </div>}
            />
            <Steps.Step icon={<DollarOutlined />} disabled={!inputData.pvOut} status={inputData.pvOut ? undefined : 'wait'} title={t('wizard.roi.title')}
              subTitle={
                <div className="card-body"
                  style={{ display: current >= 2 ? 'block' : 'none' }}
                >
                  <ROIChart yearly={projection} />
                  <Divider />
                  <ROIBreakdown yearly={projection} />
                </div>}
            />
          </Steps>
        </div>
      </div>
    </div>
  )
}
