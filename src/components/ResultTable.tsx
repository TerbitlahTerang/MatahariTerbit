import { Col, Divider, Row } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ResultData } from '../services/CalculationService'
import { formatDigits, formatNumber, formatRupiah } from './Formatters'
import { CalculatorSettings, OptimizationTarget } from '../constants'
import { Panel, renderPanel } from './SolarPanel'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Documentation, toExplanation } from '../services/DocumentationService'

export interface ResultTableProps {
  results?: ResultData,
  calculatorSettings: CalculatorSettings,
  onOpenDocumentation:  (d: Documentation, title: string) => void
}

interface BreakEvenPoint {
  years: number
  months: number
}


export const ResultTable: React.FunctionComponent<ResultTableProps> = (props) => {
  const { t, i18n } = useTranslation()
  const { results, calculatorSettings, onOpenDocumentation }  = props
  if (!results) {
    return <div>Invalid Data</div>
  }

  const panels: Panel[] = Array.from(Array(results?.numberOfPanels).keys())
    .map(x =>{ return { index: (x + 1), panelType: x >= results.numberOfPanelsFinancial ? OptimizationTarget.Green: OptimizationTarget.Money } } )

  const monthsInYear = 12
  const breakEven: BreakEvenPoint = {
    years: Math.floor(results.breakEvenPointInMonths / monthsInYear),
    months: Math.round(results.breakEvenPointInMonths % monthsInYear)
  }

  return (
    <div className="ant-table">
      <Divider orientation="left">{t('resultTable.recommendedPanels')}&nbsp;
        <InfoCircleOutlined onClick={() => onOpenDocumentation(Documentation.NumberOfPanels, t('resultTable.recommendedPanels'))}/>
      </Divider>
      <Row gutter={12} className="panelPane">
        <Col span={24} className="panelContainer">{panels.map(renderPanel)}</Col>
      </Row>
      <Row gutter={12} justify="end">
        <Col span={15}>{t('resultTable.installedCapacity')}</Col>
        <Col
          span={9}>{formatDigits(results.numberOfPanels * calculatorSettings.kiloWattPeakPerPanel, 2, i18n.language)} kWp</Col>
      </Row>
      <Row gutter={12} justify="end">
        <Col span={10}>{t('resultTable.limitingFactor')}
            &nbsp;
          <InfoCircleOutlined onClick={() => onOpenDocumentation(toExplanation(results.limitingFactor), t('resultTable.limitingFactor'))}/>
        </Col>
        <Col
          span={14}>{t('resultTable.limitingFactorEnum.' + results.limitingFactor)} </Col>
      </Row>
      <Row gutter={12} justify="center">
        <Col span={20}>{t('resultTable.areaRequired')}&nbsp;
          <InfoCircleOutlined onClick={() => onOpenDocumentation(Documentation.AreaRequired,t('resultTable.areaRequired'))}/>
        </Col>
        <Col
          span={4}>{formatDigits(results.numberOfPanels * calculatorSettings.areaPerPanel, 0, i18n.language)} ㎡</Col>
      </Row>
      <Row gutter={12} justify="center">
        <Col span={15}>{t('resultTable.monthlyConsumption')}</Col>
        <Col
          span={9}><span>{`${formatNumber(results.consumptionPerMonthInKwh, i18n.language)} kWh`}</span></Col>
      </Row>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.monthlyProduction')}</Col>
        <Col span={9}>{`${formatNumber(results.productionPerMonthInKwh, i18n.language)} kWh`}</Col>
      </Row>
      <Divider orientation="left">{t('resultTable.financialHeading')}</Divider>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.currentMonthlyCosts')}</Col>
        <Col span={9}>{formatRupiah(results.currentMonthlyCosts)}</Col>
      </Row>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.remainingMonthlyCosts')}&nbsp;
          <InfoCircleOutlined onClick={() => onOpenDocumentation(Documentation.MinimalPayment,t('resultTable.remainingMonthlyCosts'))}/>
        </Col>
        <Col span={9}>{formatRupiah(results.remainingMonthlyCosts)}</Col>
      </Row>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.monthlyProfit')}</Col>
        <Col span={9}>{formatRupiah(results.monthlyProfit)}</Col>
      </Row>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.yearlyProfit')}</Col>
        <Col span={9}>{formatRupiah(results.yearlyProfit)}</Col>
      </Row>
      <Row gutter={12}>
        <Col span={11}>{t('resultTable.breakEven')}&nbsp;
          <InfoCircleOutlined onClick={() => onOpenDocumentation(Documentation.RoiExplanation,t('resultTable.breakEven'))}/>
        </Col>
        <Col span={13}>{t('resultTable.breakEvenExplanation', { breakEven })}</Col>
      </Row>
    </div>
  )
}