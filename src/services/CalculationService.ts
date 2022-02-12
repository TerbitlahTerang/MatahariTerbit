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
  breakEvenPointInMonths: number
  projection: ReturnOnInvestment[]
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
  const totalSystemCosts = numberOfPanels * pricePerPanel


  const range = 25
  const projection: ReturnOnInvestment[] = roiProjection(range, {
    taxedPricePerKwh,
    productionPerMonthInKwh,
    yearlyProfit,
    totalSystemCosts
  })
  const firstMonthAboveZero = roiProjection(range, {
    taxedPricePerKwh,
    productionPerMonthInKwh,
    yearlyProfit,
    totalSystemCosts
  }, monthsInYear).find(x => x.cumulativeProfit > 0)
  const breakEvenPointInMonths = firstMonthAboveZero ? firstMonthAboveZero.index : range

  return {
    consumptionPerMonthInKwh: effectiveConsumptionPerMonthInKwh,
    taxedPricePerKwh,
    productionPerMonthInKwh,
    numberOfPanels: monthlyProfit < 0 ? 0 : numberOfPanels,
    remainingMonthlyCosts,
    currentMonthlyCosts: monthlyCostEstimateInRupiah,
    totalSystemCosts,
    monthlyProfit,
    yearlyProfit,
    projection,
    breakEvenPointInMonths
  }
}

export interface ReturnOnInvestment {
  index: number
  output: number
  tariff: number
  income: number
  cumulativeProfit: number
  pvOutputPercentage: number
  stepSizeInMonths: number
}

interface InvestmentParameters {
  taxedPricePerKwh: number
  productionPerMonthInKwh: number
  yearlyProfit: number
  totalSystemCosts: number
}

export function roiProjection(numberOfYears: number, result: InvestmentParameters, divider: number = 1.0): ReturnOnInvestment[] {
  const years = Array.from(Array(numberOfYears * divider).keys()).map(x => x + 1)

  const electricityPriceInflationRate = 0.05 / divider
  const capacityLossRate = 0.0075 / divider

  const electricityPriceInflation = 1.0 + electricityPriceInflationRate
  const capacityLoss = 1.0 - capacityLossRate
  const lifetimeInverterInYears = CALCULATOR_VALUES.inverterLifetimeInYears
  const priceOfInverter = (result.totalSystemCosts * 0.10)
  const priceOfInverterIndexed = priceOfInverter * Math.pow(electricityPriceInflation, lifetimeInverterInYears)

  const startYear = {
    index: 0,
    tariff: result.taxedPricePerKwh,
    output: result.productionPerMonthInKwh * (monthsInYear / divider),
    income: result.productionPerMonthInKwh * (monthsInYear / divider) * result.taxedPricePerKwh,
    cumulativeProfit: result.yearlyProfit - result.totalSystemCosts,
    pvOutputPercentage: 1.0
  } as ReturnOnInvestment
  return years.reduce((acc, currentValue, currentIndex) => {
    const previous = acc[currentIndex]
    const invertReplacementCosts = currentIndex === (lifetimeInverterInYears * divider) ? priceOfInverterIndexed : 0
    return acc.concat({
      index: currentValue,
      tariff: previous.tariff * electricityPriceInflation,
      output: previous.output * capacityLoss,
      income: previous.income * electricityPriceInflation,
      cumulativeProfit: previous.cumulativeProfit + (previous.income * electricityPriceInflation) - invertReplacementCosts,
      pvOutputPercentage: previous.pvOutputPercentage * capacityLoss,
      stepSizeInMonths: monthsInYear / divider
    } as ReturnOnInvestment)
  }, [startYear])

}


