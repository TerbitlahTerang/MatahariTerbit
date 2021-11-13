import { Card } from 'antd'
import React, { useMemo, useState } from 'react'
import { InputData, InputForm } from './components/InputForm'
import { MapPicker } from './components/MapPicker'
import { ResultTable } from './components/ResultTable'
import { ROIChart } from './components/ROIChart'
import { INITIAL_INPUT_DATA } from './constants'
import { calculateResultData } from './util/calculations'

export const App: React.FunctionComponent = () => {
  const [inputData, setInputData] = useState<InputData>(INITIAL_INPUT_DATA)
  const resultData = useMemo(() => calculateResultData(inputData), [inputData])
  return (
    <div className="container">
      <Card title="Solar panel calculator">
        <InputForm initialValue={INITIAL_INPUT_DATA} onChange={(data) => setInputData(data)} />
      </Card>
      <Card title="Results">
        <ResultTable data={resultData} />
      </Card>
      <Card title="Return on Investment">
        <ROIChart data={resultData} />
      </Card>
      <Card title="Choose your Location" bodyStyle={{ padding: 0 }}>
        <MapPicker />
      </Card>
    </div>
  )
}
