import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'
import React from 'react'
import { MapPickerProps } from './MapPicker'

export const IrradiationGauge: React.FunctionComponent<MapPickerProps> = (props) => {
  const mapState = props.value

  return(
    <div>
      <div style={{ height: '20px' }} className="map-picker-irradiation-gauge">
        <Animate show={true}
          start={{ x: 600 }}
          update={() => ({
            x: [mapState?.info ? mapState.info.dni : 600],
            timing: { duration: 750, ease: easeExpOut }
          })}
        >
          {(state) => {
            const { x } = state
            return (<input style={{ height: '20px' }} type="range" min="600" max="2200"
              value={x} className="slider" list="tickmarks"
              id="myRange"/>) }
          }
        </Animate>
      </div>
      <div className="map-picker-irradiation-gauge-legend">
        <span>600</span>
        <span>800</span>
        <span>1000</span>
        <span>1200</span>
        <span style={{ textAlign: 'right' }}>1400</span>
        <span style={{ textAlign: 'right' }}>1600</span>
        <span style={{ textAlign: 'right' }}>1800</span>
        <span style={{ textAlign: 'right' }}>2000</span>
        <span style={{ textAlign: 'right' }}>2200</span>
      </div>
    </div>)
}
