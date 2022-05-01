import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DEFAULT_ZOOM, INITIAL_INPUT_DATA } from '../constants'
import { Coords, MapState, mapStore } from '../util/mapStore'
import { MapMarker } from './MapMarker'
import './MapPicker.css'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as ReactDOMServer from 'react-dom/server'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import { IrradiationGauge } from './IrradiationGauge'

export interface MapPickerProps {
  value?: MapState
  onChange?: (value: MapState) => void
}


export const MapPicker: React.FunctionComponent<MapPickerProps> = ({ value, onChange }) => {

  const { t } = useTranslation()

  const [mapState, setMapState] = useState<MapState>(value!)
  const [position, setPosition] = useState<Coords>(value!.location)
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)
  const [collapsed, setCollapsed] = useState<boolean>(true)


  useLayoutEffect(() => {
    mapStore.subscribe((state) => {
      setMapState(state)
      if (onChange) { onChange(state) }
    })
  }, [])

  const updatePosition = async (location: Coords) => {
    mapStore.setLocation(location)
    console.log('mapStore.setLocation(location)', location)
    setPosition(location)
  }

  const setLocation = (coordinates: Coords) => {
    updatePosition(coordinates)
    setZoom(16)
  }

  const locationNotFound = () => {
    console.log('no location')
    setCollapsed(false)
  }

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setLocation(e.latlng)
        map.flyTo(e.latlng, map.getZoom(), { animate: true })
      },
      locationfound(e) {
        console.log('locationfound', e)
        setLocation(e.latlng)
        console.log('flyto', e)
        map.flyTo(e.latlng, map.getZoom(), { animate: true, duration: 1 })
      },
      locationerror(e) {
        locationNotFound()
      }
    })
    useEffect(() => {
      if (position === INITIAL_INPUT_DATA.location.location) {
        console.log('locate')
        const lok = map.locate()
        console.log('lok', lok)
      }
    })

    return position ? (
      <Marker position={position} icon={L.divIcon({ className: 'custom-icon', html: ReactDOMServer.renderToString(<MapMarker />) })}>
      </Marker>
    ): null
  }

  return (
    <div>
      <div className={`map-picker ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="ant-input map-picker-header">
          <div className="map-picker-address" onClick={() => { setCollapsed(!collapsed) }}>
            {mapState.address === '' ? (mapState.info ? t('inputForm.findingLocation'): t('inputForm.chooseLocation')) : mapState.address}
          </div>
          <Button
            style={{ color: '#bfbfbf' }}
            icon={collapsed ? <DownOutlined /> : <UpOutlined />}
            type="text"
            loading={false}
            size="small"
            onClick={() => { setCollapsed(!collapsed) }} />
        </div>
        <div className="map-picker-view">
          <MapContainer center={[position.lat, position.lng]} zoom={zoom} scrollWheelZoom={false} id='map'
          >
            <TileLayer
              url='https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
              subdomains={['mt0','mt1','mt2','mt3']}
            />
            <LocationMarker />
          </MapContainer>
        </div>
      </div>
      <div className="ant-col ant-form-item-label solarIntensity">
        <label>
          {t('inputForm.solarIntensity')}
        </label>
      </div>
      <IrradiationGauge irradiation={mapState.info ? mapState.info.dni : 600} />
    </div>
  )
}
