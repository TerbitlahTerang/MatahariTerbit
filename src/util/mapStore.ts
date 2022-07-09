import { debounceTime, forkJoin, map, mergeMap, Subject } from 'rxjs'
import { INITIAL_INPUT_DATA } from '../constants'
import { geocode, irradiance, IrradianceInfo } from './maps'

export interface Coordinate {
  lat: number
  lng: number
}

export interface MapState {
  location: Coordinate
  geoEnabled?: boolean
  address?: string
  info?: IrradianceInfo
}

export type SetStateFn = (state: MapState) => void

const subject = new Subject<MapState>()

let state: MapState = INITIAL_INPUT_DATA.location

const getLocation = (location: Coordinate) => {
  const url = new URL(window.location.href)
  const lngParam = url.searchParams.get('long')
  const latParam = url.searchParams.get('lat')
  if (lngParam && latParam) {
    return { lat: parseFloat(latParam), lng: parseFloat(lngParam) }
  }
  return location
}

export const mapStore = {
  subscribe: (setState: SetStateFn) => {
    subject.pipe(
      debounceTime(500),
      mergeMap(({ location, geoEnabled }) => forkJoin([
        geocode(getLocation(location)),
        irradiance(getLocation(location)),
        Promise.resolve(geoEnabled)
      ])),
      map(([geo, info, enabled]) => ({
        location: { lat: getLocation(geo.geometry.location).lat, lng: getLocation(geo.geometry.location).lng },
        geoEnabled: enabled,
        address: geo.formatted_address,
        info
      }))
    ).subscribe(setState)
  },
  setLocation: (location: Coordinate, geoEnabled?: boolean) => {
    state = { ...state, location, geoEnabled }
    subject.next(state)
  },
  initialState: INITIAL_INPUT_DATA.pvOut
}
