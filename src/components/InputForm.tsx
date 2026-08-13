import { Col, Divider, Form, InputNumber, Radio, Row, Select, Switch } from 'antd'
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
} from '../services/Formatters'
import { MapPicker } from './MapPicker'
import {
  BatteryChemistry,
  CALCULATOR_SETTINGS,
  CalculatorSettings, INITIAL_INPUT_DATA,
  InverterPrice,
  MonthlyUsage,
  OptimizationTarget,
  PowerOption,
  powerOptions,
  SystemType
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
import './InputForm.scss'
import * as Analytics from '../services/Analytics'
import { Category } from '../services/Analytics'

export interface InputData {
  monthlyCostEstimateInRupiah: number
  monthlyUsageInKwh: number
  connectionPower: number
  pvOut?: number
  optimizationTarget: OptimizationTarget
  systemType?: SystemType
  calculatorSettings: CalculatorSettings
}

export interface InputFormProps {
  initialValue: InputData,
  onOpenDocumentation: (d: Documentation, title: string) => void
  onChange: (data: InputData) => void,
  expertMode: boolean,
  mobile: boolean
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
  const batterySettings = calcSettings.batterySettings
  const selfConsumptionSettings = calcSettings.selfConsumptionSettings

  const [offGridEnabled, setOffGridEnabled] = useQueryParam('offGridEnabled', withDefault(BooleanParam, calcSettings.offGridEnabled))
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

  const [pvOversizeFactor, setPvOversizeFactor] = useQueryParam('pvOversizeFactor', withDefault(NumberParam, selfConsumptionSettings.pvOversizeFactor))
  const [gridBackupAllowance, setGridBackupAllowance] = useQueryParam('gridBackupAllowance', withDefault(NumberParam, selfConsumptionSettings.gridBackupAllowance))
  const [discountRate, setDiscountRate] = useQueryParam('discountRate', withDefault(NumberParam, priceSettings.discountRate))
  const [analysisPeriodInYears, setAnalysisPeriodInYears] = useQueryParam('analysisPeriodInYears', withDefault(NumberParam, priceSettings.analysisPeriodInYears))
  const [maintenancePercentPerYear, setMaintenancePercentPerYear] = useQueryParam('maintenancePercentPerYear', withDefault(NumberParam, priceSettings.maintenancePercentPerYear))
  const [balanceOfSystemPercent, setBalanceOfSystemPercent] = useQueryParam('balanceOfSystemPercent', withDefault(NumberParam, priceSettings.balanceOfSystemPercent))

  const [chemistry, setChemistry] = useQueryParam('chemistry', withDefault(createEnumParam(Object.values(BatteryChemistry)), batterySettings.chemistry))
  const [depthOfDischarge, setDepthOfDischarge] = useQueryParam('depthOfDischarge', withDefault(NumberParam, batterySettings.depthOfDischarge))
  const [roundTripEfficiency, setRoundTripEfficiency] = useQueryParam('roundTripEfficiency', withDefault(NumberParam, batterySettings.roundTripEfficiency))
  const [pricePerUsableKwh, setPricePerUsableKwh] = useQueryParam('pricePerUsableKwh', withDefault(NumberParam, batterySettings.pricePerUsableKwh))
  const [batteryLifetimeInYears, setBatteryLifetimeInYears] = useQueryParam('batteryLifetimeInYears', withDefault(NumberParam, batterySettings.serviceLifeInYears))

  const applyBatteryChemistry = (newChemistry: BatteryChemistry) => {
    const defaults = newChemistry === BatteryChemistry.LiFePO4
      ? { depthOfDischarge: 0.9, roundTripEfficiency: 0.95, pricePerUsableKwh: 5000000, batteryLifetimeInYears: 10 }
      : { depthOfDischarge: 0.5, roundTripEfficiency: 0.85, pricePerUsableKwh: 2500000, batteryLifetimeInYears: 4 }

    setChemistry(newChemistry)
    setDepthOfDischarge(defaults.depthOfDischarge)
    setRoundTripEfficiency(defaults.roundTripEfficiency)
    setPricePerUsableKwh(defaults.pricePerUsableKwh)
    setBatteryLifetimeInYears(defaults.batteryLifetimeInYears)
    form.setFieldsValue(defaults)
  }

  const [connectionPower, setConnectionPower] = useQueryParam('cp', withDefault(NumberParam, init.connectionPower))
  const [monthlyCostEstimateInRupiah, setMonthlyCostEstimateInRupiah] = useQueryParam('me', withDefault(NumberParam, init.monthlyCostEstimateInRupiah))

  const [systemType, setSystemType] = useQueryParam('systemType', withDefault(createEnumParam(Object.values(SystemType)), init.systemType ?? SystemType.GridHybrid))
  const [daytimeUseShare, setDaytimeUseShare] = useQueryParam('daytimeUseShare', withDefault(NumberParam, calcSettings.selfConsumptionSettings.daytimeUseShare))
  const [peakLoadInWatts, setPeakLoadInWatts] = useQueryParam('peakLoadInWatts', withDefault(NumberParam, calcSettings.selfConsumptionSettings.peakLoadInWatts))
  const [daysOfAutonomy, setDaysOfAutonomy] = useQueryParam('daysOfAutonomy', withDefault(NumberParam, calcSettings.batterySettings.daysOfAutonomy))

  return (
    <Form form={form} layout="vertical" name="calculator"  onFieldsChange={(changedFields) => {
      const firstFields = changedFields[0]
      const name = JSON.stringify(firstFields.name).replace('["', '').replace('"]', '')
      Analytics.event(Category.Form, name, JSON.stringify(firstFields.value) )
      const monthlyBill = form.getFieldValue('monthlyBill')
      const monthlyUsageInKwh = form.getFieldValue('monthlyUsageInKwh')

      const location = form.getFieldValue('location') as MapState
      const pvOut = location.info?.pvout
      const targetValue = form.getFieldValue('optimizationTarget')
      const optimizationTarget = targetValue === undefined || targetValue ? OptimizationTarget.Green : OptimizationTarget.Money

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
          monthlyUsageType,
          discountRate,
          analysisPeriodInYears,
          maintenancePercentPerYear,
          balanceOfSystemPercent
        },
        batterySettings: {
          chemistry,
          daysOfAutonomy,
          depthOfDischarge,
          roundTripEfficiency,
          pricePerUsableKwh,
          serviceLifeInYears: batteryLifetimeInYears
        },
        selfConsumptionSettings: {
          daytimeUseShare,
          peakLoadInWatts,
          pvOversizeFactor,
          gridBackupAllowance
        },
        kiloWattPeakPerPanel,
        areaPerPanel,
        lossFromInverter,
        inverterLifetimeInYears,
        panelLifetimeInYears: CALCULATOR_SETTINGS.panelLifetimeInYears,
        kiloWattHourPerYearPerKWp: CALCULATOR_SETTINGS.kiloWattHourPerYearPerKWp,
        offGridEnabled: offGridEnabled
      }

      props.onChange({
        monthlyCostEstimateInRupiah: monthlyBill,
        monthlyUsageInKwh,
        connectionPower,
        pvOut,
        optimizationTarget,
        systemType,
        calculatorSettings
      })
    }}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="systemType" label={<>{t('inputForm.systemType')}</>} initialValue={systemType}>
            <Radio.Group
              value={systemType}
              optionType="button"
              buttonStyle="solid"
              onChange={(e) => {
                const newSystemType = e.target.value as SystemType
                const newDaysOfAutonomy = newSystemType === SystemType.OffGrid ? 2 : 0.5
                setSystemType(newSystemType)
                setDaysOfAutonomy(newDaysOfAutonomy)
                form.setFieldValue('daysOfAutonomy', newDaysOfAutonomy)
              }}
            >
              <Radio.Button value={SystemType.GridHybrid}>{t('inputForm.systemTypeHybrid')}</Radio.Button>
              <Radio.Button value={SystemType.OffGrid}>{t('inputForm.systemTypeOffGrid')}</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="location" label={<div><><span className="numberCircle"><span>1</span></span>&nbsp;{t('inputForm.location')}</></div>} initialValue={INITIAL_INPUT_DATA.location}
        tooltip={{
          trigger: 'click',
          overlay: '',
          icon: <InfoCircleOutlined
            onClickCapture={() => props.onOpenDocumentation(Documentation.Location, t('inputForm.location'))}/>
        }}
      >
        <MapPicker mobile={props.mobile}/>
      </Form.Item>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          {monthlyUsageType === MonthlyUsage.Rupiah ?
            (<Form.Item name="monthlyBill" label={<div><><span className="numberCircle"><span>2</span></span>&nbsp;{t('inputForm.monthlyBill')}</></div>}
              initialValue={monthlyCostEstimateInRupiah}
              tooltip={{
                trigger: 'click',
                overlay: '',
                icon: <InfoCircleOutlined
                  onClickCapture={() => props.onOpenDocumentation(Documentation.MonthlyBill, t('inputForm.monthlyBill'))}/>
              }}>
              <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
                formatter={formatRupiah}
                parser={parseRupiah}
                step={100000} inputMode="numeric" onChange={setMonthlyCostEstimateInRupiah}/>
            </Form.Item>) : (<Form.Item name="monthlyUsageInKwh" label={<>{t('inputForm.monthlyUsage')}</>}
              initialValue={init.monthlyUsageInKwh}
            >
              <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
                formatter={(value) => formatKwh(value)}
                parser={(displayValue) => parseKwh(displayValue)}
                step={10}/>
            </Form.Item>)
          }
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="optimizationTarget" valuePropName="checked" initialValue={true}
            label={<div><><span className="numberCircle"><span>3</span></span>&nbsp;{t('inputForm.priority')}</></div>}
            tooltip={{
              overlay: '',
              trigger: 'click',
              icon: <InfoCircleOutlined
                onClickCapture={() => props.onOpenDocumentation(Documentation.Priority, t('inputForm.priority'))}/>
            }}>
            <Switch className='prioritySwitch'
              checkedChildren={<>{t('inputForm.priorityEarth')}</>}
              unCheckedChildren={<>{t('inputForm.priorityMoney')}</>}
              defaultChecked={true}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {systemType === SystemType.GridHybrid &&
          <Col xs={24} sm={8}>
            <Form.Item name="connectionPower" label={<>{t('inputForm.connectionPower')}</>}
              initialValue={connectionPower}
            >
              <Select style={{ width: '100%' }} defaultValue={connectionPower} onChange={(val) => setConnectionPower(val)}>{powerOptions.map(renderOption)}</Select>
            </Form.Item>
          </Col>
        }
        <Col xs={24} sm={systemType === SystemType.GridHybrid ? 8 : 12}>
          <Form.Item name="peakLoadInWatts" label={<>{t('inputForm.peakLoad')}</>}
            initialValue={peakLoadInWatts}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={peakLoadInWatts}
              formatter={(value) => formatDigits(value, 0, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              step={100}
              onChange={setPeakLoadInWatts}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={systemType === SystemType.GridHybrid ? 8 : 12}>
          <Form.Item name="daytimeUseShare" label={<>{t('inputForm.daytimeUseShare')}</>}
            initialValue={daytimeUseShare}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={daytimeUseShare}
              formatter={(value) => formatPercentage(value, i18n.language)}
              parser={(displayValue) => parsePercentage(displayValue)}
              step={0.01}
              onChange={setDaytimeUseShare}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="daysOfAutonomy" label={<>{t('inputForm.daysOfAutonomy')}</>}
            initialValue={daysOfAutonomy}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={daysOfAutonomy}
              formatter={(value) => formatDigits(value, 2, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              step={0.1}
              onChange={setDaysOfAutonomy}
            />
          </Form.Item>
        </Col>
      </Row>

      {props.expertMode && <><Divider orientation="left"><>{t('inputForm.expertMode.title.plnSettings')}&nbsp; <InfoCircleOutlined
        onClickCapture={() => props.onOpenDocumentation(Documentation.PlnSettings, t('inputForm.expertMode.title.plnSettings'))}/></></Divider>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name="lowTariff" label={<>{t('inputForm.expertMode.lowTariff')}</>}
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
          <Form.Item name="highTariff" label={<>{t('inputForm.expertMode.highTariff')}</>}
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
          <Form.Item name="lowTariffThreshold" label={<>{t('inputForm.expertMode.lowTariffThreshold')}</>}
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
          <Form.Item name="energyTax" label={<>{t('inputForm.expertMode.energyTax')}</>}
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
            label={<>{t('inputForm.expertMode.minimalMonthlyConsumptionHours')}</>}
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
            label={<>{t('inputForm.expertMode.minimalMonthlyConsumptionPrice')}</>}
            initialValue={minimalMonthlyConsumptionPrice}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={minimalMonthlyConsumptionPrice}
              onChange={setMinimalMonthlyConsumptionPrice}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">{<>{t('inputForm.expertMode.title.systemSettings')}</>}</Divider>
      <Row gutter={16}>
        <Col xs={24} sm={6}>
          <Form.Item name="pricePerPanel" label={<>{t('inputForm.expertMode.pricePerPanel')}</>}
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
            label={<>{t('inputForm.expertMode.electricityPriceInflationRate')}</>}
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
          <Form.Item name="kiloWattPeakPerPanel" label={<>{t('inputForm.expertMode.kiloWattPeakPerPanel')}</>}
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
          <Form.Item name="areaPerPanel" label={<>{t('inputForm.expertMode.areaPerPanel')}</>}
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
          <Form.Item name="lossFromInverter" label={<>{t('inputForm.expertMode.lossFromInverter')}</>}
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
          <Form.Item name="capacityLossRate" label={<>{t('inputForm.expertMode.capacityLossRate')}</>}
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
            label={<>{t('inputForm.expertMode.inverterPrice')}</>}>
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
            <Form.Item name="priceOfInverterAbsolute" label={<>{t('inputForm.expertMode.priceOfInverterAbsolute')}</>}
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
            <Form.Item name="priceOfInverterFactor" label={<>{t('inputForm.expertMode.priceOfInverterFactor')}</>}
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
          <Form.Item name="installationCosts" label={<>{t('inputForm.expertMode.installationCosts')}</>}
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
          <Form.Item name="inverterLifetime" label={<>{t('inputForm.expertMode.inverterLifeTime')}</>}
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
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name="pvOversizeFactor" label={<>{t('inputForm.expertMode.pvOversizeFactor')}</>}
            initialValue={pvOversizeFactor}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={pvOversizeFactor}
              formatter={(value) => formatDigits(value, 2, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              step={0.05}
              onChange={setPvOversizeFactor}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="discountRate" label={<>{t('inputForm.expertMode.discountRate')}</>}
            initialValue={discountRate}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={discountRate}
              formatter={(value) => formatPercentage(value, i18n.language)}
              parser={(displayValue) => parsePercentage(displayValue)}
              step={0.01}
              onChange={setDiscountRate}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="analysisPeriodInYears" label={<>{t('inputForm.expertMode.analysisPeriodInYears')}</>}
            initialValue={analysisPeriodInYears}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={analysisPeriodInYears}
              formatter={(value) => formatDigits(value, 0, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              step={1}
              onChange={setAnalysisPeriodInYears}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="maintenancePercentPerYear" label={<>{t('inputForm.expertMode.maintenancePercentPerYear')}</>}
            initialValue={maintenancePercentPerYear}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={maintenancePercentPerYear}
              formatter={(value) => formatPercentage(value, i18n.language)}
              parser={(displayValue) => parsePercentage(displayValue)}
              step={0.005}
              onChange={setMaintenancePercentPerYear}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="balanceOfSystemPercent" label={<>{t('inputForm.expertMode.balanceOfSystemPercent')}</>}
            initialValue={balanceOfSystemPercent}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={balanceOfSystemPercent}
              formatter={(value) => formatPercentage(value, i18n.language)}
              parser={(displayValue) => parsePercentage(displayValue)}
              step={0.01}
              onChange={setBalanceOfSystemPercent}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left"><>{t('inputForm.expertMode.title.batterySettings')}</></Divider>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name="chemistry" label={<>{t('inputForm.expertMode.chemistry')}</>}
            initialValue={chemistry}
          >
            <Select style={{ width: '100%' }} defaultValue={chemistry} onChange={applyBatteryChemistry}>
              <Select.Option value={BatteryChemistry.LiFePO4}>{BatteryChemistry.LiFePO4}</Select.Option>
              <Select.Option value={BatteryChemistry.LeadAcid}>{BatteryChemistry.LeadAcid}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="depthOfDischarge" label={<>{t('inputForm.expertMode.depthOfDischarge')}</>}
            initialValue={depthOfDischarge}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={depthOfDischarge}
              formatter={(value) => formatPercentage(value, i18n.language)}
              parser={(displayValue) => parsePercentage(displayValue)}
              step={0.01}
              onChange={setDepthOfDischarge}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="roundTripEfficiency" label={<>{t('inputForm.expertMode.roundTripEfficiency')}</>}
            initialValue={roundTripEfficiency}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={roundTripEfficiency}
              formatter={(value) => formatPercentage(value, i18n.language)}
              parser={(displayValue) => parsePercentage(displayValue)}
              step={0.01}
              onChange={setRoundTripEfficiency}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name="pricePerUsableKwh" label={<>{t('inputForm.expertMode.pricePerUsableKwh')}</>}
            initialValue={pricePerUsableKwh}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={pricePerUsableKwh}
              formatter={formatRupiah}
              parser={parseRupiah}
              step={100000}
              onChange={setPricePerUsableKwh}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="batteryLifetimeInYears" label={<>{t('inputForm.expertMode.batteryLifeTime')}</>}
            initialValue={batteryLifetimeInYears}
          >
            <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
              defaultValue={batteryLifetimeInYears}
              formatter={(value) => formatDigits(value, 0, i18n.language)}
              parser={(displayValue) => parseNumber(displayValue)}
              step={1}
              onChange={setBatteryLifetimeInYears}
            />
          </Form.Item>
        </Col>
        {systemType === SystemType.GridHybrid &&
          <Col xs={24} sm={8}>
            <Form.Item name="gridBackupAllowance" label={<>{t('inputForm.expertMode.gridBackupAllowance')}</>}
              initialValue={gridBackupAllowance}
            >
              <InputNumber style={{ width: '100%', textAlign: 'right' }} autoComplete="off"
                defaultValue={gridBackupAllowance}
                formatter={(value) => formatPercentage(value, i18n.language)}
                parser={(displayValue) => parsePercentage(displayValue)}
                step={0.01}
                onChange={setGridBackupAllowance}
              />
            </Form.Item>
          </Col>
        }
      </Row>
      <Divider orientation="left">{<>{t('inputForm.expertMode.title.appSettings')}</>}</Divider>
      <Row>
        <Col xs={24} sm={12} style={{ fontSize : 16 }}>
          Share settings<br/> <a href={createLink()} target='_blank' rel="noreferrer" ><ShareAltOutlined /></a>&nbsp;
          <a href={createFacebookLink()} target='_blank' rel="noreferrer"><FacebookOutlined  /></a>&nbsp;
          <a href={createTwitterLink()} target='_blank' rel="noreferrer"><TwitterOutlined  /></a>&nbsp;
          <a href={createLinkedinLink()} target='_blank' rel="noreferrer"><LinkedinOutlined  /></a>
        </Col>
        <Col xs={24} sm={12} >
          <Form.Item name="usageType" valuePropName="checked" initialValue={monthlyUsageType === MonthlyUsage.Rupiah}
            label={<>{t('inputForm.expertMode.usageType')}</>}>
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