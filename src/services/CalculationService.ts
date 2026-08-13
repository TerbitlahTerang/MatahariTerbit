import { InputData } from '../components/InputForm'
import { InverterPrice, MonthlyUsage, PriceSettings, SystemType } from '../constants'
import { computeDailyEnergyBalance } from './SelfConsumption'

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
  selfSufficiencyPercentage?: number
  solarServedPerYearInKwh?: number
  gridImportPerYearInKwh?: number
  curtailedPerYearInKwh?: number
  residualAnnualGridBillInRupiah?: number
  inverterCapacityInKw?: number
  batteryUsableCapacityInKwh?: number
  batteryNominalCapacityInKwh?: number
  batteryCosts?: number
  balanceOfSystemCosts?: number
  npv?: number
  paybackInYears?: number | null
  levelizedCostOfEnergyPerKwh?: number
}

const monthsInYear = 12.0
const daysInYear = 365.0

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

// Shared across panels/inverter/battery: flat nominal replacement cost, fired every time the
// component's lifetime elapses within the analysis horizon (not just once).
function replacementCostForPeriod(cost: number, lifetimeInYears: number, currentPeriodIndex: number, divider: number, totalPeriods: number): number {
  const lifetimeInPeriods = lifetimeInYears * divider
  if (lifetimeInPeriods <= 0 || currentPeriodIndex >= totalPeriods) return 0
  return currentPeriodIndex % lifetimeInPeriods === 0 ? cost : 0
}

export function calculateResultData({
  monthlyCostEstimateInRupiah,
  monthlyUsageInKwh,
  connectionPower,
  pvOut,
  systemType,
  calculatorSettings
}: InputData): ResultData {
  const isOffGrid = systemType === SystemType.OffGrid
  const {
    plnSettings,
    priceSettings,
    batterySettings,
    selfConsumptionSettings,
    panelLifetimeInYears,
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

  const { daytimeUseShare, peakLoadInWatts, pvOversizeFactor } = selfConsumptionSettings
  const { daysOfAutonomy, depthOfDischarge, roundTripEfficiency, pricePerUsableKwh, serviceLifeInYears: batteryLifetimeInYears } = batterySettings

  const pvOutputInkWhPerkWpPerYear = pvOut
  const yieldPerKWp = (pvOutputInkWhPerkWpPerYear ?? kiloWattHourPerYearPerKWp) * lossFromInverter

  const taxFactor = 1.0 + energyTax
  const pricePerKwh = connectionPower < lowTariffThreshold ? lowTariff : highTariff
  const taxedPricePerKwh = pricePerKwh * taxFactor

  const minimalMonthlyConsumption = minimalMonthlyConsumptionHours * (connectionPower / 1000)
  const minimalMonthlyCostsIncludingTax = minimalMonthlyConsumption * minimalMonthlyConsumptionPrice * taxFactor

  const kiloWattHourPerMonthPerPanel = yieldPerKWp * kiloWattPeakPerPanel / monthsInYear
  const costEstimate = priceSettings.monthlyUsageType === MonthlyUsage.Rupiah ? monthlyCostEstimateInRupiah : monthlyUsageInKwh * taxedPricePerKwh
  const totalMonthlyConsumption = costEstimate / taxedPricePerKwh
  const dailyLoadInKwh = totalMonthlyConsumption * monthsInYear / daysInYear

  // Battery sized off the household's own daily load, not off panel output.
  const usableBatteryKwh = dailyLoadInKwh * daysOfAutonomy
  const nominalBatteryKwh = depthOfDischarge > 0 ? usableBatteryKwh / depthOfDischarge : 0

  // Physical array sizing: how many kWp are needed to cover the daily load, given how much of
  // it is used directly during the day (cheap) vs. routed through the battery at night (lossy).
  const dailyGenerationPerKwpKwh = yieldPerKWp / daysInYear
  const selfConsumptionEfficiencyFactor = daytimeUseShare + (1 - daytimeUseShare) * roundTripEfficiency
  const requiredKwp = (dailyGenerationPerKwpKwh > 0 && selfConsumptionEfficiencyFactor > 0)
    ? (dailyLoadInKwh / (dailyGenerationPerKwpKwh * selfConsumptionEfficiencyFactor)) * pvOversizeFactor
    : 0
  const expectedMonthlyProductionKwh = requiredKwp * yieldPerKWp / monthsInYear

  // Off-grid has no PLN connection, so there's no VA cap on installable capacity.
  const sized = panelsLimitedByConnection(expectedMonthlyProductionKwh, kiloWattHourPerMonthPerPanel, kiloWattPeakPerPanel, isOffGrid ? Infinity : connectionPower)
  const numberOfPanels = sized.numberOfPanels

  const productionPerMonthInKwh = numberOfPanels * kiloWattHourPerMonthPerPanel
  const dailyGenerationInKwh = productionPerMonthInKwh * monthsInYear / daysInYear
  const balance = computeDailyEnergyBalance(dailyGenerationInKwh, dailyLoadInKwh, daytimeUseShare, usableBatteryKwh, roundTripEfficiency)
  const solarServedPerMonthInKwh = balance.solarServedKwh * daysInYear / monthsInYear

  const yieldPerMonthFromPanelsInRupiah = solarServedPerMonthInKwh * taxedPricePerKwh
  // Off-grid has no PLN bill at all - no minimum-payment floor, nothing left to pay.
  const remainingMonthlyCosts = isOffGrid ? 0 : Math.max(minimalMonthlyCostsIncludingTax, costEstimate - yieldPerMonthFromPanelsInRupiah)

  const monthlyProfit = costEstimate - remainingMonthlyCosts
  const yearlyProfit = monthlyProfit * monthsInYear

  const panelsCosts = numberOfPanels * priceSettings.pricePerPanel
  const inverterCapacityInKw = Math.max(peakLoadInWatts / 1000 * 1.25, requiredKwp * 0.9)
  const inverterCosts = priceSettings.inverterPrice === InverterPrice.Relative ? (panelsCosts * priceSettings.priceOfInverterFactor) : priceSettings.priceOfInverterAbsolute
  const batteryCosts = usableBatteryKwh * pricePerUsableKwh
  const balanceOfSystemCosts = (panelsCosts + inverterCosts + batteryCosts) * priceSettings.balanceOfSystemPercent
  const installationCosts = priceSettings.installationCosts
  const totalSystemCosts = panelsCosts + inverterCosts + batteryCosts + balanceOfSystemCosts + installationCosts

  const flooredNumberOfPanels = monthlyProfit < 0 ? 0 : numberOfPanels
  // Off-grid is never connection-limited (no VA cap applies).
  const limitingFactor = !isOffGrid && sized.limitedByConnection ? LimitingFactor.ConnectionSize : LimitingFactor.Consumption

  const analysisPeriodInYears = priceSettings.analysisPeriodInYears
  const investmentParameters: InvestmentParameters = {
    taxedPricePerKwh,
    solarServedPerMonthInKwh,
    yearlyProfit,
    panelsCosts,
    inverterCosts,
    batteryCosts,
    installationCosts,
    panelLifetimeInYears,
    inverterLifetimeInYears,
    batteryLifetimeInYears,
    priceSettings
  }
  const projection: ReturnOnInvestment[] = roiProjection(analysisPeriodInYears, investmentParameters)
  const firstMonthAboveZero = roiProjection(analysisPeriodInYears, investmentParameters, monthsInYear).find(x => x.cumulativeProfit > 0)
  const breakEvenPointInMonths = firstMonthAboveZero ? firstMonthAboveZero.index : analysisPeriodInYears * monthsInYear
  const paybackInYears = firstMonthAboveZero ? firstMonthAboveZero.index / monthsInYear : null

  const capex = panelsCosts + inverterCosts + batteryCosts + installationCosts
  const { npv, levelizedCostOfEnergyPerKwh } = discountedMetrics(projection, capex, priceSettings.discountRate)

  return {
    consumptionPerMonthInKwh: totalMonthlyConsumption,
    taxedPricePerKwh,
    productionPerMonthInKwh,
    numberOfPanels: flooredNumberOfPanels,
    numberOfPanelsGreen: numberOfPanels,
    numberOfPanelsFinancial: numberOfPanels,
    remainingMonthlyCosts,
    currentMonthlyCosts: costEstimate,
    totalSystemCosts,
    monthlyProfit,
    yearlyProfit,
    projection,
    limitingFactor,
    breakEvenPointInMonths,
    paybackInYears,
    selfSufficiencyPercentage: dailyLoadInKwh > 0 ? (balance.solarServedKwh / dailyLoadInKwh) * 100 : 0,
    solarServedPerYearInKwh: balance.solarServedKwh * daysInYear,
    gridImportPerYearInKwh: Math.max(0, dailyLoadInKwh - balance.solarServedKwh) * daysInYear,
    curtailedPerYearInKwh: balance.curtailedKwh * daysInYear,
    residualAnnualGridBillInRupiah: isOffGrid ? undefined : Math.max(0, dailyLoadInKwh - balance.solarServedKwh) * daysInYear * taxedPricePerKwh,
    inverterCapacityInKw,
    batteryUsableCapacityInKwh: usableBatteryKwh,
    batteryNominalCapacityInKwh: nominalBatteryKwh,
    batteryCosts,
    balanceOfSystemCosts,
    npv,
    levelizedCostOfEnergyPerKwh
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
  solarServedInKwh?: number
  gridImportInKwh?: number
  curtailedInKwh?: number
  panelReplacementCost?: number
  inverterReplacementCost?: number
  batteryReplacementCost?: number
  maintenanceCost?: number
}

interface InvestmentParameters {
  taxedPricePerKwh: number
  solarServedPerMonthInKwh: number
  yearlyProfit: number
  panelsCosts: number
  inverterCosts: number
  batteryCosts: number
  installationCosts: number
  panelLifetimeInYears: number
  inverterLifetimeInYears: number
  batteryLifetimeInYears: number
  priceSettings: PriceSettings
}

export function roiProjection(numberOfYears: number, result: InvestmentParameters, divider: number = 1.0): ReturnOnInvestment[] {
  const totalPeriods = numberOfYears * divider
  const years = Array.from(Array(totalPeriods).keys()).map(x => x + 1)

  const {
    electricityPriceInflationRate,
    capacityLossRate,
    maintenancePercentPerYear
  } = result.priceSettings

  const electricityPriceInflation = 1.0 + (electricityPriceInflationRate / divider)
  const capacityLoss = 1.0 - (capacityLossRate / divider)
  const maintainableCosts = result.panelsCosts + result.inverterCosts + result.batteryCosts

  const startYear = {
    index: 0,
    tariff: result.taxedPricePerKwh,
    output: result.solarServedPerMonthInKwh * (monthsInYear / divider),
    income: result.solarServedPerMonthInKwh * (monthsInYear / divider) * result.taxedPricePerKwh,
    cumulativeProfit: result.yearlyProfit - result.panelsCosts - result.inverterCosts - result.batteryCosts - result.installationCosts,
    pvOutputPercentage: 1.0
  } as ReturnOnInvestment

  return years.reduce((acc, currentValue, currentIndex) => {
    const previous = acc[currentIndex]
    const periodIndex = currentIndex + 1

    const panelReplacementCost = replacementCostForPeriod(result.panelsCosts, result.panelLifetimeInYears, periodIndex, divider, totalPeriods)
    const inverterReplacementCost = replacementCostForPeriod(result.inverterCosts, result.inverterLifetimeInYears, periodIndex, divider, totalPeriods)
    const batteryReplacementCost = replacementCostForPeriod(result.batteryCosts, result.batteryLifetimeInYears, periodIndex, divider, totalPeriods)
    const maintenanceCost = maintainableCosts * (maintenancePercentPerYear / divider)
    const replacementCosts = panelReplacementCost + inverterReplacementCost + batteryReplacementCost

    return acc.concat({
      index: currentValue,
      tariff: previous.tariff * electricityPriceInflation,
      output: previous.output * capacityLoss,
      income: previous.income * electricityPriceInflation,
      cumulativeProfit: previous.cumulativeProfit + (previous.income * electricityPriceInflation) - replacementCosts - maintenanceCost,
      pvOutputPercentage: previous.pvOutputPercentage * capacityLoss,
      stepSizeInMonths: monthsInYear / divider,
      panelReplacementCost,
      inverterReplacementCost,
      batteryReplacementCost,
      maintenanceCost
    } as ReturnOnInvestment)
  }, [startYear])
}

// NPV and LCOE over a *yearly* projection (divider=1): discounts each year's cash flow and
// energy output back to present value using the configured discount rate. Year index 0 is "now"
// (discount factor 1) and carries the full upfront capex alongside its first year of income.
function discountedMetrics(yearlyProjection: ReturnOnInvestment[], capex: number, discountRate: number): { npv: number, levelizedCostOfEnergyPerKwh: number } {
  let npv = -capex
  let discountedCost = capex
  let discountedEnergy = 0

  yearlyProjection.forEach((year, index) => {
    const discountFactor = Math.pow(1 + discountRate, index)
    const replacementAndMaintenance = (year.panelReplacementCost ?? 0) + (year.inverterReplacementCost ?? 0) + (year.batteryReplacementCost ?? 0) + (year.maintenanceCost ?? 0)

    npv += (year.income - replacementAndMaintenance) / discountFactor
    discountedCost += replacementAndMaintenance / discountFactor
    discountedEnergy += year.output / discountFactor
  })

  return {
    npv,
    levelizedCostOfEnergyPerKwh: discountedEnergy > 0 ? discountedCost / discountedEnergy : 0
  }
}
