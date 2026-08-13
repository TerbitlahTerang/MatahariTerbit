import { InputData } from './components/InputForm'
import { MapState } from './util/mapStore'

export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

if (!GOOGLE_MAPS_KEY) {
  // eslint-disable-next-line no-console
  console.error('Missing VITE_GOOGLE_MAPS_KEY environment variable')
}
export const GOOGLE_MAPS_MOBILE_KEY = 'AIzaSyCsXHX6Yd2tY8Ppz2STVOUgCn79T5Ut0Rw'
export const GOOGLE_ANALYTICS_TRACKING_ID = 'G-606Y7ZSBFV'
export const DEFAULT_ZOOM = 18

export interface PowerOption {
  name: string
  value: number
}

export enum InverterPrice {
  Absolute = 'Absolute',
  Relative = 'Relative'
}

export enum MonthlyUsage {
  Rupiah = 'Rupiah',
  KWh = 'KWh'
}

export enum SystemType {
  GridHybrid = 'GridHybrid',
  OffGrid = 'OffGrid'
}

export enum BatteryChemistry {
  LiFePO4 = 'LiFePO4',
  LeadAcid = 'LeadAcid'
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
  energyTax: number
}

export interface PriceSettings {
  pricePerPanel: number,
  electricityPriceInflationRate: number,
  priceOfInverterFactor: number,
  priceOfInverterAbsolute: number,
  installationCosts: number,
  capacityLossRate: number,
  inverterPrice: InverterPrice,
  monthlyUsageType: MonthlyUsage,
  discountRate: number,
  analysisPeriodInYears: number,
  maintenancePercentPerYear: number,
  balanceOfSystemPercent: number
}

export interface BatterySettings {
  chemistry: BatteryChemistry
  daysOfAutonomy: number        // usable kWh = daily load * daysOfAutonomy
  depthOfDischarge: number      // 0..1, usable -> nominal capacity
  roundTripEfficiency: number   // 0..1
  pricePerUsableKwh: number
  serviceLifeInYears: number
}

export interface SelfConsumptionSettings {
  daytimeUseShare: number       // 0..1, portion of daily load served while the sun is up
  peakLoadInWatts: number       // sizes the inverter
  pvOversizeFactor: number      // extra array headroom, multiplier on required kWp
  gridBackupAllowance: number   // 0..1, GridHybrid-only, informational residual-bill estimate
}

export interface CalculatorSettings {
  plnSettings: PlnSettings
  priceSettings: PriceSettings
  batterySettings: BatterySettings
  selfConsumptionSettings: SelfConsumptionSettings
  areaPerPanel: number,
  inverterLifetimeInYears: number,
  panelLifetimeInYears: number,
  kiloWattPeakPerPanel: number,
  kiloWattHourPerYearPerKWp: number,
  lossFromInverter: number
}


export const CALCULATOR_SETTINGS : CalculatorSettings = {
  plnSettings: {
    lowTariff: 1352,
    highTariff: 1699.53,
    lowTariffThreshold: 1300,
    energyTax : 0.1 + 0.05 //PPN + PPJ
  },
  priceSettings: {
    pricePerPanel: 2500000,
    electricityPriceInflationRate: 0.05,
    priceOfInverterFactor: 0.10,
    priceOfInverterAbsolute: 8000000,
    installationCosts: 0,
    capacityLossRate: 0.0075,
    inverterPrice: InverterPrice.Relative,
    monthlyUsageType: MonthlyUsage.Rupiah,
    discountRate: 0.05,
    analysisPeriodInYears: 25,
    maintenancePercentPerYear: 0.01,
    balanceOfSystemPercent: 0.20
  },
  batterySettings: {
    chemistry: BatteryChemistry.LiFePO4,
    daysOfAutonomy: 0.5,
    depthOfDischarge: 0.9,
    roundTripEfficiency: 0.95,
    pricePerUsableKwh: 5000000,
    serviceLifeInYears: 10
  },
  selfConsumptionSettings: {
    daytimeUseShare: 0.35,
    peakLoadInWatts: 3000,
    pvOversizeFactor: 1.15,
    gridBackupAllowance: 0.08
  },
  areaPerPanel: 2,
  inverterLifetimeInYears: 9,
  panelLifetimeInYears: 25,
  // https://globalsolaratlas.info/map?c=-8.674473,115.030093,11&s=-8.702747,115.26267&m=site&pv=small,0,12,1
  // Square meters 450. 225 Watts / m2. Maybe add effective m2 needed vs panel surface
  kiloWattPeakPerPanel: 0.625,
  kiloWattHourPerYearPerKWp: 1732,
  // Based on https://globalsolaratlas.info PVOUT vs Annual average
  lossFromInverter: 0.9628
}

export const INITIAL_INPUT_DATA: InitialInputData = {
  monthlyCostEstimateInRupiah: 1000000,
  monthlyUsageInKwh: 1000,
  connectionPower: 7700,
  location: { location: { lat: -6.175456973926256, lng: 106.82712256908418 }, address: '' },
  calculatorSettings: CALCULATOR_SETTINGS
}


