export interface DailyEnergyBalance {
  solarServedKwh: number
  curtailedKwh: number
}

// Models a single "average day": how much of the daily load solar + battery can serve,
// and how much generation is wasted (curtailed) because it can't be exported to the grid.
// Direct port of the dailyBalance() function in off-grid-solar-estimator.html.
export function computeDailyEnergyBalance(
  dailyGenerationKwh: number,
  dailyLoadKwh: number,
  daytimeUseShare: number,
  usableBatteryKwh: number,
  roundTripEfficiency: number
): DailyEnergyBalance {
  const directDay = Math.min(daytimeUseShare * dailyLoadKwh, dailyGenerationKwh)
  const pvSurplus = Math.max(0, dailyGenerationKwh - directDay)
  const stored = Math.min(pvSurplus, usableBatteryKwh)
  const delivered = stored * roundTripEfficiency
  const nightLoad = (1 - daytimeUseShare) * dailyLoadKwh
  const nightServed = Math.min(delivered, nightLoad)
  const solarServedKwh = Math.min(directDay + nightServed, dailyLoadKwh)
  const curtailedKwh = (pvSurplus - stored) + Math.max(0, delivered - nightServed)

  return { solarServedKwh, curtailedKwh }
}
