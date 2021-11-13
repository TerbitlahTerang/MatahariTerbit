import { InputData } from '../components/InputForm'
import { CALCULATOR_VALUES } from '../constants'

export interface ResultData {
  consumptionPerYearInKwh: number
  numberOfPanels: number
  baseMonthlyCosts: number
}

export function calculateResultData({ consumption, connectionPower }: InputData): ResultData {
  const { lowTariff, highTariff, kiloWattPeakPerPanel, kiloWattHourPerYearPerKWp } = CALCULATOR_VALUES
  // 4.4 kWh output / per 1 kWp (in Sanur)
  const baseMonthlyCosts = 40 * (connectionPower / 1000) * 1500
  const kiloWattHourPerYearPerPanel = kiloWattHourPerYearPerKWp * kiloWattPeakPerPanel
  const costsPerMonth = consumption - baseMonthlyCosts
  const costsPerYear = costsPerMonth * 12
  const pricePerKwh = connectionPower < 1300 ? lowTariff : highTariff
  const consumptionPerYearInKwh = costsPerYear / pricePerKwh
  const numberOfPanels = Math.max(0, consumptionPerYearInKwh / kiloWattHourPerYearPerPanel)
  return { numberOfPanels, consumptionPerYearInKwh, baseMonthlyCosts }
}
