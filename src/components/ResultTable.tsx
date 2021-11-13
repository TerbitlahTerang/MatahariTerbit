import React from 'react'
import { ResultData } from '../util/calculations'

export interface ResultTableProps {
  data?: ResultData
}

export const ResultTable: React.FunctionComponent<ResultTableProps> = (props) => {
  if (!props.data) { return <div>Invalid Data</div> }
  return (
    <table className="results">
      <tbody>
        <tr>
          <td>Yearly Consumption</td>
          <td>{Math.round(props.data.consumptionPerYearInKwh)} kWh</td>
        </tr>
        <tr>
          <td>Panels</td>
          <td>{Math.round(props.data.numberOfPanels)}</td>
        </tr>
        <tr>
          <td>Base costs</td>
          <td>{Math.round(props.data.baseMonthlyCosts)}</td>
        </tr>
      </tbody>
    </table>
  )

}