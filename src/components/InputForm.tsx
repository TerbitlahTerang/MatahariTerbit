import { Col, Form, InputNumber, Row, Select, Switch } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MapState } from '../util/mapStore'
import { formatRupiah } from './Formatters'
import { MapPicker } from './MapPicker'
import { OptimizationTarget, PowerOption, powerOptions } from '../constants'
import { InfoCircleOutlined } from '@ant-design/icons'
import { InfoPane } from './InfoPane'
import { Documentation } from '../services/DocumentationService'

export interface InputData {
  monthlyCostEstimateInRupiah: number
  connectionPower: number
  pvOut?: number
  optimizationTarget: OptimizationTarget
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
              overlay: <InfoPane documentation={Documentation.MonthlyBill}  />,
              overlayStyle: { maxWidth: '320px' },
              trigger: 'click',
              icon: <InfoCircleOutlined/> }}>
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete='off'
              formatter={(value) => formatRupiah(value)}
              parser={(displayValue) => Number(displayValue ? +displayValue.replace(/Rp\.\s?|(,*)/g, '') : 0)}
              step={100000} />
          </Form.Item>
        </Col>
        <Col xs={16} sm={10}>
          <Form.Item name="connectionPower" label={t('inputForm.connectionPower')}
            initialValue={props.initialValue.connectionPower} tooltip={{
              overlay: <InfoPane documentation={Documentation.ConnectionPower}  />,
              trigger: 'click',
              overlayStyle: { maxWidth: '320px' },
              icon: <InfoCircleOutlined/> }}>
            <Select style={{ width: '100%' }}>{powerOptions.map(renderOption)}</Select>
          </Form.Item>
        </Col>
        <Col xs={8} sm={4}>
          <Form.Item name="optimizationTarget" valuePropName="checked" initialValue={true} label={t('inputForm.priority')}
            tooltip={{
              overlay: <InfoPane documentation={Documentation.Priority}  />,
              trigger: 'click',
              overlayStyle: { maxWidth: '320px' },
              icon: <InfoCircleOutlined/> }}>
            <Switch
              checkedChildren="💰 Money"
              unCheckedChildren="CO₂ 🌏"
              defaultChecked={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>

      </Row>
      <Form.Item name="location" label={t('inputForm.location')} initialValue={props.initialValue} style={{ marginBottom: 0 }}
        tooltip={{
          overlay: <InfoPane documentation={Documentation.Location} />,
          overlayStyle: { maxWidth: '360px' },
          trigger: 'click',
          icon: <InfoCircleOutlined/> }}
      >
        <MapPicker />
      </Form.Item>

    </Form>
  )
}