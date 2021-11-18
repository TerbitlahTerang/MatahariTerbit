import React from 'react'
import PanelImage from '../assets/images/panel.svg'

export interface SolarPanelProps {
  width: number
}

export const SolarPanel: React.FunctionComponent<SolarPanelProps> = (props) => {
  return (
    <div style={{ float: 'left' }} >
      <PanelImage style={{ width: props.width, height: props.width * 1.41429, transform: 'translate(-10, 0)' }} />
    </div>
  )
}