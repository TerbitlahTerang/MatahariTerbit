import { Col, Divider, Row } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ResultData } from '../services/CalculationService'
import { formatDigits, formatNumber, formatRupiah } from './Formatters'
import { CALCULATOR_VALUES } from '../constants'
import { renderPanel } from './SolarPanel'

export interface ResultTableProps {
  results?: ResultData
}

export const ResultTable: React.FunctionComponent<ResultTableProps> = (props) => {
  const { t, i18n } = useTranslation()
  const results = props.results
  const panels = Array.from(Array(results?.numberOfPanels).keys()).map(x => x + 1)
  if (!results) {
    return <div>Invalid Data</div>
  }
  return (
    <div className="ant-table">
      <Row gutter={12} className="results">
        <Col span={24}>{t('resultTable.recommendedPanels')}</Col>
      </Row>
      <Row gutter={12} className="panelPane">
        <Col span={24} className="panelContainer">{panels.map(renderPanel)}</Col>
      </Row>
      <Row gutter={12} justify="end">
        <Col span={15}>{t('resultTable.installedCapacity')}</Col>
        <Col
          span={9}>{formatDigits(results.numberOfPanels * CALCULATOR_VALUES.kiloWattPeakPerPanel, 2, i18n.language)} kWp</Col>
      </Row>
      <Row gutter={12} justify="center">
        <Col span={15}>{t('resultTable.areaRequired')}</Col>
        <Col
          span={9}>{formatDigits(results.numberOfPanels * CALCULATOR_VALUES.areaPerPanel, 0, i18n.language)} ㎡</Col>
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
      <Divider/>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.currentMonthlyCosts')}</Col>
        <Col span={9}>{formatRupiah(results.currentMonthlyCosts)}</Col>
      </Row>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.remainingMonthlyCosts')}</Col>
        <Col  span={9}>{formatRupiah(results.remainingMonthlyCosts)}</Col>
      </Row>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.monthlyProfit')}</Col>
        <Col  span={9}>{formatRupiah(results.currentMonthlyCosts - results.remainingMonthlyCosts)}</Col>
      </Row>
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.yearlyProfit')}</Col>
        <Col  span={9}>{formatRupiah((results.currentMonthlyCosts - results.remainingMonthlyCosts) * 12)}</Col>
      </Row>
    </div>
  )
}