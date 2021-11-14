import { Coords } from 'google-map-react'

export function geocode(location: Coords) {
  const geocoder = new window.google.maps.Geocoder()
  return geocoder.geocode({ location })
}
