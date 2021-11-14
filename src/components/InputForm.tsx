import { Col, Form, InputNumber, Row, Select } from 'antd'
import React from 'react'

export interface PowerOption {
  name: string
  value: number
}

export interface InputData {
  consumption: number
  connectionPower: number
}

export interface InputFormProps {
  initialValue: InputData
  onChange: (data: InputData) => void
}

export const InputForm: React.FunctionComponent<InputFormProps> = (props) => {
  const powerOptions: PowerOption[] = [
    { name: '450 VA', value: 450 },
    { name: '900 VA', value: 900 },
    { name: '1.300 VA', value: 1300 },
    { name: '2.200 VA', value: 2200 },
    { name: '3.500 VA', value: 3500 },
    { name: '3.900 VA', value: 3900 },
    { name: '4.400 VA', value: 4400 },
    { name: '5.500 VA', value: 5500 },
    { name: '6.600 VA', value: 6600 },
    { name: '7.700 VA', value: 7700 },
    { name: '10.600 VA', value: 10600 },
    { name: '11.000 VA', value: 11000 },
    { name: '13.200 VA', value: 13200 },
    { name: '16.500 VA', value: 16500 }
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
        props.onChange({ consumption, connectionPower })
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
      </Form>
    </div>
  )
}