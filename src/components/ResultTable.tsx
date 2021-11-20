import { Divider } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ResultData } from '../services/CalculationService'
import { formatDigits, formatNumber, formatRupiah } from './Formatters'
import { CALCULATOR_VALUES } from '../constants'

export interface ResultTableProps {
  results?: ResultData
}

export const ResultTable: React.FunctionComponent<ResultTableProps> = (props) => {
  const { t, i18n } = useTranslation()
  const results = props.results
  if (!results) { return <div>Invalid Data</div> }
  return (
    <div className="ant-table">
      <table className="results">
        <tbody>
          <tr>
            <td>{t('resultTable.installedCapacity')}</td>
            <td>{formatDigits(results.numberOfPanels * CALCULATOR_VALUES.kiloWattPeakPerPanel, 2, i18n.language)} kWp</td>
          </tr>
          <tr>
            <td>{t('resultTable.areaRequired')}</td>
            <td>{formatDigits(results.numberOfPanels * CALCULATOR_VALUES.areaPerPanel, 0, i18n.language)} ㎡</td>
          </tr>
          <tr>
            <td>{t('resultTable.monthlyConsumption')}</td>
            <td><span>{`${formatNumber(results.consumptionPerMonthInKwh, i18n.language)} kWh`}</span></td>
          </tr>
          <tr>
            <td>{t('resultTable.monthlyProduction')}</td>
            <td>{`${formatNumber(results.productionPerMonthInKwh, i18n.language)} kWh`}</td>
          </tr>
        </tbody>
      </table>
      <Divider />
      <table className="results">
        <tbody>
          <tr>
            <td>{t('resultTable.currentMonthlyCosts')}</td>
            <td>{formatRupiah(results.currentMonthlyCosts)}</td>
          </tr>
          <tr>
            <td>{t('resultTable.remainingMonthlyCosts')}</td>
            <td>{formatRupiah(results.remainingMonthlyCosts)}</td>
          </tr>
          <tr>
            <td>{t('resultTable.monthlyProfit')}</td>
            <td>{formatRupiah(results.currentMonthlyCosts - results.remainingMonthlyCosts)}</td>
          </tr>
          <tr>
            <td>{t('resultTable.yearlyProfit')}</td>
            <td>{formatRupiah((results.currentMonthlyCosts - results.remainingMonthlyCosts) * 12)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}