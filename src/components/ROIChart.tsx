import React from 'react'
import { Line } from 'react-chartjs-2'
import { ResultData } from '../services/CalculationService'

export interface ROIChartProps {
  data: ResultData
}

export const ROIChart: React.FunctionComponent<ROIChartProps> = (props) => {
  const data = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  }
  return <Line data={data} />
}