import React from 'react'

export interface MapMarkerProps {
  lat: number
  lng: number
}

export const MapMarker: React.FunctionComponent<MapMarkerProps> = (props) => {
  return (
    <div>
      MARKER: {props.lat} x {props.lng}
      {props.children}
    </div>
  )
}
