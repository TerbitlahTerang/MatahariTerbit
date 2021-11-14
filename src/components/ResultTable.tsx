import React from 'react'
import { ResultData } from '../services/CalculationService'
import { formatNumber, formatRupiah } from './Formatters'
import { useTranslation } from 'react-i18next'

export interface ResultTableProps {
  results?: ResultData
}

export const ResultTable: React.FunctionComponent<ResultTableProps> = (props) => {
  const { t, i18n } = useTranslation()
  const results = props.results
  if (!results) { return <div>Invalid Data</div> }
  return (
    <table className="results">
      <tbody>
        <tr>
          <td>{t('resultTable.recommendedPanels')}</td>
          <td>{formatNumber(results.numberOfPanels, i18n.language)}</td>
        </tr>
        <tr>
          <td>{t('resultTable.monthlyProduction')}</td>
          <td>{formatNumber(results.productionPerMonthInKwh, i18n.language)} kWh</td>
        </tr>
        <tr>
          <td>{t('resultTable.monthlyConsumption')}</td>
          <td>{formatNumber(results.consumptionPerMonthInKwh, i18n.language)} kWh</td>
        </tr>
        <tr>
          <td>{t('resultTable.minimalMonthlyCosts')}</td>
          <td>{formatRupiah(results.minimalMonthlyCosts)}</td>
        </tr>
      </tbody>
    </table>
  )

}