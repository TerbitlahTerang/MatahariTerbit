import { computeDailyEnergyBalance } from './SelfConsumption'

describe('computeDailyEnergyBalance', () => {
  it('serves the whole day with zero curtailment when the battery comfortably covers the surplus', () => {
    const result = computeDailyEnergyBalance(6, 10, 0.4, 5, 1.0)
    expect(result.solarServedKwh).toBeCloseTo(6)
    expect(result.curtailedKwh).toBeCloseTo(0)
  })

  it('curtails the surplus that does not fit in an undersized battery', () => {
    const result = computeDailyEnergyBalance(6, 10, 0.4, 1, 1.0)
    expect(result.solarServedKwh).toBeCloseTo(5)
    expect(result.curtailedKwh).toBeCloseTo(1)
  })

  it('ignores the battery entirely when daytime use share is 100%', () => {
    const result = computeDailyEnergyBalance(6, 10, 1.0, 5, 0.9)
    expect(result.solarServedKwh).toBeCloseTo(6)
    expect(result.curtailedKwh).toBeCloseTo(0)
  })

  it('routes everything through the battery when daytime use share is 0%', () => {
    const result = computeDailyEnergyBalance(6, 10, 0, 3, 0.8)
    expect(result.solarServedKwh).toBeCloseTo(2.4)
    expect(result.curtailedKwh).toBeCloseTo(3)
  })

  it('never serves more than the daily load, even with an oversized battery and generation', () => {
    const result = computeDailyEnergyBalance(20, 10, 0.5, 20, 1.0)
    expect(result.solarServedKwh).toBeLessThanOrEqual(10)
  })
})
