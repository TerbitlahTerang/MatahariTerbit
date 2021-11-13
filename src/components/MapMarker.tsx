import React from 'react'

export interface MapMarkerProps {
  lat: number
  lng: number
}

export const MapMarker: React.FunctionComponent<MapMarkerProps> = (props) => {
  props.lat
  props.lng
  props.children
  return (
    <div>
      MARKER: {props.lat} x {props.lng}
      {props.children}
    </div>
  )
}
