import React from 'react'
// import panelImage from '../../public/images/panel-monocrystaline.png'
import panelImageWebp from '../../public/images/panel-monocrystaline.webp'
import panelImageGreen from '../assets/images/panel-monocrystaline-green.png'
import panelImageWebpGreen from '../../public/images/panel-monocrystaline-green.webp'
import './SolarPanel.module.scss'
import { OptimizationTarget } from '../constants'
import Image from 'next/image'

interface SolarPanelProps {
  index: number,
  panelType: OptimizationTarget
}


export interface Panel {
  index: number,
  panelType: OptimizationTarget
}

export const SolarPanel: React.FunctionComponent<SolarPanelProps> = (props) => {
  // const image = props.panelType === OptimizationTarget.Money ? panelImage : panelImageGreen
  const imageWebp = props.panelType === OptimizationTarget.Money ? panelImageWebp : panelImageWebpGreen
  return (
    <div className='panel' >
      {/*<picture >*/}
      {/*  <source type="image/webp" srcSet={imageWebp} />*/}
      {/*  <img src={image} />*/}
      {/*</picture>*/}
      <Image src={imageWebp} placeholder='blur' sizes="25 50"  layout='responsive' />

      <div className="number-overlay">
        <span aria-hidden="true">{props.index}</span>
      </div>
    </div>
  )
}

export const renderPanel = (panel: Panel) => {
  return <SolarPanel key={panel.index} index={panel.index} panelType={panel.panelType} />
}