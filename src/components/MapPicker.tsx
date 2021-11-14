import GoogleMapReact, { Coords, Point } from 'google-map-react'
import React, { useEffect, useState } from 'react'
import { DEFAULT_LOCATION, DEFAULT_ZOOM, GOOGLE_MAPS_KEY } from '../constants'
import { MapMarker } from './MapMarker'

const distanceToMouse = (pt: Point, { x, y }: Point) => Math.sqrt((pt.x - x) * (pt.x - x) + (pt.y - 24 - y) * (pt.y - 24 - y))

export const MapPicker: React.FunctionComponent = () => {
  const [position, setPosition] = useState<Coords>(DEFAULT_LOCATION)
  const [center, setCenter] = useState<Coords>(DEFAULT_LOCATION)
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)
  const [draggable, setDraggable] = useState<boolean>(true)

  const onMouseDrag = (childKey: string, childProps: unknown, coords: Coords) => {
    setDraggable(false)
    setPosition(coords)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const latLng = { lat: coords.latitude, lng: coords.longitude }
      setPosition(latLng)
      setCenter(latLng)
      setZoom(16)
    })
  })

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMapReact draggable={draggable} bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }} center={center} zoom={zoom}
        options={{ mapTypeControl: true }}
        yesIWantToUseGoogleMapApiInternals
        onChildMouseDown={onMouseDrag}
        onChildMouseUp={() => { setDraggable(true) }}
        onChildMouseMove={onMouseDrag}
        onClick={({ lat, lng }) => setPosition({ lat, lng }) }
        distanceToMouse={distanceToMouse}>
        <MapMarker lat={position.lat} lng={position.lng} />
      </GoogleMapReact>
    </div>
  )
}
