import { Col, Form, InputNumber, Row, Select } from 'antd'
import React from 'react'
import { MapState } from '../util/mapStore'
import { MapPicker } from './MapPicker'

export interface PowerOption {
  name: string
  value: number
}

export interface InputData {
  consumption: number
  connectionPower: number
  location: MapState
}

export interface InputFormProps {
  initialValue: InputData
  onChange: (data: InputData) => void
}

export const InputForm: React.FunctionComponent<InputFormProps> = (props) => {
  const powerOptions: PowerOption[] = [
    { name: '450 KVA', value: 450 },
    { name: '900 KVA', value: 900 },
    { name: '1300 KVA', value: 1300 },
    { name: '2200 KVA', value: 2200 },
    { name: '3500 KVA', value: 3500 },
    { name: '3900 KVA', value: 3900 },
    { name: '4400 KVA', value: 4400 },
    { name: '5500 KVA', value: 5500 },
    { name: '6600 KVA', value: 6600 },
    { name: '7700 KVA', value: 7700 },
    { name: '10600 KVA', value: 10600 },
    { name: '11000 KVA', value: 11000 },
    { name: '13200 KVA', value: 13200 },
    { name: '16500 KVA', value: 16500 }
  ]

  const [form] = Form.useForm()

  const renderOption = (option: PowerOption) => {
    return <Select.Option key={option.value} value={option.value}>{option.name}</Select.Option>
  }

  return (
    <div>
      <Form form={form} layout="vertical" name="calculator" onFieldsChange={() => {
        const consumption = form.getFieldValue('consumption')
        const connectionPower = form.getFieldValue('connectionPower')
        const location = form.getFieldValue('location') as MapState
        props.onChange({ consumption, connectionPower, location })
      }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="consumption" label="Monthly Electricity bill" initialValue={props.initialValue.consumption}>
              <InputNumber style={{ width: '100%', textAlign: 'right' }}
                formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value ? +value.replace(/Rp\.\s?|(,*)/g, '') : 0} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="connectionPower" label="Electricity Connection" initialValue={props.initialValue.connectionPower}>
              <Select style={{ width: '100%' }}>{powerOptions.map(renderOption)}</Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="location" label="Location" initialValue={props.initialValue} style={{ marginBottom: 0 }}>
          <MapPicker />
        </Form.Item>
      </Form>
    </div>
  )
}