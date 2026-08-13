import React from 'react'
import { formatNumber, formatRupiah } from '../services/Formatters'
import { ReturnOnInvestment } from '../services/CalculationService'
import { useTranslation } from 'react-i18next'
import './ROIBreakdown.css'
import { Table } from 'antd'


export interface ROIBreakdownProps {
  yearly: ReturnOnInvestment[]
}

export const ROIBreakdown: React.FunctionComponent<ROIBreakdownProps> = (props) => {
  const { t, i18n } = useTranslation()

  const columns = [
    {
      title: t('roiTable.year'),
      dataIndex: 'index'
    },
    {
      title: t('roiTable.output'),
      dataIndex: 'output',
      render: ((output: number) => `${formatNumber(output, i18n.language)} kWh`)
    },
    {
      title: t('roiTable.curtailed'),
      dataIndex: 'curtailedInKwh',
      render: ((curtailedInKwh?: number) => `${formatNumber(curtailedInKwh ?? 0, i18n.language)} kWh`)
    },
    {
      title: t('roiTable.tariff'),
      dataIndex: 'tariff',
      render: ((tariff: number) => formatRupiah(tariff))
    },
    {
      title: t('roiTable.replaced'),
      key: 'replaced',
      render: ((_: unknown, row: ReturnOnInvestment) => {
        const replaced = [
          (row.panelReplacementCost ?? 0) > 0 ? t('roiTable.panels') : undefined,
          (row.inverterReplacementCost ?? 0) > 0 ? t('roiTable.inverter') : undefined,
          (row.batteryReplacementCost ?? 0) > 0 ? t('roiTable.battery') : undefined
        ].filter((x): x is string => x !== undefined)
        return replaced.join(', ')
      })
    },
    {
      title: t('roiTable.profit'),
      dataIndex: 'cumulativeProfit',
      render: ((cumulativeProfit: number) => formatRupiah(cumulativeProfit))
    }
  ]


  return (
    <Table dataSource={props.yearly} columns={columns} className='roiBreakdown' pagination={false} rowKey={res => res.index}>
      <Table.Summary fixed={true} />
    </Table>
  )
}