import { InputData } from '../components/InputForm'
import { InverterPrice, OptimizationTarget, PriceSettings } from '../constants'

export enum LimitingFactor {
  ConnectionSize = 'ConnectionSize',
  Consumption = 'Consumption',
  MinimumPayment = 'MinimumPayment'
}

export interface ResultData {
  consumptionPerMonthInKwh: number
  taxedPricePerKwh: number
  productionPerMonthInKwh: number
  numberOfPanels: number
  numberOfPanelsFinancial: number
  numberOfPanelsGreen: number
  remainingMonthlyCosts: number
  currentMonthlyCosts: number
  totalSystemCosts: number
  monthlyProfit: number
  yearlyProfit: number
  breakEvenPointInMonths: number
  limitingFactor: LimitingFactor
  projection: ReturnOnInvestment[]
}

const monthsInYear = 12.0

export interface SuggestedPanels {
  limitedByConnection: boolean
  numberOfPanels: number
}

function panelsLimitedByConnection(expectedMonthlyProduction: number, kiloWattHourPerMonthPerPanel: number, kiloWattPeakPerPanel: number, connectionPower: number): SuggestedPanels {
  const numberOfPanelsWithoutConnectionLimit = Math.round(Math.max(0, expectedMonthlyProduction / kiloWattHourPerMonthPerPanel))
  const suggestedCapacity = numberOfPanelsWithoutConnectionLimit * kiloWattPeakPerPanel * 1000
  const installableCapacity = Math.min(suggestedCapacity, connectionPower)
  const suggestedPanels = Math.floor(installableCapacity / kiloWattPeakPerPanel / 1000)

  const limitedByConnection = (suggestedPanels + 1) * kiloWattPeakPerPanel * 1000 > connectionPower
  const numberOfPanels = limitedByConnection ? suggestedPanels : suggestedPanels + 1
  return { limitedByConnection, numberOfPanels }
}

export function calculateResultData({ monthlyCostEstimateInRupiah, connectionPower, pvOut, optimizationTarget, calculatorSettings }: InputData): ResultData {
  const {
    plnSettings,
    priceSettings,
    inverterLifetimeInYears,
    kiloWattPeakPerPanel,
    kiloWattHourPerYearPerKWp,
    lossFromInverter
  } = calculatorSettings

  const {
    energyTax,
    highTariff,
    lowTariff,
    lowTariffThreshold,
    minimalMonthlyConsumptionHours,
    minimalMonthlyConsumptionPrice
  } = plnSettings

  const pvOutputInkWhPerkWpPerYear = pvOut
  const yieldPerKWp = (pvOutputInkWhPerkWpPerYear ? pvOutputInkWhPerkWpPerYear : kiloWattHourPerYearPerKWp) * lossFromInverter

  const taxFactor = 1.0 + energyTax
  const pricePerKwh = connectionPower < lowTariffThreshold ? lowTariff : highTariff
  const taxedPricePerKwh = pricePerKwh * taxFactor

  const minimalMonthlyConsumption = minimalMonthlyConsumptionHours * (connectionPower / 1000)
  const minimalMonthlyCostsIncludingTax = minimalMonthlyConsumption * minimalMonthlyConsumptionPrice * taxFactor

  const kiloWattHourPerMonthPerPanel = yieldPerKWp * kiloWattPeakPerPanel / monthsInYear
  const effectiveCostsPerMonth = monthlyCostEstimateInRupiah - minimalMonthlyCostsIncludingTax
  const requiredMonthlyProduction = effectiveCostsPerMonth / taxedPricePerKwh
  const totalMonthlyConsumption = monthlyCostEstimateInRupiah / taxedPricePerKwh

  const limited = panelsLimitedByConnection(requiredMonthlyProduction, kiloWattHourPerMonthPerPanel, kiloWattPeakPerPanel, connectionPower)

  const potentialMonthlyProduction = monthlyCostEstimateInRupiah / taxedPricePerKwh
  const unlimited = panelsLimitedByConnection(potentialMonthlyProduction, kiloWattHourPerMonthPerPanel, kiloWattPeakPerPanel, connectionPower)

  const numberOfPanels = optimizationTarget === OptimizationTarget.Money ? limited.numberOfPanels : unlimited.numberOfPanels

  const productionPerMonthInKwh = limited.numberOfPanels * kiloWattHourPerMonthPerPanel
  const yieldPerMonthFromPanelsInRupiah = productionPerMonthInKwh * taxedPricePerKwh
  const remainingMonthlyCosts = Math.max(minimalMonthlyCostsIncludingTax, monthlyCostEstimateInRupiah - yieldPerMonthFromPanelsInRupiah)

  const monthlyProfit = monthlyCostEstimateInRupiah - remainingMonthlyCosts
  const yearlyProfit = monthlyProfit * monthsInYear
  const panelsCosts = numberOfPanels * priceSettings.pricePerPanel
  const inverterCosts = priceSettings.inverterPrice === InverterPrice.Relative ? (panelsCosts * priceSettings.priceOfInverterFactor) : priceSettings.priceOfInverterAbsolute

  const flooredNumberOfPanels = monthlyProfit < 0 ? 0 : numberOfPanels
  const limitingFactor = limited.limitedByConnection && unlimited.limitedByConnection ? LimitingFactor.ConnectionSize : (!limited.limitedByConnection && unlimited.limitedByConnection ? LimitingFactor.Consumption: LimitingFactor.MinimumPayment)

  const range = 25
  const investmentParameters: InvestmentParameters = {
    taxedPricePerKwh,
    productionPerMonthInKwh,
    yearlyProfit,
    panelsCosts,
    inverterCosts,
    priceSettings
  }
  const projection: ReturnOnInvestment[] = roiProjection(range, inverterLifetimeInYears, investmentParameters)
  const firstMonthAboveZero = roiProjection(range, inverterLifetimeInYears,investmentParameters, monthsInYear).find(x => x.cumulativeProfit > 0)
  const breakEvenPointInMonths = firstMonthAboveZero ? firstMonthAboveZero.index : range

  return {
    consumptionPerMonthInKwh: totalMonthlyConsumption,
    taxedPricePerKwh,
    productionPerMonthInKwh,
    numberOfPanels: flooredNumberOfPanels,
    numberOfPanelsGreen: unlimited.numberOfPanels,
    numberOfPanelsFinancial: limited.numberOfPanels,
    remainingMonthlyCosts,
    currentMonthlyCosts: monthlyCostEstimateInRupiah,
    totalSystemCosts: panelsCosts,
    monthlyProfit,
    yearlyProfit,
    projection,
    limitingFactor,
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
  panelsCosts: number,
  inverterCosts: number,
  priceSettings: PriceSettings
}

export function roiProjection(numberOfYears: number, lifetimeInverterInYears: number, result: InvestmentParameters, divider: number = 1.0): ReturnOnInvestment[] {
  const years = Array.from(Array(numberOfYears * divider).keys()).map(x => x + 1)

  const {
    electricityPriceInflationRate,
    capacityLossRate
  } = result.priceSettings

  const electricityPriceInflation = 1.0 + (electricityPriceInflationRate / divider)
  const capacityLoss = 1.0 - (capacityLossRate / divider)
  const priceOfInverterIndexed = result.inverterCosts * Math.pow(electricityPriceInflation, lifetimeInverterInYears)

  const startYear = {
    index: 0,
    tariff: result.taxedPricePerKwh,
    output: result.productionPerMonthInKwh * (monthsInYear / divider),
    income: result.productionPerMonthInKwh * (monthsInYear / divider) * result.taxedPricePerKwh,
    cumulativeProfit: result.yearlyProfit - result.panelsCosts - result.inverterCosts - result.priceSettings.installationCosts,
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


