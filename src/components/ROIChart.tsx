import React, { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { ChartData, ChartOptions, Plugin, TooltipItem } from 'chart.js'
import { useTranslation } from 'react-i18next'
import { ReturnOnInvestment } from '../services/CalculationService'
import { formatRupiah } from '../services/Formatters'

export interface ROIChartProps {
  yearly: ReturnOnInvestment[]
  inverterLifetimeInYears: number
  cacheBuster: number
  mobile: boolean
}



export const ROIChart: React.FunctionComponent<ROIChartProps> = (props) => {
  const { t } = useTranslation()


  const colors = props.yearly.map((value) => value.cumulativeProfit < 0 ? '#DA7F7D' : '#F4D797')

  const mouseX = useRef<number>(0)

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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        position: 'nearest',
        intersect: false,
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
            return `${val}`
          }
        }
      },
      x: {
        title: {
          text: t('chart.labelYear'),
          display: true
        },
        ticks: {
          minRotation: 0,
          maxRotation: 0
        }
      }
    }
  }

  const plugins: Plugin<'bar'>[] = [
    {
      id: 'verticalLine',
      afterEvent: (chart, args) => {
        const event = args.event
        if (event.type === 'mousemove') {
          mouseX.current = event.x ?? 0
        }
      },
      afterDraw: (chart) => {
        const x = mouseX.current
        const yAxis = chart.scales.y
        const ctx = chart.ctx
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x, yAxis.top)
        ctx.lineTo(x, yAxis.bottom)
        ctx.lineWidth = 1
        ctx.strokeStyle = '#48709d'
        ctx.stroke()
        ctx.restore()
      }
    }]

  const height = props.mobile ? 200 : 300
  return (<div style={{ display: 'block', minHeight:  `${height}px` }}><Bar data={data} options={options} plugins={plugins}  /></div>)
}