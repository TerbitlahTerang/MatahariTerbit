import React from 'react'

import './SolarPanelPane.css'
import { OptimizationTarget } from '../constants'

interface SolarPanelProps {
  index: number,
  panelType: OptimizationTarget
}


export interface Panel {
  index: number,
  panelType: OptimizationTarget
}

const panelImage = '../assets/images/panel-monocrystaline.png'
const panelImageWebp = '../assets/images/panel-monocrystaline.webp'
const panelImageGreen = '../assets/images/panel-monocrystaline-green.png'
const panelImageWebpGreen = '../assets/images/panel-monocrystaline-green.webp'

const SolarPanel: React.FunctionComponent<SolarPanelProps> = (props) => {
  const image = props.panelType === OptimizationTarget.Money ? panelImage : panelImageGreen
  const imageWebp = props.panelType === OptimizationTarget.Money ? panelImageWebp : panelImageWebpGreen
  return (
    <div className='panel' >
      <picture >
        <source type="image/webp" srcSet={imageWebp} />
        <img src={image} alt='solar panel' />
      </picture>

      <div className='numberOverlay'>
        <span aria-hidden="true">{props.index}</span>
      </div>
    </div>
  )
}

const renderPanel = (panel: Panel) => {
  return <SolarPanel key={panel.index} index={panel.index} panelType={panel.panelType} />
}

export interface PaneProps {
  panels: Panel[]
}


export const SolarPanelPane: React.FunctionComponent<PaneProps> = (props: PaneProps) => {
  return (<div className='panelPane' style={{ float: 'right' }}>{props.panels.map(renderPanel)}</div>)
}
