import React from 'react'
import { Card } from 'antd'
import { documentation, Locale } from '../services/DocumentationService'
import { useTranslation } from 'react-i18next'

enum Documentation {
  ConnectionPower
}

interface InfoPaneProps {
  documentation: Documentation
}

export const InfoPane: React.FunctionComponent<InfoPaneProps> = (props) => {

  const { i18n } = useTranslation()

  function createMarkup(body: string) {
    return { __html: body }
  }

  return (<Card><div dangerouslySetInnerHTML={createMarkup(documentation(i18n.language as Locale, props.documentation))} /></Card>)
}