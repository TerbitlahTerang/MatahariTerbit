import React from 'react'
import { ResultData } from '../util/calculations'

export interface ResultTableProps {
  results?: ResultData
}

export const ResultTable: React.FunctionComponent<ResultTableProps> = (props) => {
  if (!props.results) { return <div>Invalid Data</div> }
  return (
    <table className="results">
      <tbody>
        <tr>
          <td>Recommended # of Panels</td>
          <td>{Math.round(props.results.numberOfPanels)}</td>
        </tr>
        <tr>
          <td>Yearly Consumption</td>
          <td>{Math.round(props.results.consumptionPerYearInKwh)} kWh</td>
        </tr>
        <tr>
          <td>Base costs</td>
          <td>{Math.round(props.results.minimalMonthlyCosts)}</td>
        </tr>
      </tbody>
    </table>
  )

}