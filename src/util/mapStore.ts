import { Coords } from 'google-map-react'
import { debounceTime, map, mergeMap, Subject, tap } from 'rxjs'
import { INITIAL_INPUT_DATA } from '../constants'
import { geocode } from './maps'

export interface MapState {
  location: Coords
  address?: string
}

type SetStateFn = (state: MapState) => void

const subject = new Subject<MapState>()

let state: MapState = INITIAL_INPUT_DATA.location

export const mapStore = {
  subscribe: (setState: SetStateFn) => {
    subject.pipe(
      debounceTime(500),
      tap(() => { console.log('geocode') }),
      mergeMap(({ location }) => geocode(location)),
      map(({ results }) => results[0]),
      map(({ formatted_address, geometry }) => ({
        location: { lat: geometry.location.lat(), lng: geometry.location.lng() },
        address: formatted_address
      }))
    ).subscribe(setState)
  },
  setLocation: (location: Coords) => {
    state = { ...state, location }
    subject.next(state)
  },
  initialState: INITIAL_INPUT_DATA.location
}
