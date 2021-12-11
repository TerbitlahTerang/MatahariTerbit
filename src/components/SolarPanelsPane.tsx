import React from 'react'
// import { ReactComponent as PanelImage } from '../assets/images/panels.svg'

import Panel from '../assets/images/cell3.svg'
import './SolarPanelsPane.css'

interface SolarPanelProps {
  width: number
  index: number
}

interface Index {
  x: number
  y: number
}

const renderCells = (i: Index) => {
  return (
    <Panel style={{ width: 32, height: 48, transform: 'translate(-16px, -48px)' }}  key={i.x+','+ i.y} />
  )
}

const SolarPanel: React.FunctionComponent<SolarPanelProps> = (props) => {
  const panels: Index[] = []
  for (let x =0; x++; x< 7) {
    for (let y=0; y++; y < 10) {
      panels.push({ x: x, y: y })
    }
  }
  return (
    <div className='panel' >
      <div>
        {panels.map(renderCells)}
      </div>
      <div className="number-overlay">
        <span aria-hidden="true">{props.index}</span>
      </div>
    </div>
  )
}

export interface SolarPanelsPaneProps {
  numberOfPanels: number
}

const renderPanel = (index: number) => {
  return <SolarPanel width={50} key={index} index={index} />
}

export const SolarPanelsPane: React.FunctionComponent<SolarPanelsPaneProps> = (props) => {
  const number = props.numberOfPanels
  // const panels = Array.from(Array(number).keys()).map(x => x + 1)
  const panels: Index[] = []
  for (let x =0; x < 7; x++) {
    for (let y=0; y < 10; y++) {
      panels.push({ x: x, y: y })
    }
  }
  console.log(panels)
  return (
    <div className="panelPane">
      <h2>hallo</h2>
      {panels.map(renderCells)}
    </div>
  )
}