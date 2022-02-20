import React from 'react'
import panelImage from '../assets/images/panel-monocrystaline.png'
import panelImageWebp from '../assets/images/panel-monocrystaline.webp'
import panelImageGreen from '../assets/images/panel-monocrystaline-green.png'
import panelImageWebpGreen from '../assets/images/panel-monocrystaline-green.webp'
import './SolarPanel.css'
import { OptimizationTarget } from '../constants'

interface SolarPanelProps {
  width: number
  index: number,
  panelType: OptimizationTarget
}


export interface Panel {
  index: number,
  panelType: OptimizationTarget
}

const SolarPanel: React.FunctionComponent<SolarPanelProps> = (props) => {
  const image = props.panelType === OptimizationTarget.Money ? panelImage : panelImageGreen
  const imageWebp = props.panelType === OptimizationTarget.Money ? panelImageWebp : panelImageWebpGreen
  return (
    <div className='panel' >
      <picture >
        <source type="image/webp"  srcSet={imageWebp} />
        <img width={props.width} src={image} />
      </picture>

      <div className="number-overlay">
        <span aria-hidden="true">{props.index}</span>
      </div>
    </div>
  )
}

export const renderPanel = (panel: Panel) => {
  return <SolarPanel width={50} key={panel.index} index={panel.index} panelType={panel.panelType} />
}