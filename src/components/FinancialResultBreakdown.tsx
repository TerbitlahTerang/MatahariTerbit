import React from 'react'
import { useTranslation } from 'react-i18next'
import { ResultTableProps } from './ResultTable'
import { Col, Divider, Row } from 'antd'
import { formatDigits, formatRupiah } from '../services/Formatters'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Documentation } from '../services/DocumentationService'
import { SystemType } from '../constants'


interface BreakEvenPoint {
  years: number
  months: number
}

export const FinancialResultBreakdown: React.FunctionComponent<ResultTableProps> = (props) => {
  const { t, i18n } = useTranslation()
  const { results, systemType, onOpenDocumentation } = props
  if (!results) {
    return <div>Invalid Data</div>
  }
  const isOffGrid = systemType === SystemType.OffGrid

  const monthsInYear = 12
  const breakEven: BreakEvenPoint = {
    years: Math.floor(results.breakEvenPointInMonths / monthsInYear),
    months: Math.round(results.breakEvenPointInMonths % monthsInYear)
  }

  return (<div className="ant-table">
    <Divider style={{ marginTop: '1px' }} orientation="left">{t('resultTable.financialHeading')}</Divider>
    <Row gutter={12}>
      <Col span={15}>{t('resultTable.currentMonthlyCosts')}</Col>
      <Col span={9}>{formatRupiah(results.currentMonthlyCosts)}</Col>
    </Row>
    {!isOffGrid &&
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.remainingMonthlyCosts')}&nbsp;
          <InfoCircleOutlined onClick={() => onOpenDocumentation(Documentation.MinimalPayment,t('resultTable.remainingMonthlyCosts'))}/>
        </Col>
        <Col span={9}>- {formatRupiah(results.remainingMonthlyCosts)}</Col>
      </Row>
    }
    <Row gutter={12}>
      <Col span={15}>{t('resultTable.monthlyProfit')}</Col>
      <Col span={9} className='total'>{formatRupiah(results.monthlyProfit)}</Col>
    </Row>
    <Row gutter={12}>
      <Col span={24} >&nbsp;</Col>
    </Row>
    <Row gutter={12}>
      <Col span={15}>{t('resultTable.selfSufficiency')}</Col>
      <Col span={9}>{formatDigits(results.selfSufficiencyPercentage ?? 0, 0, i18n.language)} %</Col>
    </Row>
    <Row gutter={12}>
      <Col span={15}>{t('resultTable.curtailed')}</Col>
      <Col span={9}>{`${formatDigits(results.curtailedPerYearInKwh ?? 0, 0, i18n.language)} kWh`}</Col>
    </Row>
    {!isOffGrid &&
      <Row gutter={12}>
        <Col span={15}>{t('resultTable.residualGridBill')}</Col>
        <Col span={9}>{formatRupiah(results.residualAnnualGridBillInRupiah ?? 0)}</Col>
      </Row>
    }
    <Row gutter={12}>
      <Col span={24} >&nbsp;</Col>
    </Row>
    <Row gutter={12}>
      <Col span={15}>{t('resultTable.yearlyProfit')}</Col>
      <Col span={9}>{formatRupiah(results.yearlyProfit)}</Col>
    </Row>
    <Row gutter={12}>
      <Col span={11} className='emphasis'>{t('resultTable.breakEven')}&nbsp;
        <InfoCircleOutlined onClick={() => onOpenDocumentation(Documentation.RoiExplanation,t('resultTable.breakEven'))}/>
      </Col>
      <Col span={13} className='emphasis'>{t('resultTable.breakEvenExplanation', { breakEven })}</Col>
    </Row>
    <Row gutter={12}>
      <Col span={24} />
    </Row>
  </div>)
}

