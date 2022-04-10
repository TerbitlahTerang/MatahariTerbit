import React, { useEffect, useLayoutEffect, useState } from 'react'
import { MapState } from '../util/mapStore'
import './MapPicker.css'
import { JsonParam, useQueryParam, withDefault } from 'use-query-params'
import { formatNumber } from '../services/Formatters'
import i18n from '../i18n'
import { Coords } from 'google-map-react'
import { mapStoreMobile } from '../util/mapStoreMobile'

export interface MapPickerPropsMobile {
  value?: MapState
  onChange?: (value: MapState) => void
}

interface Address {
  street: string | null
  city: string | null
  region: string | null
}

export interface NativeLocation {
  coords: Coords
  address: Address
}

export const MapPickerMobile: React.FunctionComponent<MapPickerPropsMobile> = (props) => {

  const [locationParam] = useQueryParam('location', withDefault(JsonParam, JSON.stringify({
    coords: props.value!.location, address: { street: null, city: null, region: null }
  })))
  const [mapState, setMapState] = useState<MapState>(props.value!)

  const setLocation = (location: NativeLocation) => {
    if (location) {
      console.log(location)
      mapStoreMobile.setLocation(location)
    }
  }

  useEffect(() => {
    setLocation(locationParam)
  }, [])

  useLayoutEffect(() => {
    mapStoreMobile.subscribe((value) => {
      setMapState(value)
      if (props.onChange) {
        props.onChange(value)
      }
    })
  }, [])


  return (
    <div><span>
      {mapState.info ? (<span>Irradiation at your location: {mapState.address}
        <div
          className="map-picker-irradiation">{formatNumber(mapState.info.dni, i18n.language)}&nbsp;kWh/m2</div></span>) :
        <span>Fetching irradiation info...</span>}
    </span></div>
  )
}
