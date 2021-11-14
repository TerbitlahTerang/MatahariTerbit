import React from 'react'
import { Bar } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import { useTranslation } from 'react-i18next'

export interface ROIChartProps {
  totalSystemCosts: number
  yearlyProfit: number
}

export const ROIChart: React.FunctionComponent<ROIChartProps> = (props) => {
  const { t } = useTranslation()

  const years = Array.from(Array(20).keys()).map(x => x + 1)

  const profit = years.map(x => Math.round((-props.totalSystemCosts + (x * props.yearlyProfit)) / 1000000))
  const colors = profit.map((value) => value < 0 ? 'rgb(255, 99, 132)' : 'rgb(99, 255, 132)')

  const data: ChartData<'bar', number[]> = {
    labels: years,
    datasets: [
      {
        label: 'Jt. Rupiah',
        data: profit,
        backgroundColor: colors,
        borderColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    scales: {
      y: {
        title: {
          text: t('chart.labelProfit'),
          display: true
        },
        ticks: {
          callback: (val: number| string): string => {
            return 'Jt. ' + val
          }
        }
      },
      x: {
        title: {
          text: t('chart.labelYear'),
          display: true
        }
      }
    }
  }

  return <Bar data={data} options={options} />
}