import { Col, Form, InputNumber, Row, Select } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MapState } from '../util/mapStore'
import { formatRupiah } from './Formatters'
import { MapPicker } from './MapPicker'
import { PowerOption, powerOptions } from '../constants'

export interface InputData {
  monthlyCostEstimateInRupiah: number
  connectionPower: number
  pvOut?: number
}

export interface InputFormProps {
  initialValue: InputData
  onChange: (data: InputData) => void
}

export const InputForm: React.FunctionComponent<InputFormProps> = (props) => {

  const { t } = useTranslation()
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
        const pvOut = location.info?.pvout
        props.onChange({ monthlyCostEstimateInRupiah: consumption, connectionPower, pvOut })
      }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="consumption" label={t('inputForm.monthlyBill')}
              initialValue={props.initialValue.monthlyCostEstimateInRupiah}>
              <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete={'off'}
                formatter={(value) => formatRupiah(value)}
                parser={(displayValue) => Number(displayValue ? +displayValue.replace(/Rp\.\s?|(,*)/g, '') : 0)}
                step={100000} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="connectionPower" label={t('inputForm.connectionPower')}
              initialValue={props.initialValue.connectionPower}>
              <Select style={{ width: '100%' }}>{powerOptions.map(renderOption)}</Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="location" label="Location / Irradiation" initialValue={props.initialValue} style={{ marginBottom: 0 }}>
          <MapPicker />
        </Form.Item>
      </Form>
    </div>
  )
}