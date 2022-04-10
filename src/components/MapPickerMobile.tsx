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

export const MapPickerMobile: React.FunctionComponent<MapPickerPropsMobile> = (props) => {
  const [locationParam] = useQueryParam('location', withDefault(JsonParam, JSON.stringify(props.value!.location)))
  const [mapState, setMapState] = useState<MapState>(props.value!)

  const setLocation = (coordinates: Coords) => {
    if (coordinates) {
      console.log(coordinates)
      mapStoreMobile.setLocation(coordinates)
    }
  }

  useEffect(() => {
    setLocation(locationParam)
  }, [])

  useLayoutEffect(() => {
    mapStoreMobile.subscribe((value) => {
      setMapState(value)
      if (props.onChange) { props.onChange(value) }
    })
  }, [])


  return (
    <div><span>
      {mapState.info ? (<span>Irradiation at your location: {mapState.address}<div className="map-picker-irradiation">{formatNumber(mapState.info.dni, i18n.language)}&nbsp;kWh/m2</div></span>): <span>Fetching irradiation info...</span> }
    </span></div>
  )
}
