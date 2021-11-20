import React from 'react'
import { Bar } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import { useTranslation } from 'react-i18next'
import { YearlyResult } from '../services/CalculationService'

export interface ROIChartProps {
  yearly: YearlyResult[]
}



export const ROIChart: React.FunctionComponent<ROIChartProps> = (props) => {
  const { t } = useTranslation()

  const colors = props.yearly.map((value) => value.cumulativeProfit < 0 ? 'rgb(255, 99, 132)' : 'rgb(99, 255, 132)')

  const data: ChartData<'bar', number[]> = {
    labels: props.yearly.map(x => x.year),
    datasets: [
      {
        label: 'Jt. Rupiah',
        data: props.yearly.map((x) => x.cumulativeProfit / 1000000),
        backgroundColor: colors,
        borderColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        display: false
      }
    },
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

  return (<Bar data={data} options={options} />)
}