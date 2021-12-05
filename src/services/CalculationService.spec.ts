import { calculateResultData } from './CalculationService'
import { InputData } from '../components/InputForm'
import { MapState } from '../util/mapStore'


describe('Calculate system characteristics', () => {
  it('should calculate correct system size', async () => {
    const data: InputData = { monthlyCostEstimateInRupiah: 100000.0, connectionPower: 12000.0, location: { } as MapState }
    const result = calculateResultData(data)
    expect(result).toBe('')
  })
})