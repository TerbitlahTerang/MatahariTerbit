// import { Select } from 'antd'
import React, { useMemo, useState } from 'react'
import CurrencyInput from "react-currency-input-field"

export default function InputForm() {
  const powerOptions = [450, 900, 1300, 2200, 3500, 3900, 4400, 5500, 6600, 7700, 10600, 11000, 13200, 16500]

  const [consumption, setConsumption] = useState(1000000)

  const [connectionPower, setConnectionPower] = useState(7700)


  const lowTariff = 1352
  // add tax
  const highTariff = 1444.70

  // https://globalsolaratlas.info/map?c=-8.674473,115.030093,11&s=-8.702747,115.26267&m=site&pv=small,0,12,1
  // Square meters 450. 225 Watts / m2. Maybe add effective m2 needed vs panel surface

  const kiloWattPeakPerPanel = 0.330
  // Either mountains vs coast or map location selecgtion
  const kiloWattHourPerYearPerKWp = 1632
  const kiloWattHourPerYearPerPanel = kiloWattHourPerYearPerKWp * kiloWattPeakPerPanel

  // 4.4 kWh output / per 1 kWp (in Sanur)

  const baseMonthlyCosts = useMemo(() => {
    return 40 * (connectionPower / 1000) * 1500 // * 0.9 because kVa + taxes
  }, [connectionPower])

  const consumptionPerYearInKwh = useMemo(() => {
    const costsPerMonth = consumption - baseMonthlyCosts
    const costsPerYear = costsPerMonth * 12
    const pricePerKwh = connectionPower < 1300 ? lowTariff : highTariff

    return costsPerYear / pricePerKwh
  }, [consumption, connectionPower, baseMonthlyCosts])

  // commercial, small business, residential
  // capping based on meter size


  const numberOfPanels = useMemo(() => {
    return Math.max(0, consumptionPerYearInKwh / kiloWattHourPerYearPerPanel)
  }, [consumptionPerYearInKwh, kiloWattHourPerYearPerPanel])


  const changeConsumption = (val?: string, name?: string) => {
    if (val) {
      setConsumption(parseInt(val))
    } else setConsumption(0)
  }

  const changeConnection = (event: any) => {
    setConnectionPower(event.target.value)
  }

  return (
    <div>
      <h1>Hey Roy</h1>
      <table>
        <tr>
          <td>Monthly Electricity bill</td>
          <td align="right"><CurrencyInput prefix={'Rp. '} value={consumption}
            onValueChange={changeConsumption} inputMode="numeric"
            autoComplete="off" /></td>
        </tr>
        <tr>
          <td>Electricity Connection</td>
          <td align="right">
            <select value={connectionPower} onChange={changeConnection}>
              {powerOptions.map(option => (<option value={option}>{option} KVA</option>))}
            </select>
          </td>
        </tr>
      </table>

      <table className="results">
        <tr>
          <td>Yearly Consumption</td>
          <td>{Math.round(consumptionPerYearInKwh)} kWh</td>
        </tr>
        <tr>
          <td>Panels</td>
          <td>{Math.round(numberOfPanels)}</td>
        </tr>
        <tr>
          <td>Base costs</td>
          <td>{Math.round(baseMonthlyCosts)}</td>
        </tr>
      </table>
    </div>
  )
}