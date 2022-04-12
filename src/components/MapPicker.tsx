import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import GoogleMapReact, { Coords, Point } from 'google-map-react'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DEFAULT_ZOOM, GOOGLE_MAPS_KEY, INITIAL_INPUT_DATA } from '../constants'
import i18n from '../i18n'
import { MapState, mapStore } from '../util/mapStore'
import { formatNumber } from '../services/Formatters'
import { MapMarker } from './MapMarker'
import './MapPicker.css'
import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'

export interface MapPickerProps {
  value?: MapState
  onChange?: (value: MapState) => void
}

const distanceToMouse = (pt: Point, { x, y }: Point) => Math.sqrt((pt.x - x) * (pt.x - x) + (pt.y - 24 - y) * (pt.y - 24 - y))

export const MapPicker: React.FunctionComponent<MapPickerProps> = (props) => {
  const [position, setPosition] = useState<Coords>(props.value!.location)
  const [center, setCenter] = useState<Coords>(props.value!.location)
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)
  const [draggable, setDraggable] = useState<boolean>(true)
  const [mapState, setMapState] = useState<MapState>(props.value!)
  const [collapsed, setCollapsed] = useState<boolean>(true)


  useLayoutEffect(() => {
    mapStore.subscribe((value) => {
      setMapState(value)
      if (props.onChange) { props.onChange(value) }
    })
  }, [])

  const updatePosition = async (location: Coords) => {
    mapStore.setLocation(location)
    setPosition(location)
  }

  const onMouseDrag = (childKey: string, childProps: unknown, location: Coords) => {
    setDraggable(false)
    updatePosition(location)
  }

  const setLocation = (coordinates: Coords) => {
    updatePosition(coordinates)
    setCenter(coordinates)
    setZoom(16)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const coordinates = { lat: coords.latitude, lng: coords.longitude } as Coords
      setLocation(coordinates)
    }, () => {
      setLocation(INITIAL_INPUT_DATA.location.location)
    })
  }, [])
  
  return (
    <div>
      <div className={`map-picker ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="ant-input map-picker-header">
          <div className="map-picker-address" onClick={() => { setCollapsed(!collapsed) }}>
            {mapState.address ?? 'Choose your address ...'}
          </div>
          {mapState.info && (<div className="map-picker-irradiation" onClick={() => setCollapsed(!collapsed)}>{formatNumber(mapState.info.dni, i18n.language)}&nbsp;kWh/m2</div>)}
          <Button
            style={{ color: '#bfbfbf' }}
            icon={collapsed ? <DownOutlined /> : <UpOutlined />}
            type="text"
            loading={false}
            size="small"
            onClick={() => { setCollapsed(!collapsed) }} />
        </div>
        <div className="map-picker-view">
          <GoogleMapReact draggable={draggable} bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }} center={center} zoom={zoom}
            options={{ mapTypeControl: true, mapTypeId: 'hybrid' }}
            yesIWantToUseGoogleMapApiInternals
            onChildMouseDown={onMouseDrag}
            onChildMouseUp={() => { setDraggable(true) }}
            onChildMouseMove={onMouseDrag}
            onClick={({ lat, lng }) => updatePosition({ lat, lng })}
            distanceToMouse={distanceToMouse}>
            <MapMarker lat={position.lat} lng={position.lng} />
          </GoogleMapReact>
        </div>
      </div>
      <div style={{ height: '20px' }} className="map-picker-irradiation-gauge">
        <Animate show={true}
          start={{ x: 600 }}
          update={() => ({
            x: [mapState?.info ? mapState.info.dni : 600],
            timing: { duration: 750, ease: easeExpOut }
          })}
        >
          {(state) => {
            const { x } = state
            return (<input style={{ height: '20px' }} type="range" min="600" max="2200"
              value={x} className="slider" list="tickmarks"
              id="myRange"/>) }
          }
        </Animate>
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
    </div>
  )
}
