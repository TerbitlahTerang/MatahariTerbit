import React from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'

export const MonthlyCosts: React.FunctionComponent = () => {
  const { t } = useTranslation()
  return (<Card size='small' title={t('inputForm.monthlyBill')}><p>blabla</p></Card>)
}