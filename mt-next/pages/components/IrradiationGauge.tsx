import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'
import React from 'react'
import './IrradiationGauge.module.scss'

interface IrradiationGaugeProps {
  irradiation: number
  mobile: boolean
}

export const IrradiationGauge: React.FunctionComponent<IrradiationGaugeProps> = ({ irradiation, mobile }) => {
  const min = 594
  const max = 2200
  return(
    <div className="map-picker-irradiation-gauge js">
      <div className="map-picker-irradiation-gauge-legend">
        {mobile ?
          (<><span>600</span>
            <span>1000</span>
            <span style={{ textAlign: 'right' }}>1400</span>
            <span style={{ textAlign: 'right' }}>1800</span>
            <span style={{ textAlign: 'right' }}>2200</span></>) :
          (<><span>600</span>
            <span>800</span>
            <span>1000</span>
            <span>1200</span>
            <span style={{ textAlign: 'right' }}>1400</span>
            <span style={{ textAlign: 'right' }}>1600</span>
            <span style={{ textAlign: 'right' }}>1800</span>
            <span style={{ textAlign: 'right' }}>2000</span>
            <span style={{ textAlign: 'right' }}>2200</span></>)

        }
      </div>
      <Animate show={true}
        start={{ x: irradiation }}
        update={() => ({
          x: [irradiation],
          timing: { duration: 750, ease: easeExpOut }
        })}
      >
        {(state) => {
          const { x } = state
          return (<div className='wrap' style={{ height: '20px', '--min' : min, '--max': max, '--val': x } as React.CSSProperties} >
            <input style={{ height: '20px' }} type="range" min="600" max="2200" onChange={() => {}}
              value={x} className="slider" list="tickmarks"
              id="myRange"/>
            <output htmlFor='myRange'>{Math.round(x)}&nbsp;kWh/㎡</output>
          </div>) }
        }
      </Animate>

      <div style={{ backgroundColor: 'white', marginLeft: -1, marginRight: -1, height: '30px' }}>&nbsp;</div>

    </div>)
}
