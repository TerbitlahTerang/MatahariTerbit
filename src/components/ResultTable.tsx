import { Col, Divider, Popover, Row } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ResultData } from '../services/CalculationService'
import { formatDigits, formatNumber, formatRupiah } from './Formatters'
import { CALCULATOR_VALUES, OptimizationTarget } from '../constants'
import { Panel,  renderPanel } from './SolarPanel'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Documentation, toExplanation } from '../services/DocumentationService'
import { InfoPane } from './InfoPane'

export interface ResultTableProps {
  results?: ResultData
}

interface BreakEvenPoint {
  years: number
  months: number
}



export const ResultTable: React.FunctionComponent<ResultTableProps> = (props) => {
  const { t, i18n } = useTranslation()
  const results: ResultData | undefined = props.results
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
      <Row gutter={12} className="results">
        <Col span={24}>{t('resultTable.recommendedPanels')}
                    &nbsp;
          <Popover overlayStyle={{ maxWidth: '320px' }}
            content={<InfoPane documentation={Documentation.NumberOfPanels}/>}
            trigger="click">
            <InfoCircleOutlined/>
          </Popover>
        </Col>
      </Row>
      <Row gutter={12} className="panelPane">
        <Col span={24} className="panelContainer">{panels.map(renderPanel)}</Col>
      </Row>
      <Row gutter={12} justify="end">
        <Col span={15}>{t('resultTable.installedCapacity')}</Col>
        <Col
          span={9}>{formatDigits(results.numberOfPanels * CALCULATOR_VALUES.kiloWattPeakPerPanel, 2, i18n.language)} kWp</Col>
      </Row>
      <Row gutter={12} justify="end">
        <Col span={10}>{t('resultTable.limitingFactor')}
            &nbsp;
          <Popover
            content={<InfoPane documentation={toExplanation(results.limitingFactor)}/>}
            trigger="click">
            <InfoCircleOutlined/>
          </Popover>
        </Col>
        <Col
          span={14}>{t('resultTable.limitingFactorEnum.' + results.limitingFactor)} </Col>
      </Row>
      <Row gutter={12} justify="center">
        <Col span={15}>{t('resultTable.areaRequired')}&nbsp;
          <Popover
            content={<InfoPane documentation={Documentation.AreaRequired}/>}
            trigger="click">
            <InfoCircleOutlined/>
          </Popover></Col>
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
        <Col span={15}>{t('resultTable.remainingMonthlyCosts')}&nbsp;
          <Popover
            content={<InfoPane documentation={Documentation.MinimalPayment}/>}
            trigger="click">
            <InfoCircleOutlined/>
          </Popover>
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
        <Col span={15}>{t('resultTable.breakEven')}&nbsp;
          <Popover
            content={<InfoPane documentation={Documentation.RoiExplanation}/>}
            trigger="click">
            <InfoCircleOutlined/>
          </Popover>
        </Col>
        <Col span={9}>{t('resultTable.breakEvenExplanation', { breakEven })}</Col>
      </Row>
      <Divider/>
    </div>
  )
}