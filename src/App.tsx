
import { Card, Divider, Select } from 'antd'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InputData, InputForm } from './components/InputForm'
import { ResultTable } from './components/ResultTable'
import { ROIChart } from './components/ROIChart'
import { INITIAL_INPUT_DATA } from './constants'
import {
  calculateResultData,
  fromResultData,
  yearlyProjection
} from './services/CalculationService'
import { SolarPanelsPane } from './components/SolarPanelsPane'
import { ROIBreakdown } from './components/ROIBreakdown'

export const App: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const changeLanguage = (value: string) => { i18n.changeLanguage(value) }
  const [inputData, setInputData] = useState<InputData>(INITIAL_INPUT_DATA)
  const resultData = useMemo(() => calculateResultData(inputData), [inputData])
  const projection = useMemo(() => yearlyProjection(30, fromResultData(resultData)), [resultData])
  return (
    <div className="container">
      <Card title={t('title')} extra={(
        <Select size="small" onChange={changeLanguage} defaultValue={i18n.language.split('-')[0]}>
          <Select.Option key="en" value="en" label="English" >🇺🇸 EN</Select.Option>
          <Select.Option key="id" value="id" label="Bahasa Indonesia">🇮🇩 ID</Select.Option>
        </Select>
      )}>
        <InputForm initialValue={INITIAL_INPUT_DATA} onChange={(data) => setInputData(data)} />
      </Card>
      <Card title={t('resultsTitle')}>
        <SolarPanelsPane numberOfPanels={resultData.numberOfPanels} />
        <ResultTable results={resultData} />
      </Card>
      <Card title={t('roiTitle')}>
        <ROIChart yearly={projection} />
        <Divider />
        <ROIBreakdown yearly={projection} />
      </Card>
    </div>
  )
}
