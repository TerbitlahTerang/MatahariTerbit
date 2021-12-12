import React from 'react'
import { Card } from 'antd'

interface InfoPaneProps {
  body: string
}

export const InfoPane: React.FunctionComponent<InfoPaneProps> = (props) => {

  function createMarkup(body: string) {
    return { __html: body }
  }

  return (<Card><div dangerouslySetInnerHTML={createMarkup(props.body)} /></Card>)
}