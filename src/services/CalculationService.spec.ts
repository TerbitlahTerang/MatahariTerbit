import { calculateResultData } from './CalculationService'
import { InputData } from '../components/InputForm'
import { CALCULATOR_VALUES } from '../constants'

describe('Calculate system characteristics', () => {
  it('Should calculate system size in absence of irradiance information, using Sanur numbers', async () => {
    const data: InputData = { monthlyCostEstimateInRupiah: 1000000.0, connectionPower: 7700.0 }
    const result = calculateResultData(data)
    expect(result.numberOfPanels).toBe(5)
  })

  it('Should require more panels when location is Jakarta', async () => {
    const data: InputData = { monthlyCostEstimateInRupiah: 1000000.0, connectionPower: 7700.0, pvOut: 885 }
    const result = calculateResultData(data)
    expect(result.numberOfPanels).toBe(10)
  })

  it('Should cap panels to connection size', async () => {
    const smallConnection = 2200.0
    const data: InputData = { monthlyCostEstimateInRupiah: 1000000.0, connectionPower: smallConnection, pvOut: 885 }
    const result = calculateResultData(data)
    expect(result.numberOfPanels * CALCULATOR_VALUES.kiloWattPeakPerPanel).toBeLessThan(smallConnection)
    expect(result.numberOfPanels).toBe(5)
  })
})