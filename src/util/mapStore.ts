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

export const mapStore = {
  subscribe: (setState: SetStateFn) => {
    subject.pipe(
      debounceTime(500),
      mergeMap(({ location, geoEnabled }) => forkJoin([
        geocode(location),
        irradiance(location),
        Promise.resolve(geoEnabled)
      ])),
      map(([geo, info, enabled]) => ({
        location: { lat: geo.geometry.location.lat, lng: geo.geometry.location.lng } ,
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
