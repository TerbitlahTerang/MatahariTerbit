import { InputData } from './components/InputForm'
import { MapState } from './util/mapStore'

export const GOOGLE_MAPS_KEY = 'AIzaSyA191Lgk8nZhKo4E81LbtwUHCz7-wl3Ea0'
export const GOOGLE_MAPS_MOBILE_KEY = 'AIzaSyCsXHX6Yd2tY8Ppz2STVOUgCn79T5Ut0Rw'
export const DEFAULT_ZOOM = 18

export interface PowerOption {
  name: string
  value: number
}

export enum OptimizationTarget {
  Money,
  Green
}

export enum InverterPrice {
  Absolute = 'Absolute',
  Relative = 'Relative'
}

export enum MonthlyUsage {
  Rupiah = 'Rupiah',
  KWh = 'KWh'
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
  { name: '16.500 VA', value: 16500 },
  { name: '23.000 VA', value: 23000 },
  { name: '33.000 VA', value: 33000 },
  { name: '41.500 VA', value: 41500 },
  { name: '53.000 VA', value: 53000 }
]

interface InitialInputData extends InputData {
  location: MapState
}

export interface PlnSettings {
  lowTariff: number
  highTariff: number,
  lowTariffThreshold: number,
  energyTax: number,
  minimalMonthlyConsumptionHours: number,
  minimalMonthlyConsumptionPrice: number
}

export interface PriceSettings {
  pricePerPanel: number,
  electricityPriceInflationRate: number,
  priceOfInverterFactor: number,
  priceOfInverterAbsolute: number,
  installationCosts: number,
  capacityLossRate: number,
  inverterPrice: InverterPrice,
  monthlyUsageType: MonthlyUsage
}

export interface CalculatorSettings {
  plnSettings: PlnSettings
  priceSettings: PriceSettings
  areaPerPanel: number,
  inverterLifetimeInYears: number,
  kiloWattPeakPerPanel: number,
  kiloWattHourPerYearPerKWp: number,
  lossFromInverter: number,
  priorityEnabled: boolean
}


export const CALCULATOR_SETTINGS : CalculatorSettings = {
  plnSettings: {
    lowTariff: 1300,
    highTariff: 1444.70,
    lowTariffThreshold: 1300,
    energyTax : 0.1 + 0.05, //PPN + PPJ
    minimalMonthlyConsumptionHours: 40, // number of hours per month * connection power
    minimalMonthlyConsumptionPrice: 1500.0 // energy price (untaxed) for minimal monthly consumption
  },
  priceSettings: {
    pricePerPanel: 7875000,
    electricityPriceInflationRate: 0.05,
    priceOfInverterFactor: 0.10,
    priceOfInverterAbsolute: 8000000,
    installationCosts: 0,
    capacityLossRate: 0.0075,
    inverterPrice: InverterPrice.Relative,
    monthlyUsageType: MonthlyUsage.Rupiah
  },
  areaPerPanel: 2,
  inverterLifetimeInYears: 9,
  // https://globalsolaratlas.info/map?c=-8.674473,115.030093,11&s=-8.702747,115.26267&m=site&pv=small,0,12,1
  // Square meters 450. 225 Watts / m2. Maybe add effective m2 needed vs panel surface
  kiloWattPeakPerPanel: 0.450,
  kiloWattHourPerYearPerKWp: 1732,
  // Based on https://globalsolaratlas.info PVOUT vs Annual average
  lossFromInverter: 0.9628,
  priorityEnabled: true
}

export const INITIAL_INPUT_DATA: InitialInputData = {
  monthlyCostEstimateInRupiah: 1000000,
  monthlyUsageInKwh: 1000,
  connectionPower: 7700,
  location: { location: { lat: -6.174903208804339, lng: 106.82721867845525 }, address: '' },
  optimizationTarget: OptimizationTarget.Money,
  calculatorSettings: CALCULATOR_SETTINGS
}


