import React from 'react'
import { Bar } from 'react-chartjs-2'
import { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import { useTranslation } from 'react-i18next'
import { ReturnOnInvestment } from '../services/CalculationService'
import { formatRupiah } from '../services/Formatters'

export interface ROIChartProps {
  yearly: ReturnOnInvestment[]
  inverterLifetimeInYears: number
  cacheBuster: number
}



export const ROIChart: React.FunctionComponent<ROIChartProps> = (props) => {
  const { t } = useTranslation()

  const colors = props.yearly.map((value) => value.cumulativeProfit < 0 ? 'rgb(255, 99, 132)' : 'rgb(99, 255, 132)')

  const data: ChartData<'bar', number[]> = {
    labels: props.yearly.map(x => x.index),
    datasets: [
      {
        label: 'Jt. Rupiah' + props.cacheBuster,
        data: props.yearly.map((x) => x.cumulativeProfit / 1000000),
        backgroundColor: colors,
        borderColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  }

  const title = (toolTipItems: TooltipItem<'bar'>[]) => {
    const year = toolTipItems[0].label
    return t('chart.tooltipTitle', { year })
  }

  const label = (toolTipItem: TooltipItem<'bar'>) => {
    return formatRupiah((toolTipItem.raw as number) * 1000000)
  }

  const footer = (toolTipItems: TooltipItem<'bar'>[]) => {
    const year = toolTipItems[0].label
    return year === `${props.inverterLifetimeInYears + 1}` ? t('chart.inverterReplacement')  : ''
  }

  const options: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: title,
          label: label,
          footer: footer
        }
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