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
    expect(result.numberOfPanels).toBe(12)
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
    expect(result.numberOfPanels).toBe(17)
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
    expect(Math.round(results.monthlyProfit)).toBe(427798)
    expect(Math.round(results.yearlyProfit)).toBe(Math.round(results.monthlyProfit * 12.0))

    // totalSystemCosts now covers the whole system (panels + inverter + battery + BOS +
    // installation), not just panels, so it's strictly greater than the panel cost alone.
    expect(results.totalSystemCosts).toBeGreaterThan(results.numberOfPanels * CALCULATOR_SETTINGS.priceSettings.pricePerPanel)
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
    expect(Math.round(results.monthlyProfit)).toBe(427798)
    expect(Math.round(results.yearlyProfit)).toBe(Math.round(results.monthlyProfit * 12.0))
  })

  it('Should replace the inverter and battery more than once over a 25-year projection', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      pvOut: 1800,
      optimizationTarget: OptimizationTarget.Money,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const results = calculateResultData(data)

    // inverterLifetimeInYears defaults to 9 and the analysis period to 25 years, so a correct
    // (non-single-shot) replacement schedule fires at year 9 AND year 18, not just once.
    const inverterReplacementYears = results.projection.filter(y => (y.inverterReplacementCost ?? 0) > 0).map(y => y.index)
    expect(inverterReplacementYears).toEqual([9, 18])

    // batterySettings.serviceLifeInYears defaults to 10, so it should fire at 10 and 20.
    const batteryReplacementYears = results.projection.filter(y => (y.batteryReplacementCost ?? 0) > 0).map(y => y.index)
    expect(batteryReplacementYears).toEqual([10, 20])

    // panelLifetimeInYears defaults to 25, equal to the analysis period, so it never fires
    // within the horizon (a replacement due exactly at the last year isn't purchased again).
    const panelReplacementYears = results.projection.filter(y => (y.panelReplacementCost ?? 0) > 0).map(y => y.index)
    expect(panelReplacementYears).toEqual([])
  })
})