import React from 'react'
import PanelImage from '../assets/images/panel.svg'

interface SolarPanelProps {
  width: number
}

const SolarPanel: React.FunctionComponent<SolarPanelProps> = (props) => {
  return (
    <div style={{ float: 'left' }} >
      <PanelImage style={{ width: props.width, height: props.width * 1.41429, transform: 'translate(-10, 0)' }} />
    </div>
  )
}

export interface SolarPanelsPaneProps {
  numberOfPanels: number
}

const renderPanel = (index: number) => {
  return <SolarPanel width={50} key={index} />
}

export const SolarPanelsPane: React.FunctionComponent<SolarPanelsPaneProps> = (props) => {
  const number = props.numberOfPanels || 1
  const panels = Array.from(Array(number).keys()).map(x => x + 1)
  return (
    <div>
      {panels.map(renderPanel)}
    </div>
  )
}