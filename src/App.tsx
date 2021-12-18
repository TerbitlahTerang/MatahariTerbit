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
          <Steps size="small" current={current} onChange={setCurrent}>
            <Steps.Step icon={<EditOutlined />} title={t('wizard.information.title')} />
            <Steps.Step icon={<PieChartOutlined />} disabled={!inputData.pvOut} status={inputData.pvOut ? undefined : 'wait'} title={t('wizard.characteristics.title')} />
            <Steps.Step icon={<DollarOutlined />} disabled={!inputData.pvOut} status={inputData.pvOut ? undefined : 'wait'} title={t('wizard.roi.title')} />
          </Steps>
        </div>
        <div className="card-body" style={{ display: current === 0 ? 'inherit' : 'none' }} >
          <InputForm initialValue={INITIAL_INPUT_DATA} onChange={(data) => setInputData(data)} />
        </div>
        <div className="card-body" style={{ display: current === 1 ? 'inherit' : 'none' }}>
          <SolarPanelsPane numberOfPanels={resultData.numberOfPanels} />
          <ResultTable results={resultData} />
        </div>
        <div className="card-body" style={{ display: current === 2 ? 'inherit' : 'none' }}>
          <ROIChart yearly={projection} />
          <Divider />
          <ROIBreakdown yearly={projection} />
        </div>

        <div className="card-footer">
          <Row>
            <Col>{current > 0 && <Button size="large" type="link" onClick={() => { setCurrent(current - 1) }}>{t('wizard.prev')}</Button>}</Col>
            <Col flex="1"/>
            <Col>{current < 2 && <Button disabled={!inputData.pvOut} size="large" type="primary" onClick={() => { setCurrent(current + 1) }}>{t('wizard.next')}</Button>}</Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
