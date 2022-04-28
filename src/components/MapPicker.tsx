import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DEFAULT_ZOOM } from '../constants'
import i18n from '../i18n'
import { Coords, MapState, mapStore } from '../util/mapStore'
import { formatNumber } from '../services/Formatters'
import { MapMarker } from './MapMarker'
import './MapPicker.css'
import { IrradiationGauge } from './IrradiationGauge'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as ReactDOMServer from 'react-dom/server'
import L from 'leaflet'

export interface MapPickerProps {
  value?: MapState
  onChange?: (value: MapState) => void
}


export const MapPicker: React.FunctionComponent<MapPickerProps> = ({ value, onChange }) => {

  const [mapState, setMapState] = useState<MapState>(value!)
  const [position, setPosition] = useState<Coords>(value!.location)
  const [center, setCenter] = useState<Coords>(value!.location)
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)
  const [collapsed, setCollapsed] = useState<boolean>(false)


  useLayoutEffect(() => {
    mapStore.subscribe((state) => {
      setMapState(state)
      if (onChange) { onChange(state) }
    })
  }, [])

  const updatePosition = async (location: Coords) => {
    mapStore.setLocation(location)
    setPosition(location)
  }

  const setLocation = (coordinates: Coords) => {
    updatePosition(coordinates)
    setCenter(coordinates)
    setZoom(16)
  }

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        // setLocation(e.latlng)
        map.flyTo(e.latlng, map.getZoom(), { animate: true })
      },
      locationfound(e) {
        setPosition(e.latlng)
        console.log('locationfound', e)
        map.flyTo(e.latlng, map.getZoom(), { animate: false })
      }
    })
    useEffect(() => {
      console.log('useEffect')
      // map.locate()
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
          <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom={false} id='map'
          >
            <TileLayer
              url='https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
              subdomains={['mt0','mt1','mt2','mt3']}
            />
            <LocationMarker />
          </MapContainer>
        </div>
      </div>
      <IrradiationGauge irradiation={mapState.info ? mapState.info.dni : 600} />
    </div>
  )
}
