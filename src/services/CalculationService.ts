import { InputData } from '../components/InputForm'
import { CALCULATOR_VALUES } from '../constants'

export interface ResultData {
  consumptionPerMonthInKwh: number
  taxedPricePerKwh: number
  kiloWattHourPerMonthPerPanel: number
  productionPerMonthInKwh: number
  numberOfPanels: number
  remainingMonthlyCosts: number
  currentMonthlyCosts: number
  totalSystemCosts: number
  yearlyProfit: number
}

export function calculateResultData({ monthlyCostEstimateInRupiah, connectionPower, location }: InputData): ResultData {
  const { lowTariff, highTariff, pricePerPanel, kiloWattPeakPerPanel, kiloWattHourPerYearPerKWp, lossFromInverter } = CALCULATOR_VALUES

  const pvOutputInkWhPerkWpPerYear = location.info?.pvout
  const yieldPerKWp = (pvOutputInkWhPerkWpPerYear ? pvOutputInkWhPerkWpPerYear : kiloWattHourPerYearPerKWp) * lossFromInverter

  // 4.4 kWh output / per 1 kWp (in Sanur)
  const energyTax = 0.1 + 0.05 //PPN + PPJ
  const taxFactor = 1.0 + energyTax

  const minimalMonthlyConsumption = 40 * (connectionPower / 1000)
  const minimalMonthlyCostsIncludingTax = minimalMonthlyConsumption * 1500.0 * taxFactor
  const kiloWattHourPerMonthPerPanel = yieldPerKWp * kiloWattPeakPerPanel / 12
  const effectiveCostsPerMonth = monthlyCostEstimateInRupiah - minimalMonthlyCostsIncludingTax

  const pricePerKwh = connectionPower < 1300 ? lowTariff : highTariff
  const taxedPricePerKwh = pricePerKwh * taxFactor
  const expectedMonthlyProduction = effectiveCostsPerMonth / taxedPricePerKwh

  const effectiveConsumptionPerMonthInKwh = expectedMonthlyProduction + minimalMonthlyConsumption
  const numberOfPanels = Math.round(Math.max(0, expectedMonthlyProduction / kiloWattHourPerMonthPerPanel))
  const yearlyProfit = (monthlyCostEstimateInRupiah - minimalMonthlyCostsIncludingTax) * 12


  return {
    consumptionPerMonthInKwh: effectiveConsumptionPerMonthInKwh,
    taxedPricePerKwh: taxedPricePerKwh,
    kiloWattHourPerMonthPerPanel: kiloWattHourPerMonthPerPanel,
    productionPerMonthInKwh: expectedMonthlyProduction,
    numberOfPanels,
    remainingMonthlyCosts: minimalMonthlyCostsIncludingTax,
    currentMonthlyCosts: monthlyCostEstimateInRupiah,
    totalSystemCosts: numberOfPanels * pricePerPanel,
    yearlyProfit: yearlyProfit
  }
}

export interface YearlyResult {
  year: number
  output: number
  tariff: number
  income: number
  cumulativeProfit: number
  pvOutputPercentage: number
}

export function yearlyProjection(numberOfYears: number, result: ResultData): YearlyResult[] {
  const years = Array.from(Array(numberOfYears).keys()).map(x => x + 1)
  const electricityPriceInflation = 1.05
  const capacityLoss = 0.995

  return years.reduce((acc, currentValue, currentIndex, array) => {
    const previous = acc[currentIndex]
    return acc.concat({
      year: currentValue,
      tariff: previous.tariff * electricityPriceInflation,
      output: previous.output * capacityLoss,
      income: previous.income * electricityPriceInflation,
      cumulativeProfit: previous.cumulativeProfit + (previous.income * electricityPriceInflation),
      pvOutputPercentage: previous.pvOutputPercentage * capacityLoss
    } as YearlyResult)
  }, [{
    year: 0,
    tariff: result.taxedPricePerKwh,
    output: result.productionPerMonthInKwh * 12.0,
    income: result.productionPerMonthInKwh * 12.0 * result.taxedPricePerKwh,
    cumulativeProfit: result.yearlyProfit - result.totalSystemCosts,
    pvOutputPercentage: 1.0
  } as YearlyResult])

}

