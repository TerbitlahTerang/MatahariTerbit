import React from 'react'
import { formatNumber, formatRupiah } from './Formatters'
import { YearlyResult } from '../services/CalculationService'
import { useTranslation } from 'react-i18next'
import './ROIBreakdown.css'


export interface ROIBreakdownProps {
  yearly: YearlyResult[]
}

const YearLine: React.FunctionComponent<YearlyResult> = (res) => {
  const { t , i18n } = useTranslation()
  return (
    <tr className='roiRow'>
      <td>{res.year}</td>
      <td>{formatNumber(res.output, i18n.language)} kWh</td>
      <td>{formatRupiah(res.tariff)}</td>
      <td>{formatRupiah(res.income)}</td>
      <td>{formatRupiah(res.cumulativeProfit)}</td>
      <td>{Math.round(res.pvOutputPercentage * 100)}%</td>
    </tr>
  )
}


const renderYear = (result: YearlyResult) => {
  return <YearLine income={result.income} tariff={result.tariff} pvOutputPercentage={result.pvOutputPercentage} year={result.year} output={result.output} cumulativeProfit={result.cumulativeProfit} key={result.year} />
}


export const ROIBreakdown: React.FunctionComponent<ROIBreakdownProps> = (props) => {
  return (
    <table width='100%' className='roiBreakdown'>
      <tr>
        <th>Year</th>
        <th>Output</th>
        <th>Tariff</th>
        <th>Income</th>
        <th>Profit</th>
        <th>Output</th>
      </tr>
      {props.yearly.map(renderYear)}
    </table>
  )
}