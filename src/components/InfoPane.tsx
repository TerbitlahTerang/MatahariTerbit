import React from 'react'
import { Card } from 'antd'
import { Documentation, documentation, Locale } from '../services/DocumentationService'
import { useTranslation } from 'react-i18next'

interface InfoPaneProps {
  documentation: Documentation
}

export const InfoPane: React.FunctionComponent<InfoPaneProps> = (props) => {

  const { i18n } = useTranslation()

  function createMarkup(body: string) {
    return { __html: body }
  }

  return (
    <Card size={'small'} className='documentation'>
      <div className={Documentation[props.documentation]}
        dangerouslySetInnerHTML={createMarkup(documentation(i18n.language as Locale, props.documentation))} />
    </Card>
  )
}