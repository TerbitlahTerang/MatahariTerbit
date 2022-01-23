import React from 'react'
import panelImage from '../assets/images/panel-monocrystaline.png'
import panelImageWebp from '../assets/images/panel-monocrystaline.webp'
import './SolarPanel.css'

interface SolarPanelProps {
  width: number
  index: number
}

const SolarPanel: React.FunctionComponent<SolarPanelProps> = (props) => {
  return (
    <div className='panel' >
      <picture >
        <source type="image/webp"  srcSet={panelImageWebp} />
        <img width={props.width} src={panelImage} />
      </picture>

      <div className="number-overlay">
        <span aria-hidden="true">{props.index}</span>
      </div>
    </div>
  )
}

export const renderPanel = (index: number) => {
  return <SolarPanel width={50} key={index} index={index} />
}