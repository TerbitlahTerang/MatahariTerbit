import { Coords } from 'google-map-react'
import { debounceTime, forkJoin, map, mergeMap, Subject } from 'rxjs'
import { INITIAL_INPUT_DATA } from '../constants'
import { geocode, irradiance, IrradianceInfo } from './maps'

export interface MapState {
  location: Coords
  address?: string
  info?: IrradianceInfo
}

type SetStateFn = (state: MapState) => void

const subject = new Subject<MapState>()

let state: MapState = INITIAL_INPUT_DATA.location

export const mapStore = {
  subscribe: (setState: SetStateFn) => {
    subject.pipe(
      debounceTime(500),
      mergeMap(({ location }) => forkJoin([
        geocode(location),
        irradiance(location)
      ])),
      map(([geo, info]) => ({
        location: { lat: geo.geometry.location.lat(), lng: geo.geometry.location.lng() },
        address: geo.formatted_address,
        info
      }))
    ).subscribe(setState)
  },
  setLocation: (location: Coords) => {
    state = { ...state, location }
    subject.next(state)
  },
  initialState: INITIAL_INPUT_DATA.location
}
