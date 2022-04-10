import { Coords } from 'google-map-react'
import { debounceTime, forkJoin, map, mergeMap, Subject } from 'rxjs'
import { INITIAL_INPUT_DATA } from '../constants'
import { irradiance } from './maps'
import { MapState, SetStateFn } from './mapStore'
import { NativeLocation } from '../components/MapPickerMobile'


const subject = new Subject<MapState>()

let state: MapState = INITIAL_INPUT_DATA.location

function geocodeMobile(address?: string) {
  return async function(location: Coords) {
    return {
      location: location,
      formatted_address: address
    }
  }
}

export const mapStoreMobile = {
  subscribe: (setState: SetStateFn) => {
    subject.pipe(
      debounceTime(500),
      mergeMap(({ location, address }) => forkJoin([
        geocodeMobile(address)(location),
        irradiance(location)
      ])),
      map(([geo, info]) => ({
        location: { lat: geo.location.lat, lng: geo.location.lng },
        address: geo.formatted_address,
        info
      }))
    ).subscribe(setState)
  },
  setLocation: (location: NativeLocation) => {
    state =   { ...state, location: location.coords, address: ` ${location.address.street} - ${location.address.city} - ${location.address.region}` }
    subject.next(state)
  },
  initialState: INITIAL_INPUT_DATA.pvOut
}
