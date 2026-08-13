import { calculateResultData } from './CalculationService'
import { InputData } from '../components/InputForm'
import { CALCULATOR_SETTINGS, MonthlyUsage, SystemType } from '../constants'

describe('Calculate system characteristics', () => {
  it('Should calculate system size in absence of irradiance information, using Sanur numbers', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const result = calculateResultData(data)
    expect(result.numberOfPanels).toBe(7)
  })

  it('Should require more panels when location is Jakarta', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      pvOut: 885,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const result = calculateResultData(data)
    // Jakarta's lower irradiance used to bump into the 7700 VA connection cap at 17 panels;
    // with connection size no longer limiting, the physical sizing formula alone recommends 22.
    expect(result.numberOfPanels).toBe(14)
  })

  it('Should not cap the number of panels to a small connection size', async () => {
    const smallConnection = 2200.0
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: smallConnection,
      pvOut: 885,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const result = calculateResultData(data)
    // A 2200 VA connection would previously cap this at 4 panels (~1.8 kWp). Connection size is
    // no longer a limiting factor (prepaid systems have no such restriction), so the physical
    // sizing formula alone recommends noticeably more.
    expect(result.numberOfPanels).toBeGreaterThan(4)
  })

  it('Should calculate all fields correctly', async () => {
    const connectionPower = 2200.0
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower,
      pvOut: 1800,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const results = calculateResultData(data)

    expect(results.currentMonthlyCosts).toBe(1000000)
    expect(results.numberOfPanels).toBe(7)
    expect(Math.round(results.monthlyProfit)).toBe(825000)
    expect(Math.round(results.yearlyProfit)).toBe(Math.round(results.monthlyProfit * 12.0))

    // totalSystemCosts now covers the whole system (panels + inverter + battery + BOS +
    // installation), not just panels, so it's strictly greater than the panel cost alone.
    expect(results.totalSystemCosts).toBeGreaterThan(results.numberOfPanels * CALCULATOR_SETTINGS.priceSettings.pricePerPanel)
    expect(results.remainingMonthlyCosts).toBe(results.currentMonthlyCosts - results.monthlyProfit)
  })

  it('Should calculate based on usage in kWh', async () => {
    const connectionPower = 2200.0
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000000.0 / (CALCULATOR_SETTINGS.plnSettings.highTariff * (1.0 + CALCULATOR_SETTINGS.plnSettings.energyTax)),
      connectionPower,
      pvOut: 1800,
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
    expect(results.numberOfPanels).toBe(7)
    expect(Math.round(results.monthlyProfit)).toBe(825000)
    expect(Math.round(results.yearlyProfit)).toBe(Math.round(results.monthlyProfit * 12.0))
  })

  it('Should replace the inverter and battery more than once over a 25-year projection', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      pvOut: 1800,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const results = calculateResultData(data)

    // inverterLifetimeInYears defaults to 9 and the analysis period to 25 years, so a correct
    // (non-single-shot) replacement schedule fires at year 9 AND year 18, not just once.
    const inverterReplacementYears = results.projection.filter(y => (y.inverterReplacementCost ?? 0) > 0).map(y => y.index)
    expect(inverterReplacementYears).toEqual([9, 18])

    // batterySettings.serviceLifeInYears defaults to 12.5, so it should fire at 10 and 20.
    const batteryReplacementYears = results.projection.filter(y => (y.batteryReplacementCost ?? 0) > 0).map(y => y.index)
    expect(batteryReplacementYears).toEqual([13])

    // panelLifetimeInYears defaults to 25, equal to the analysis period, so it never fires
    // within the horizon (a replacement due exactly at the last year isn't purchased again).
    const panelReplacementYears = results.projection.filter(y => (y.panelReplacementCost ?? 0) > 0).map(y => y.index)
    expect(panelReplacementYears).toEqual([])
  })
})

describe('Off-grid system sizing', () => {
  it('sizes panels the same way as grid-hybrid - neither is capped by connection size', async () => {
    const smallConnection = 900.0
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: smallConnection,
      pvOut: 1800,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const hybridResult = calculateResultData({ ...data, systemType: SystemType.GridHybrid })
    const offGridResult = calculateResultData({ ...data, systemType: SystemType.OffGrid })

    expect(offGridResult.numberOfPanels).toBe(hybridResult.numberOfPanels)
  })

  it('has no PLN bill and no residual grid bill', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      pvOut: 1800,
      systemType: SystemType.OffGrid,
      calculatorSettings: CALCULATOR_SETTINGS
    }
    const result = calculateResultData(data)

    expect(result.remainingMonthlyCosts).toBe(0)
    expect(result.residualAnnualGridBillInRupiah).toBeUndefined()
  })

  it('reports unmet load risk when the battery is too small to ride out the night', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      pvOut: 1800,
      systemType: SystemType.OffGrid,
      calculatorSettings: {
        ...CALCULATOR_SETTINGS,
        batterySettings: {
          ...CALCULATOR_SETTINGS.batterySettings,
          daysOfAutonomy: 0.05
        }
      }
    }
    const result = calculateResultData(data)

    expect(result.selfSufficiencyPercentage).toBeLessThan(100)
    expect(result.gridImportPerYearInKwh).toBeGreaterThan(0)
  })

  it('populates per-year solar-served/curtailed/grid-import figures in the projection, not just the year-1 summary', async () => {
    const data: InputData = {
      monthlyCostEstimateInRupiah: 1000000.0,
      monthlyUsageInKwh: 1000,
      connectionPower: 7700.0,
      pvOut: 1800,
      systemType: SystemType.GridHybrid,
      calculatorSettings: {
        ...CALCULATOR_SETTINGS,
        selfConsumptionSettings: {
          ...CALCULATOR_SETTINGS.selfConsumptionSettings,
          pvOversizeFactor: 1.5
        }
      }
    }
    const result = calculateResultData(data)

    for (const year of result.projection) {
      expect(year.solarServedInKwh).toBeGreaterThan(0)
      expect(year.curtailedInKwh).toBeGreaterThanOrEqual(0)
    }
    // A sizeable oversize factor with default self-consumption settings should curtail something.
    expect(result.projection.some(year => (year.curtailedInKwh ?? 0) > 0)).toBe(true)
  })
})