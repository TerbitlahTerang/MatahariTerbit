import { Col, Form, InputNumber, Row, Select, Switch } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MapState } from '../util/mapStore'
import { formatRupiah } from './Formatters'
import { MapPicker } from './MapPicker'
import { OptimizationTarget, PowerOption, powerOptions } from '../constants'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Documentation } from '../services/DocumentationService'

export interface InputData {
  monthlyCostEstimateInRupiah: number
  connectionPower: number
  pvOut?: number
  optimizationTarget: OptimizationTarget
}

export interface InputFormProps {
  initialValue: InputData,
  onOpenDocumentation:  (d: Documentation, title: string) => void
  onChange: (data: InputData) => void
}

export const InputForm: React.FunctionComponent<InputFormProps> = (props) => {

  const { t } = useTranslation()
  const [form] = Form.useForm()

  const renderOption = (option: PowerOption) => {
    return <Select.Option key={option.value} value={option.value}>{option.name}</Select.Option>
  }

  return (
    <Form form={form} layout="vertical" name="calculator" onFieldsChange={() => {
      const consumption = form.getFieldValue('consumption')
      const connectionPower = form.getFieldValue('connectionPower')
      const location = form.getFieldValue('location') as MapState
      const pvOut = location.info?.pvout
      const optimizationTarget = form.getFieldValue('optimizationTarget') ? OptimizationTarget.Money : OptimizationTarget.Green
      props.onChange({ monthlyCostEstimateInRupiah: consumption, connectionPower, pvOut, optimizationTarget })
    }}>
      <Row gutter={16}>
        <Col xs={24} sm={10}>
          <Form.Item name="consumption" label={t('inputForm.monthlyBill')}
            initialValue={props.initialValue.monthlyCostEstimateInRupiah}
            tooltip={{
              trigger: 'click',
              icon: <InfoCircleOutlined onClick={() => props.onOpenDocumentation(Documentation.MonthlyBill, t('inputForm.monthlyBill'))}/> }}>
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete='off'
              formatter={(value) => formatRupiah(value)}
              parser={(displayValue) => Number(displayValue ? +displayValue.replace(/Rp\.\s?|(,*)/g, '') : 0)}
              step={100000} />
          </Form.Item>
        </Col>
        <Col xs={16} sm={9}>
          <Form.Item name="connectionPower" label={t('inputForm.connectionPower')}
            initialValue={props.initialValue.connectionPower} tooltip={{
              trigger: 'click',
              icon: <InfoCircleOutlined onClick={() => props.onOpenDocumentation(Documentation.ConnectionPower, t('inputForm.connectionPower'))} />
            }}>

            <Select style={{ width: '100%' }}>{powerOptions.map(renderOption)}</Select>
          </Form.Item>
        </Col>
        <Col xs={8} sm={5}>
          <Form.Item name="optimizationTarget" valuePropName="checked" initialValue={true} label={t('inputForm.priority')}
            tooltip={{
              trigger: 'click',
              icon: <InfoCircleOutlined onClick={() => props.onOpenDocumentation(Documentation.Priority, t('inputForm.priority'))}/> }}>
            <Switch
              checkedChildren={t('inputForm.priorityMoney')}
              unCheckedChildren={t('inputForm.priorityEarth')}
              defaultChecked={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>

      </Row>
      <Form.Item name="location" label={t('inputForm.location')} initialValue={props.initialValue} style={{ marginBottom: 0 }}
        tooltip={{
          trigger: 'click',
          icon: <InfoCircleOutlined onClick={() => props.onOpenDocumentation(Documentation.Location, t('inputForm.location'))}/> }}
      >
        <MapPicker />
      </Form.Item>

    </Form>
  )
}