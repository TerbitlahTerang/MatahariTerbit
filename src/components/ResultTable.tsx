import { Col, Row } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ResultData } from '../services/CalculationService'
import { formatDigits, formatNumber } from '../services/Formatters'
import { CalculatorSettings, OptimizationTarget } from '../constants'
import { Panel, renderPanel } from './SolarPanel'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Documentation, toExplanation } from '../services/DocumentationService'

export interface ResultTableProps {
  results?: ResultData,
  calculatorSettings: CalculatorSettings,
  onOpenDocumentation:  (d: Documentation, title: string) => void
}

export const ResultTable: React.FunctionComponent<ResultTableProps> = (props) => {
  const { t, i18n } = useTranslation()
  const { results, calculatorSettings, onOpenDocumentation }  = props
  if (!results) {
    return <div>Invalid Data</div>
  }

  const panels: Panel[] = Array.from(Array(results?.numberOfPanels).keys())
    .map(x =>{ return { index: (x + 1), panelType: x >= results.numberOfPanelsFinancial ? OptimizationTarget.Green: OptimizationTarget.Money } } )

  return (
    <div className="ant-table">
      <Row gutter={12} className="panelPane">
        <Col xs={10} sm={8} >{t('resultTable.numberOfPanels')} {panels.length} <InfoCircleOutlined onClick={() => onOpenDocumentation(Documentation.NumberOfPanels, t('resultTable.recommendedPanels'))}/></Col>
        <Col xs={14} sm={16} className="panelContainer"><div style={{ float: 'right' }}>{panels.map(renderPanel)}</div></Col>
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
    </div>
  )
}