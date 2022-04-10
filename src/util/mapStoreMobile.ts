import { Coords } from 'google-map-react'
import { debounceTime, forkJoin, map, mergeMap, Subject } from 'rxjs'
import { INITIAL_INPUT_DATA } from '../constants'
import { irradiance } from './maps'
import { MapState, SetStateFn } from './mapStore'


const subject = new Subject<MapState>()

let state: MapState = INITIAL_INPUT_DATA.location

async function geocodeMobile(location: Coords) {
  return {
    location: location,
    formatted_address: 'The address' }
}

export const mapStoreMobile = {
  subscribe: (setState: SetStateFn) => {
    subject.pipe(
      debounceTime(500),
      mergeMap(({ location }) => forkJoin([
        geocodeMobile(location),
        irradiance(location)
      ])),
      map(([geo, info]) => ({
        location: { lat: geo.location.lat, lng: geo.location.lng },
        address: geo.formatted_address,
        info
      }))
    ).subscribe(setState)
  },
  setLocation: (location: Coords) => {
    state = { ...state, location }
    subject.next(state)
  },
  initialState: INITIAL_INPUT_DATA.pvOut
}
