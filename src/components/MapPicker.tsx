import GoogleMapReact from 'google-map-react'
import React from 'react'
import { GOOGLE_MAPS_KEY } from '../constants'
import { MapMarker } from './MapMarker'

export const MapPicker: React.FunctionComponent = () => {
  const defaultProps = {
    center: { lat: 10.99835602, lng: 77.01502627 },
    zoom: 11
  }
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMapReact bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }} defaultCenter={defaultProps.center} defaultZoom={defaultProps.zoom}>
        <MapMarker lat={10.99835602} lng={77.01502627}>
          <div>AWESOME</div>
        </MapMarker>
      </GoogleMapReact>
    </div>
  )
}