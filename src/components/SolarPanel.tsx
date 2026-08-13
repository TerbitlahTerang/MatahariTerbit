import React from 'react'

import './SolarPanelPane.css'

export interface Panel {
  index: number
}

const panelImage = '../assets/images/panel-monocrystaline.png'
const panelImageWebp = '../assets/images/panel-monocrystaline.webp'

const SolarPanel: React.FunctionComponent<Panel> = (props) => {
  return (
    <div className='panel' >
      <picture >
        <source type="image/webp" srcSet={panelImageWebp} />
        <img src={panelImage} alt='solar panel' />
      </picture>

      <div className='numberOverlay'>
        <span aria-hidden="true">{props.index}</span>
      </div>
    </div>
  )
}

const renderPanel = (panel: Panel) => {
  return <SolarPanel key={panel.index} index={panel.index} />
}

export interface PaneProps {
  panels: Panel[]
}


export const SolarPanelPane: React.FunctionComponent<PaneProps> = (props: PaneProps) => {
  return (<div className='panelPane' style={{ float: 'right' }}>{props.panels.map(renderPanel)}</div>)
}
