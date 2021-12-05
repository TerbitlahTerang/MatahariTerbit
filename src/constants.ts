import { InputData } from './components/InputForm'
import { MapState } from './util/mapStore'

export const GOOGLE_MAPS_KEY = 'AIzaSyA191Lgk8nZhKo4E81LbtwUHCz7-wl3Ea0'
export const DEFAULT_ZOOM = 6

export interface PowerOption {
  name: string
  value: number
}

export const powerOptions: PowerOption[] = [
  { name: '450 VA', value: 450 },
  { name: '900 VA', value: 900 },
  { name: '1.300 VA', value: 1300 },
  { name: '2.200 VA', value: 2200 },
  { name: '3.500 VA', value: 3500 },
  { name: '3.900 VA', value: 3900 },
  { name: '4.400 VA', value: 4400 },
  { name: '5.500 VA', value: 5500 },
  { name: '6.600 VA', value: 6600 },
  { name: '7.700 VA', value: 7700 },
  { name: '10.600 VA', value: 10600 },
  { name: '11.000 VA', value: 11000 },
  { name: '13.200 VA', value: 13200 },
  { name: '16.500 VA', value: 16500 }
]

interface InitialInputData extends InputData {
  location: MapState
}

export const INITIAL_INPUT_DATA: InitialInputData = {
  monthlyCostEstimateInRupiah: 1000000,
  connectionPower: 7700,
  location: { location: { lat: -6.174903208804339, lng: 106.82721867845525 }, address: 'Jakarta' }
}

export const CALCULATOR_VALUES = {
  lowTariff: 1352,
  highTariff: 1444.70,
  pricePerPanel: 7875000,
  areaPerPanel: 2,
  // https://globalsolaratlas.info/map?c=-8.674473,115.030093,11&s=-8.702747,115.26267&m=site&pv=small,0,12,1
  // Square meters 450. 225 Watts / m2. Maybe add effective m2 needed vs panel surface
  kiloWattPeakPerPanel: 0.400,
  kiloWattHourPerYearPerKWp: 1732,
  // Based on https://globalsolaratlas.info PVOUT vs Annual average
  lossFromInverter: 0.9628
}
