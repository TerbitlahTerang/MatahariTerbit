import React from 'react'
import MarkerIcon from '../assets/icons/sunrise-marker.svg'

export interface MapMarkerProps {
}

export const MapMarker: React.FunctionComponent<MapMarkerProps> = (props) => {
  return (
    <div style={{ width: 32, height: 48, cursor: 'pointer', transform: 'translate(-16px, -48px)' }}>
      <MarkerIcon />
    </div>
  )
}
