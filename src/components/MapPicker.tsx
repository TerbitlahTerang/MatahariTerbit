import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { AutoComplete, Button } from 'antd'
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { DEFAULT_ZOOM, GOOGLE_MAPS_KEY, INITIAL_INPUT_DATA } from '../constants'
import { Coords, MapState, mapStore } from '../util/mapStore'
import { MapMarker } from './MapMarker'
import './MapPicker.css'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as ReactDOMServer from 'react-dom/server'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import { GoogleProvider } from 'leaflet-geosearch'
import debounce from 'lodash/debounce'
import { IrradiationGauge } from './IrradiationGauge'
import { DefaultOptionType } from 'rc-select/lib/Select'

export interface MapPickerProps {
  value?: MapState
  onChange?: (value: MapState) => void
}

interface SurtsResult {
  value: Coords
  label: string
}


export const MapPicker: React.FunctionComponent<MapPickerProps> = ({ value, onChange }) => {

  const { t } = useTranslation()

  const [mapState, setMapState] = useState<MapState>(value!)
  const [position, setPosition] = useState<Coords>(value!.location)
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)
  const [collapsed, setCollapsed] = useState<boolean>(false)

  const provider = new GoogleProvider({
    params: {
      key: GOOGLE_MAPS_KEY,
      region: 'id'
    }
  })


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

  const locationNotFound = () => {
    console.log('no location')
    setCollapsed(false)
    setEditMode(true)
  }

  function LocationMarker() {
    const mapInstance: L.Map = useMapEvents({
      click(e) {
        console.log('clickie')
        setZoom(mapInstance.getZoom())
        updatePosition(e.latlng)
        console.log('fly')
      },
      locationfound(e) {
        updatePosition(e.latlng)
        console.log('locationfound', e)
        console.log('flyt', e)
        console.log('flyto', position, mapInstance.getZoom())
        // mapInstance.flyTo(e.latlng, zoom, { animate: true, duration: 1 })
      },
      locationerror(e) {
        locationNotFound()
      }
    })

    useEffect(() => {
      if (position === INITIAL_INPUT_DATA.location.location) {
        const lok = mapInstance.locate()
        console.log('lok', lok)
      }
    })

    useMemo(() => {
      console.log('memo', position, mapInstance.getZoom())
      if (mapInstance.getCenter() !== position || mapInstance.getZoom() !== zoom) {
        console.log('memo-update', mapInstance.getCenter(), position, mapInstance.getZoom(), zoom)
        mapInstance.setView(position, zoom)
      }
      // mapInstance.flyTo(position, zoom)
    }, [position])

    return position ? (
      <Marker position={position} icon={L.divIcon({ className: 'custom-icon', html: ReactDOMServer.renderToString(<MapMarker />) })}>
      </Marker>
    ): null
  }

  const [options, setOptions] = useState<SurtsResult[]>([])
  const previewOptions = useMemo(() => options.map((x) => {return { value: JSON.stringify(x.value), label : x.label }}), [options])

  const findResults = async (s: string) => {
    const results = await provider.search({ query:  s })
    const res: SurtsResult[] = results.map((x) => {
      const coords: Coords = { lat: x.y, lng: x.x }
      return { value: coords, label:  `${x.label}` }  })
    // setOptions(res)
    setOptions(res)
    // console.log(res)
  }

  const [editMode, setEditMode] = useState<boolean>(false)


  return (
    <div>
      <div className={`map-picker ${collapsed ? 'collapsed' : 'expanded'}`} >
        <div className="ant-input map-picker-header">
          {editMode && !collapsed ?
            <AutoComplete onSearch={debounce(findResults, 500)} options={previewOptions} autoFocus={true} onBlur={() => setEditMode(false)}
              onSelect={(x: string, y: DefaultOptionType) => {
                console.log('x', x, y.label)
                const coords = JSON.parse(x)
                // console.log('coords', coords)
                updatePosition(coords)
                setEditMode(false)
                setMapState((prev) => { return { location: prev.location, address: `${y.label}`, info: prev.info } })
              }
              }/> :
            <div className="map-picker-address" onClick={() => {
              if (collapsed) {
                setCollapsed(false)
                setEditMode(true)
              } else {
                setEditMode(true)
              }
            }}>
              {mapState.address === '' ? (mapState.info ? t('inputForm.findingLocation') : t('inputForm.chooseLocation')) : mapState.address}
            </div>
          }
          <Button
            style={{ color: '#bfbfbf' }}
            icon={collapsed ? <DownOutlined /> : <UpOutlined />}
            type="text"
            loading={false}
            size="small"
            onClick={() => { setCollapsed(!collapsed) }} />
        </div>

        <div className="map-picker-view">
          <IrradiationGauge   irradiation={mapState.info ? mapState.info.dni : 600} />
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

    </div>
  )
}
