import React from 'react'
import { Bar } from 'react-chartjs-2'

export interface ROIChartProps {
  totalSystemCosts: number
  yearlyProfit: number
}

export const ROIChart: React.FunctionComponent<ROIChartProps> = (props) => {
  const years = Array.from(Array(25).keys()).map(x => x + 1)

  const profit = years.map(x => Math.round((-props.totalSystemCosts + (x * props.yearlyProfit)) / 1000000))
  const colors = profit.map((value) => value < 0 ? 'rgb(255, 99, 132)' : 'rgb(99, 255, 132)')

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Jt. Rupiah',
        data: profit,
        fill: false,
        backgroundColor: colors,
        borderColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  }
  return <Bar data={data} />
}