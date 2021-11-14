import { InputData } from '../components/InputForm'
import { CALCULATOR_VALUES } from '../constants'

export interface ResultData {
  consumptionPerMonthInKwh: number
  productionPerMonthInKwh: number
  numberOfPanels: number
  minimalMonthlyCosts: number
}

export function calculateResultData({ monthlyCostEstimateInRupiah, connectionPower }: InputData): ResultData {
  const { lowTariff, highTariff, kiloWattPeakPerPanel, kiloWattHourPerYearPerKWp } = CALCULATOR_VALUES
  // 4.4 kWh output / per 1 kWp (in Sanur)
  const minimalMonthlyConsumption = 40 * (connectionPower / 1000)
  const minimalMonthlyCosts = minimalMonthlyConsumption * 1500
  const kiloWattHourPerYearPerPanel = kiloWattHourPerYearPerKWp * kiloWattPeakPerPanel
  const effectiveCostsPerMonth = monthlyCostEstimateInRupiah - minimalMonthlyCosts

  const pricePerKwh = connectionPower < 1300 ? lowTariff : highTariff
  const expectedMonthlyProduction = effectiveCostsPerMonth / pricePerKwh

  const effectiveConsumptionPerYearInKwh = expectedMonthlyProduction + minimalMonthlyConsumption
  const numberOfPanels = Math.max(0, effectiveConsumptionPerYearInKwh / kiloWattHourPerYearPerPanel)

  return { consumptionPerMonthInKwh: effectiveConsumptionPerYearInKwh, numberOfPanels, productionPerMonthInKwh: expectedMonthlyProduction, minimalMonthlyCosts: minimalMonthlyCosts }
}
