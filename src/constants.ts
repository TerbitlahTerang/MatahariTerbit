import { InputData } from './components/InputForm'

export const GOOGLE_MAPS_KEY = 'AIzaSyA191Lgk8nZhKo4E81LbtwUHCz7-wl3Ea0'
export const DEFAULT_ZOOM = 6

export const INITIAL_INPUT_DATA: InputData = {
  monthlyCostEstimateInRupiah: 1000000,
  connectionPower: 7700,
  location: { location: { lat: -6.174903208804339, lng: 106.82721867845525 }, address: 'Jakarta' }
}

export const CALCULATOR_VALUES = {
  lowTariff: 1352,
  highTariff: 1444.70,
  // https://globalsolaratlas.info/map?c=-8.674473,115.030093,11&s=-8.702747,115.26267&m=site&pv=small,0,12,1
  // Square meters 450. 225 Watts / m2. Maybe add effective m2 needed vs panel surface
  kiloWattPeakPerPanel: 0.330,
  // Either mountains vs coast or map location selecgtion
  kiloWattHourPerYearPerKWp: 1632
}
