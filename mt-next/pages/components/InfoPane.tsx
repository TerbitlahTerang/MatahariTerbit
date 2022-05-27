import React from 'react'
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
    <div className={Documentation[props.documentation]}
      dangerouslySetInnerHTML={createMarkup(documentation(i18n.resolvedLanguage as Locale, props.documentation))} />
  )
}