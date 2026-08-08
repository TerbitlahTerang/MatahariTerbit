import React from 'react'
import MarkerIcon from '../assets/icons/sunrise-marker.svg?react'

export const MapMarker: React.FunctionComponent = () => {
  return (
    <div style={{ width: 32, height: 48, cursor: 'pointer', transform: 'translate(-16px, -48px)' }}>
      <MarkerIcon />
    </div>
  )
}
