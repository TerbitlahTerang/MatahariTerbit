import { calculateResultData } from './CalculationService'
import { InputData } from '../components/InputForm'
import { CALCULATOR_VALUES } from '../constants'

describe('Calculate system characteristics', () => {
  it('Should calculate system size in absence of irradiance information, using Sanur numbers', async () => {
    const data: InputData = { monthlyCostEstimateInRupiah: 1000000.0, connectionPower: 7700.0 }
    const result = calculateResultData(data)
    expect(result.numberOfPanels).toBe(6)
  })

  it('Should require more panels when location is Jakarta', async () => {
    const data: InputData = { monthlyCostEstimateInRupiah: 1000000.0, connectionPower: 7700.0, pvOut: 885 }
    const result = calculateResultData(data)
    expect(result.numberOfPanels).toBe(11)
  })

  it('Should cap panels to connection size', async () => {
    const smallConnection = 2200.0
    const data: InputData = { monthlyCostEstimateInRupiah: 1000000.0, connectionPower: smallConnection, pvOut: 885 }
    const result = calculateResultData(data)
    expect(result.numberOfPanels * CALCULATOR_VALUES.kiloWattPeakPerPanel).toBeLessThan(smallConnection)
    expect(result.numberOfPanels).toBe(6)
  })

  it('Should recommend no panels if negative profit', async () => {
    const bigConnection = 7700.0
    const data: InputData = { monthlyCostEstimateInRupiah: 500000.0, connectionPower: bigConnection, pvOut: 885 }
    const result = calculateResultData(data)
    expect(result.numberOfPanels * CALCULATOR_VALUES.kiloWattPeakPerPanel).toBeLessThan(bigConnection)
    expect(result.numberOfPanels).toBe(0)
  })

  it('Should calculate all fields correctly', async () => {
    const smallConnection = 2200.0
    const data: InputData = { monthlyCostEstimateInRupiah: 1000000.0, connectionPower: smallConnection, pvOut: 1800 }
    const results = calculateResultData(data)

    expect(results.currentMonthlyCosts).toBe(1000000)
    expect(results.numberOfPanels).toBe(6)
    expect(results.minimalMonthlyCostsIncludingTax).toBe(151800)
    expect(Math.round(results.monthlyProfit)).toBe(575856)
    expect(Math.round(results.yearlyProfit)).toBe(Math.round(results.monthlyProfit * 12.0))

    expect(results.totalSystemCosts).toBe(results.numberOfPanels * CALCULATOR_VALUES.pricePerPanel)
    expect(results.remainingMonthlyCosts).toBe(results.currentMonthlyCosts - results.monthlyProfit)
  })
})