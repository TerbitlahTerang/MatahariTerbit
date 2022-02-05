import { InputData } from '../components/InputForm'
import { CALCULATOR_VALUES } from '../constants'

export interface ResultData {
  consumptionPerMonthInKwh: number
  taxedPricePerKwh: number
  productionPerMonthInKwh: number
  numberOfPanels: number
  remainingMonthlyCosts: number
  currentMonthlyCosts: number
  totalSystemCosts: number
  monthlyProfit: number
  yearlyProfit: number
}

const monthsInYear = 12.0

function panelsLimitedByConnection(numberOfPanelsWithoutConnectionLimit: number, kiloWattPeakPerPanel: number, connectionPower: number) {
  const suggestedCapacity = numberOfPanelsWithoutConnectionLimit * kiloWattPeakPerPanel
  const installableCapacity = Math.min(suggestedCapacity * 1000, connectionPower)
  return Math.floor(installableCapacity / kiloWattPeakPerPanel / 1000) + 1
}

export function calculateResultData({ monthlyCostEstimateInRupiah, connectionPower, pvOut }: InputData): ResultData {
  const {
    lowTariff,
    highTariff,
    pricePerPanel,
    kiloWattPeakPerPanel,
    kiloWattHourPerYearPerKWp,
    lossFromInverter
  } = CALCULATOR_VALUES

  const pvOutputInkWhPerkWpPerYear = pvOut
  const yieldPerKWp = (pvOutputInkWhPerkWpPerYear ? pvOutputInkWhPerkWpPerYear : kiloWattHourPerYearPerKWp) * lossFromInverter

  // 4.4 kWh output / per 1 kWp (in Sanur)
  const energyTax = 0.1 + 0.05 //PPN + PPJ
  const taxFactor = 1.0 + energyTax
  const pricePerKwh = connectionPower < 1300 ? lowTariff : highTariff
  const taxedPricePerKwh = pricePerKwh * taxFactor

  const minimalMonthlyConsumption = 40 * (connectionPower / 1000)
  const minimalMonthlyCostsIncludingTax = minimalMonthlyConsumption * 1500.0 * taxFactor

  const kiloWattHourPerMonthPerPanel = yieldPerKWp * kiloWattPeakPerPanel / monthsInYear
  const effectiveCostsPerMonth = monthlyCostEstimateInRupiah - minimalMonthlyCostsIncludingTax
  const expectedMonthlyProduction = effectiveCostsPerMonth / taxedPricePerKwh

  const effectiveConsumptionPerMonthInKwh = expectedMonthlyProduction + minimalMonthlyConsumption
  const numberOfPanelsWithoutConnectionLimit = Math.round(Math.max(0, expectedMonthlyProduction / kiloWattHourPerMonthPerPanel))
  const numberOfPanels = panelsLimitedByConnection(numberOfPanelsWithoutConnectionLimit, kiloWattPeakPerPanel, connectionPower)
  const productionPerMonthInKwh = numberOfPanels * kiloWattHourPerMonthPerPanel
  const yieldPerMonthFromPanelsInRupiah = productionPerMonthInKwh * taxedPricePerKwh
  const remainingMonthlyCosts = Math.max(minimalMonthlyCostsIncludingTax, monthlyCostEstimateInRupiah - yieldPerMonthFromPanelsInRupiah)

  const monthlyProfit = monthlyCostEstimateInRupiah - remainingMonthlyCosts
  const yearlyProfit = monthlyProfit * monthsInYear

  return {
    consumptionPerMonthInKwh: effectiveConsumptionPerMonthInKwh,
    taxedPricePerKwh,
    productionPerMonthInKwh,
    numberOfPanels: monthlyProfit < 0 ? 0 : numberOfPanels,
    remainingMonthlyCosts,
    currentMonthlyCosts: monthlyCostEstimateInRupiah,
    totalSystemCosts: numberOfPanels * pricePerPanel,
    monthlyProfit,
    yearlyProfit
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

interface InvestmentParameters {
  taxedPricePerKwh: number
  productionPerMonthInKwh: number
  yearlyProfit: number
  totalSystemCosts: number
}

export const fromResultData = (r: ResultData): InvestmentParameters => ({
  taxedPricePerKwh: r.taxedPricePerKwh,
  productionPerMonthInKwh: r.productionPerMonthInKwh,
  yearlyProfit: r.yearlyProfit,
  totalSystemCosts: r.totalSystemCosts
})


export function yearlyProjection(numberOfYears: number, result: InvestmentParameters): YearlyResult[] {
  const years = Array.from(Array(numberOfYears).keys()).map(x => x + 1)
  const electricityPriceInflation = 1.05
  const capacityLoss = 0.995

  const startYear = {
    year: 0,
    tariff: result.taxedPricePerKwh,
    output: result.productionPerMonthInKwh * monthsInYear,
    income: result.productionPerMonthInKwh * monthsInYear * result.taxedPricePerKwh,
    cumulativeProfit: result.yearlyProfit - result.totalSystemCosts,
    pvOutputPercentage: 1.0
  } as YearlyResult
  return years.reduce((acc, currentValue, currentIndex) => {
    const previous = acc[currentIndex]
    return acc.concat({
      year: currentValue,
      tariff: previous.tariff * electricityPriceInflation,
      output: previous.output * capacityLoss,
      income: previous.income * electricityPriceInflation,
      cumulativeProfit: previous.cumulativeProfit + (previous.income * electricityPriceInflation),
      pvOutputPercentage: previous.pvOutputPercentage * capacityLoss
    } as YearlyResult)
  }, [startYear])

}

