import { Divider } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ResultData } from '../services/CalculationService'
import { formatNumber, formatRupiah } from './Formatters'

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
            <td>{t('resultTable.recommendedPanels')}</td>
            <td>{formatNumber(results.numberOfPanels, i18n.language)}</td>
          </tr>
          <tr>
            <td>{t('resultTable.monthlyConsumption')}</td>
            <td>{formatNumber(results.consumptionPerMonthInKwh, i18n.language)} kWh</td>
          </tr>
          <tr>
            <td>{t('resultTable.monthlyProduction')}</td>
            <td>{formatNumber(results.productionPerMonthInKwh, i18n.language)} kWh</td>
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