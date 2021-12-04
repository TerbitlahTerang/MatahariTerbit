import React from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import PlnImage from '../../assets/images/pln-app.png'

export const ConnectionPower: React.FunctionComponent = () => {
  const { t } = useTranslation()
  return (<Card size='small' title={t('inputForm.connectionPower')}>
    <img width='250px'  src={PlnImage} />
    <p>blabla</p>
  </Card>)
}