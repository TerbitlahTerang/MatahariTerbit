import { Col, Divider, Form, InputNumber, Row, Select, Switch } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MapState } from '../util/mapStore'
import {
  formatDigits, formatKwh,
  formatPercentage,
  formatRupiah, parseKwh,
  parseNumber,
  parsePercentage,
  parseRupiah
} from './Formatters'
import { MapPicker } from './MapPicker'
import {
  CALCULATOR_SETTINGS,
  CalculatorSettings,
  InverterPrice,
  MonthlyUsage,
  OptimizationTarget,
  PowerOption,
  powerOptions
} from '../constants'
import {
  FacebookOutlined,
  InfoCircleOutlined,
  LinkedinOutlined,
  ShareAltOutlined,
  TwitterOutlined
} from '@ant-design/icons'
import { Documentation } from '../services/DocumentationService'
import { NumberParam, useQueryParam, withDefault } from 'use-query-params'
import { BooleanParam, createEnumParam } from 'serialize-query-params/lib/params'

export interface InputData {
  monthlyCostEstimateInRupiah: number
  monthlyUsageInKwh: number
  connectionPower: number
  pvOut?: number
  optimizationTarget: OptimizationTarget
  calculatorSettings: CalculatorSettings
}

export interface InputFormProps {
  initialValue: InputData,
  onOpenDocumentation: (d: Documentation, title: string) => void
  onChange: (data: InputData) => void,
  expertMode: boolean
}

const createLink = () => {
  return `${window.location}`.replace('expertMode=1&', '')
}

const createFacebookLink = () => {
  const link = createLink()
  return `https://www.facebook.com/sharer.php?u=${encodeURI(link)}`
}

const createTwitterLink = () => {
  const link = createLink()
  return `https://twitter.com/intent/tweet?url=${encodeURI(link)}`
}

const createLinkedinLink = () => {
  const link = createLink()
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURI(link)}`
}

export const InputForm: React.FunctionComponent<InputFormProps> = (props) => {

  const { t, i18n } = useTranslation()
  const [form] = Form.useForm()

  const renderOption = (option: PowerOption) => {
    return <Select.Option key={option.value} value={option.value}>{option.name}</Select.Option>
  }

  const init = props.initialValue
  const calcSettings = init.calculatorSettings
  const plnSettings = calcSettings.plnSettings
  const priceSettings = calcSettings.priceSettings

  const [priorityEnabled, setPriorityEnabled] = useQueryParam('priorityEnabled', withDefault(BooleanParam, calcSettings.priorityEnabled))
  const [monthlyUsageType, setMonthlyUsageType] = useQueryParam('monthlyUsageType', withDefault(createEnumParam(Object.values(MonthlyUsage)), priceSettings.monthlyUsageType))

  const [lowTariff, setLowTariff] = useQueryParam('lowTariff', withDefault(NumberParam, plnSettings.lowTariff))
  const [highTariff, setHighTariff] = useQueryParam('highTariff', withDefault(NumberParam, plnSettings.highTariff))
  const [energyTax, setEnergyTax] = useQueryParam('energyTax', withDefault(NumberParam, plnSettings.energyTax))

  const [lowTariffThreshold, setLowTariffThreshold] = useQueryParam('lowTariffThreshold', withDefault(NumberParam, plnSettings.lowTariffThreshold))
  const [minimalMonthlyConsumptionHours, setMinimalMonthlyConsumptionHours] = useQueryParam('minimalMonthlyConsumptionHours', withDefault(NumberParam, plnSettings.minimalMonthlyConsumptionHours))
  const [minimalMonthlyConsumptionPrice, setMinimalMonthlyConsumptionPrice] = useQueryParam('minimalMonthlyConsumptionPrice', withDefault(NumberParam, plnSettings.minimalMonthlyConsumptionPrice))

  const [pricePerPanel, setPricePerPanel] = useQueryParam('pricePerPanel', withDefault(NumberParam, priceSettings.pricePerPanel))
  const [electricityPriceInflationRate, setElectricityPriceInflationRate] = useQueryParam('electricityPriceInflationRate', withDefault(NumberParam, priceSettings.electricityPriceInflationRate))
  const [capacityLossRate, setCapacityLossRate] = useQueryParam('capacityLossRate', withDefault(NumberParam, priceSettings.capacityLossRate))
  const [kiloWattPeakPerPanel, setKiloWattPeakPerPanel] = useQueryParam('kiloWattPeakPerPanel', withDefault(NumberParam, calcSettings.kiloWattPeakPerPanel))
  const [areaPerPanel, setAreaPerPanel] = useQueryParam('areaPerPanel', withDefault(NumberParam, calcSettings.areaPerPanel))
  const [lossFromInverter, setLossFromInverter] = useQueryParam('lossFromInverter', withDefault(NumberParam, calcSettings.lossFromInverter))

  const [inverterPrice, setInverterPrice] = useQueryParam('inverterPrice', withDefault(createEnumParam(Object.values(InverterPrice)), priceSettings.inverterPrice))
  const [inverterLifetimeInYears, setInverterLifetimeInYears] = useQueryParam('inverterLifetimeInYears', withDefault(NumberParam, calcSettings.inverterLifetimeInYears))
  const [priceOfInverterFactor, setPriceOfInverterFactor] = useQueryParam('priceOfInverterFactor', withDefault(NumberParam, priceSettings.priceOfInverterFactor))
  const [priceOfInverterAbsolute, setPriceOfInverterAbsolute] = useQueryParam('priceOfInverterAbsolute', withDefault(NumberParam, priceSettings.priceOfInverterAbsolute))
  const [installationCosts, setInstallationCosts] = useQueryParam('installationCosts', withDefault(NumberParam, priceSettings.installationCosts))


  return (
    <Form form={form} layout="vertical" name="calculator" onFieldsChange={() => {
      const monthlyBill = form.getFieldValue('monthlyBill')
      const monthlyUsageInKwh = form.getFieldValue('monthlyUsageInKwh')

      const connectionPower = form.getFieldValue('connectionPower')
      const location = form.getFieldValue('location') as MapState
      const pvOut = location.info?.pvout
      const targetValue = form.getFieldValue('optimizationTarget')
      const optimizationTarget = targetValue === undefined || targetValue ? OptimizationTarget.Money : OptimizationTarget.Green

      const calculatorSettings: CalculatorSettings = {
        plnSettings: {
          lowTariff,
          highTariff,
          lowTariffThreshold,
          energyTax,
          minimalMonthlyConsumptionHours,
          minimalMonthlyConsumptionPrice
        },
        priceSettings: {
          pricePerPanel,
          electricityPriceInflationRate,
          priceOfInverterFactor,
          priceOfInverterAbsolute,
          installationCosts,
          capacityLossRate,
          inverterPrice,
          monthlyUsageType
        },
        kiloWattPeakPerPanel,
        areaPerPanel,
        lossFromInverter,
        inverterLifetimeInYears,
        kiloWattHourPerYearPerKWp: CALCULATOR_SETTINGS.kiloWattHourPerYearPerKWp,
        priorityEnabled
      }

      props.onChange({
        monthlyCostEstimateInRupiah: monthlyBill,
        monthlyUsageInKwh,
        connectionPower,
        pvOut,
        optimizationTarget,
        calculatorSettings
      })
    }}>
      <Row gutter={16}>
        <Col xs={24} sm={priorityEnabled ? 10 : 12}>
          {monthlyUsageType === MonthlyUsage.Rupiah ?
            (<Form.Item name="monthlyBill" label={t('inputForm.monthlyBill')}
              initialValue={init.monthlyCostEstimateInRupiah}
              tooltip={{
                trigger: 'click',
                icon: <InfoCircleOutlined
                  onClick={() => props.onOpenDocumentation(Documentation.MonthlyBill, t('inputForm.monthlyBill'))}/>
              }}>
              <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
                formatter={formatRupiah}
                parser={parseRupiah}
                step={100000}/>
            </Form.Item>) : (<Form.Item name="monthlyUsageInKwh" label={t('inputForm.monthlyUsage')}
              initialValue={init.monthlyUsageInKwh}
            >
              <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
                formatter={(value) => formatKwh(value)}
                parser={(displayValue) => parseKwh(displayValue)}
                step={10}/>
            </Form.Item>)
          }
        </Col>
        <Col xs={priorityEnabled ? 15 : 24} sm={priorityEnabled ? 9 : 12}>
          <Form.Item name="connectionPower" label={t('inputForm.connectionPower')}
            initialValue={init.connectionPower} tooltip={{
              trigger: 'click',
              icon: <InfoCircleOutlined
                onClick={() => props.onOpenDocumentation(Documentation.ConnectionPower, t('inputForm.connectionPower'))}/>
            }}>

            <Select style={{ width: '100%' }}>{powerOptions.map(renderOption)}</Select>
          </Form.Item>
        </Col>
        {priorityEnabled &&
            <Col xs={9} sm={5}>
              <Form.Item name="optimizationTarget" valuePropName="checked" initialValue={true}
                label={t('inputForm.priority')}
                tooltip={{
                  trigger: 'click',
                  icon: <InfoCircleOutlined
                    onClick={() => props.onOpenDocumentation(Documentation.Priority, t('inputForm.priority'))}/>
                }}>
                <Switch className='prioritySwitch'
                  checkedChildren={t('inputForm.priorityMoney')}
                  unCheckedChildren={t('inputForm.priorityEarth')}
                  defaultChecked={true}
                />
              </Form.Item>
            </Col>
        }
      </Row>
      <Row gutter={16}>

      </Row>
      <Form.Item name="location" label={t('inputForm.location')} initialValue={init} style={{ marginBottom: 0 }}
        tooltip={{
          trigger: 'click',
          icon: <InfoCircleOutlined
            onClick={() => props.onOpenDocumentation(Documentation.Location, t('inputForm.location'))}/>
        }}
      >
        <MapPicker/>
      </Form.Item>
      {props.expertMode && <><Divider orientation="left">{t('inputForm.expertMode.title.plnSettings')}&nbsp; <InfoCircleOutlined
        onClick={() => props.onOpenDocumentation(Documentation.PlnSettings, t('inputForm.expertMode.title.plnSettings'))}/></Divider>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name="lowTariff" label={t('inputForm.expertMode.lowTariff')}
            initialValue={lowTariff}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={lowTariff}
              formatter={formatRupiah}
              parser={parseRupiah}
              onChange={setLowTariff}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="highTariff" label={t('inputForm.expertMode.highTariff')}
            initialValue={highTariff}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={highTariff}
              formatter={formatRupiah}
              parser={parseRupiah}
              onChange={setHighTariff}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="lowTariffThreshold" label={t('inputForm.expertMode.lowTariffThreshold')}
            initialValue={lowTariffThreshold}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={lowTariffThreshold}
              onChange={setLowTariffThreshold}
            />
          </Form.Item>
        </Col>
      </Row><Row gutter={16}>
        <Col xs={24} sm={4}>
          <Form.Item name="energyTax" label={t('inputForm.expertMode.energyTax')}
            initialValue={energyTax}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={energyTax}
              formatter={(value) => formatPercentage(value, i18n.language)}
              parser={(displayValue) => parsePercentage(displayValue)}
              onChange={setEnergyTax}
              step={0.01}/>
          </Form.Item>
        </Col>
        <Col xs={24} sm={10}>
          <Form.Item name="minimalMonthlyConsumptionHours"
            label={t('inputForm.expertMode.minimalMonthlyConsumptionHours')}
            initialValue={minimalMonthlyConsumptionHours}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={minimalMonthlyConsumptionHours}
              onChange={setMinimalMonthlyConsumptionHours}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={10}>
          <Form.Item name="minimalMonthlyConsumptionPrice"
            label={t('inputForm.expertMode.minimalMonthlyConsumptionPrice')}
            initialValue={minimalMonthlyConsumptionPrice}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={minimalMonthlyConsumptionPrice}
              onChange={setMinimalMonthlyConsumptionPrice}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">{t('inputForm.expertMode.title.systemSettings')}</Divider>
      <Row gutter={16}>
        <Col xs={24} sm={6}>
          <Form.Item name="pricePerPanel" label={t('inputForm.expertMode.pricePerPanel')}
            initialValue={pricePerPanel}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={pricePerPanel}
              formatter={formatRupiah}
              parser={parseRupiah}
              step={100000}
              onChange={setPricePerPanel}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="electricityPriceInflationRate"
            label={t('inputForm.expertMode.electricityPriceInflationRate')}
            initialValue={electricityPriceInflationRate}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={electricityPriceInflationRate}
              formatter={(value) => formatPercentage(value, i18n.language, 2)}
              parser={(displayValue) => parsePercentage(displayValue)}
              step={0.01}
              onChange={setElectricityPriceInflationRate}
            />
          </Form.Item>
        </Col>
      </Row><Row gutter={16}>
        <Col xs={24} sm={6}>
          <Form.Item name="kiloWattPeakPerPanel" label={t('inputForm.expertMode.kiloWattPeakPerPanel')}
            initialValue={kiloWattPeakPerPanel}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={kiloWattPeakPerPanel}
              formatter={(value) => formatDigits(value, 3, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              onChange={setKiloWattPeakPerPanel}
              step={0.01}/>
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item name="areaPerPanel" label={t('inputForm.expertMode.areaPerPanel')}
            initialValue={areaPerPanel}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={areaPerPanel}
              formatter={(value) => formatDigits(value, 2, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              step={0.1}
              onChange={setAreaPerPanel}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item name="lossFromInverter" label={t('inputForm.expertMode.lossFromInverter')}
            initialValue={lossFromInverter}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={lossFromInverter}
              formatter={(value) => formatDigits(value, 4, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              step={0.1}
              onChange={setLossFromInverter}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item name="capacityLossRate" label={t('inputForm.expertMode.capacityLossRate')}
            initialValue={capacityLossRate}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={capacityLossRate}
              formatter={(value) => formatPercentage(value, i18n.language, 2)}
              parser={(displayValue) => parsePercentage(displayValue)}
              step={0.001}
              onChange={setCapacityLossRate}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={4}>
          <Form.Item name="inverterPrice" valuePropName="checked" initialValue={inverterPrice === InverterPrice.Relative}
            label={t('inputForm.expertMode.inverterPrice')}>
            <Switch
              checkedChildren={InverterPrice.Relative}
              unCheckedChildren={InverterPrice.Absolute}
              defaultChecked={inverterPrice === InverterPrice.Relative}
              onChange={(newValue) => setInverterPrice(newValue ? InverterPrice.Relative : InverterPrice.Absolute)}
            />
          </Form.Item>
        </Col>
        { inverterPrice === InverterPrice.Absolute ?
          <Col xs={24} sm={6}>
            <Form.Item name="priceOfInverterAbsolute" label={t('inputForm.expertMode.priceOfInverterAbsolute')}
              initialValue={priceOfInverterAbsolute}
            >
              <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
                defaultValue={priceOfInverterAbsolute}
                formatter={formatRupiah}
                parser={parseRupiah}
                step={100000}
                onChange={setPriceOfInverterAbsolute}
              />
            </Form.Item>
          </Col> :
          <Col xs={24} sm={8}>
            <Form.Item name="priceOfInverterFactor" label={t('inputForm.expertMode.priceOfInverterFactor')}
              initialValue={priceOfInverterFactor}
            >
              <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
                defaultValue={priceOfInverterFactor}
                formatter={(value) => formatPercentage(value, i18n.language)}
                parser={(displayValue) => parsePercentage(displayValue)}
                step={0.01}
                onChange={setPriceOfInverterFactor}
              />
            </Form.Item>
          </Col>
        }
        <Col xs={24} sm={6}>
          <Form.Item name="installationCosts" label={t('inputForm.expertMode.installationCosts')}
            initialValue={installationCosts}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={installationCosts}
              formatter={formatRupiah}
              parser={parseRupiah}
              step={100000}
              onChange={setInstallationCosts}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item name="inverterLifetime" label={t('inputForm.expertMode.inverterLifeTime')}
            initialValue={inverterLifetimeInYears}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={inverterLifetimeInYears}
              formatter={(value) => formatDigits(value, 1, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              step={1}
              onChange={setInverterLifetimeInYears}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">{t('inputForm.expertMode.title.appSettings')}</Divider>
      <Row>
        <Col xs={24} sm={8} style={{ fontSize : 16 }}>
            Share settings<br/> <a href={createLink()} target='_blank' ><ShareAltOutlined /></a>&nbsp;
          <a href={createFacebookLink()} target='_blank'><FacebookOutlined  /></a>&nbsp;
          <a href={createTwitterLink()} target='_blank'><TwitterOutlined  /></a>&nbsp;
          <a href={createLinkedinLink()} target='_blank'><LinkedinOutlined  /></a>
        </Col>
        <Col xs={24} sm={8} >
          <Form.Item name="priorityEnabled" valuePropName="checked" initialValue={priorityEnabled}
            label={t('inputForm.expertMode.priorityEnabled')}>
            <Switch
              defaultChecked={priorityEnabled}
              onChange={(newValue) => setPriorityEnabled(newValue)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} >
          <Form.Item name="usageType" valuePropName="checked" initialValue={monthlyUsageType === MonthlyUsage.Rupiah}
            label={t('inputForm.expertMode.usageType')}>
            <Switch
              checkedChildren={MonthlyUsage.Rupiah}
              unCheckedChildren={MonthlyUsage.KWh}
              defaultChecked={monthlyUsageType === MonthlyUsage.Rupiah}
              onChange={(newValue) => setMonthlyUsageType(newValue ? MonthlyUsage.Rupiah : MonthlyUsage.KWh)}
            />
          </Form.Item>
        </Col>
      </Row>
      </>
      }
    </Form>
  )
}