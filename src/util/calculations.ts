import { InputData } from '../components/InputForm'
import { CALCULATOR_VALUES } from '../constants'

export interface ResultData {
  consumptionPerYearInKwh: number
  numberOfPanels: number
  minimalMonthlyCosts: number
}

export function calculateResultData({ monthlyCostEstimateInRupiah, connectionPower }: InputData): ResultData {
  const { lowTariff, highTariff, kiloWattPeakPerPanel, kiloWattHourPerYearPerKWp } = CALCULATOR_VALUES
  // 4.4 kWh output / per 1 kWp (in Sanur)
  const minimalMonthlyCosts = 40 * (connectionPower / 1000) * 1500
  const kiloWattHourPerYearPerPanel = kiloWattHourPerYearPerKWp * kiloWattPeakPerPanel
  const effectiveCostsPerMonth = monthlyCostEstimateInRupiah - minimalMonthlyCosts
  const costsPerYear = effectiveCostsPerMonth * 12
  const pricePerKwh = connectionPower < 1300 ? lowTariff : highTariff
  const effectiveConsumptionPerYearInKwh = costsPerYear / pricePerKwh
  const numberOfPanels = Math.max(0, effectiveConsumptionPerYearInKwh / kiloWattHourPerYearPerPanel)
  return { numberOfPanels, consumptionPerYearInKwh: effectiveConsumptionPerYearInKwh, minimalMonthlyCosts: minimalMonthlyCosts }
}
