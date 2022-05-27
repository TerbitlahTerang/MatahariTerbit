import { calculateResultData } from './CalculationService'
import { InputData } from '../components/InputForm'
import { CALCULATOR_SETTINGS, MonthlyUsage, OptimizationTarget } from '../constants'

describe('Calculate system characteristics', () => {
  it('Should calculate system size in absence of irradiance information, using Sanur numbers', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      optimizationTarget: OptimizationTarget.Money,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const result = calculateResultData(data)
    expect(result.numberOfPanels).toBe(6)
  })

  it('Should require more panels when location is Jakarta', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      pvOut: 885,
      optimizationTarget: OptimizationTarget.Money,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const result = calculateResultData(data)
    expect(result.numberOfPanels).toBe(10)
  })

  it('Should cap panels to connection size', async () => {
    const smallConnection = 2200.0
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: smallConnection,
      pvOut: 885,
      optimizationTarget: OptimizationTarget.Money,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const result = calculateResultData(data)
    expect(result.numberOfPanels * CALCULATOR_SETTINGS.kiloWattPeakPerPanel).toBeLessThan(smallConnection)
    expect(result.numberOfPanels).toBe(4)
  })

  it('Should recommend no panels if negative profit', async () => {
    const bigConnection = 7700.0
    const data: InputData = {
      monthlyCostEstimateInRupiah: 500000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: bigConnection,
      pvOut: 885,
      optimizationTarget: OptimizationTarget.Money,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const result = calculateResultData(data)
    expect(result.numberOfPanels * CALCULATOR_SETTINGS.kiloWattPeakPerPanel).toBeLessThan(bigConnection)
    expect(result.numberOfPanels).toBe(0)
  })

  it('Should calculate all fields correctly', async () => {
    const smallConnection = 2200.0
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: smallConnection,
      pvOut: 1800,
      optimizationTarget: OptimizationTarget.Money,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const results = calculateResultData(data)

    expect(results.currentMonthlyCosts).toBe(1000000)
    expect(results.numberOfPanels).toBe(4)
    expect(Math.round(results.monthlyProfit)).toBe(431892)
    expect(Math.round(results.yearlyProfit)).toBe(Math.round(results.monthlyProfit * 12.0))

    expect(results.totalSystemCosts).toBe(results.numberOfPanels * CALCULATOR_SETTINGS.priceSettings.pricePerPanel)
    expect(results.remainingMonthlyCosts).toBe(results.currentMonthlyCosts - results.monthlyProfit)
  })

  it('Should calculate based on usage in kWh', async () => {
    const smallConnection = 2200.0
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000000.0 / (CALCULATOR_SETTINGS.plnSettings.highTariff * (1.0 + CALCULATOR_SETTINGS.plnSettings.energyTax)),
      connectionPower: smallConnection,
      pvOut: 1800,
      optimizationTarget: OptimizationTarget.Money,
      calculatorSettings: {
        ...CALCULATOR_SETTINGS,
        priceSettings: {
          ...CALCULATOR_SETTINGS.priceSettings,
          monthlyUsageType: MonthlyUsage.KWh
        }
      }
    }
    const results = calculateResultData(data)

    expect(results.currentMonthlyCosts).toBeCloseTo(1000000)
    expect(results.numberOfPanels).toBe(4)
    expect(Math.round(results.monthlyProfit)).toBe(431892)
    expect(Math.round(results.yearlyProfit)).toBe(Math.round(results.monthlyProfit * 12.0))
  })
})