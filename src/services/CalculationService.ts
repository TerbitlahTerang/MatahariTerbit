import { InputData } from '../components/InputForm'
import { CALCULATOR_VALUES } from '../constants'

export interface ResultData {
  consumptionPerMonthInKwh: number
  productionPerMonthInKwh: number
  numberOfPanels: number
  remainingMonthlyCosts: number
  currentMonthlyCosts: number
}

export function calculateResultData({ monthlyCostEstimateInRupiah, connectionPower }: InputData): ResultData {
  const { lowTariff, highTariff, kiloWattPeakPerPanel, kiloWattHourPerYearPerKWp } = CALCULATOR_VALUES
  // 4.4 kWh output / per 1 kWp (in Sanur)
  const energyTax = 0.1 + 0.05 //PPN + PPJ
  const taxFactor = 1.0 + energyTax
  const minimalMonthlyConsumption = 40 * (connectionPower / 1000)
  const minimalMonthlyCostsIncludingTax = minimalMonthlyConsumption * 1500.0 * taxFactor
  const kiloWattHourPerMonthPerPanel = kiloWattHourPerYearPerKWp * kiloWattPeakPerPanel / 12
  const effectiveCostsPerMonth = monthlyCostEstimateInRupiah - minimalMonthlyCostsIncludingTax

  const pricePerKwh = connectionPower < 1300 ? lowTariff : highTariff
  const expectedMonthlyProduction = effectiveCostsPerMonth / (pricePerKwh * taxFactor)

  const effectiveConsumptionPerMonthInKwh = expectedMonthlyProduction + minimalMonthlyConsumption
  const numberOfPanels = Math.max(0, expectedMonthlyProduction / kiloWattHourPerMonthPerPanel)

  return {
    consumptionPerMonthInKwh: effectiveConsumptionPerMonthInKwh,
    numberOfPanels,
    productionPerMonthInKwh: expectedMonthlyProduction,
    remainingMonthlyCosts: minimalMonthlyCostsIncludingTax,
    currentMonthlyCosts: monthlyCostEstimateInRupiah
  }
}
