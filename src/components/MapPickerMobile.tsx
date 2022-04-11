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

export interface Address {
  street: string | null
  city: string | null
  region: string | null
  name: string | null
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
    <div>
      <div style={{ height: '20px' }} className="map-picker-irradiation-gauge">
        <input style={{ height: '20px' }} type="range" min="600" max="2200"
          value={mapState?.info ? mapState.info.dni : 600} className="slider" list="tickmarks"
          id="myRange"/>
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
      {mapState.info && <div><span>{mapState.address} /</span><span
        className="map-picker-irradiation">{formatNumber(mapState.info.dni, i18n.language)}&nbsp;kWh/m2</span></div>}
    </div>
  )
}
