import {useMemo, useState} from "react";
import CurrencyInput from "react-currency-input-field";

export default function InputForm() {
    const powerOptions = [450, 900, 1300, 2200, 3500, 3900, 4400, 5500, 6600, 7700, 10600, 11000, 13200, 16500]

    const [consumption, setConsumption] = useState(1000000)

    const [connectionPower, setConnectionPower] = useState(7700)


    const lowTariff = 1352
    const highTariff = 1444.70

    // https://globalsolaratlas.info/map?c=-8.674473,115.030093,11&s=-8.702747,115.26267&m=site&pv=small,0,12,1
    const kiloWattPeakPerPanel = 0.330
    const kiloWattHourPerYearPerKWp = 1632
    const kiloWattHourPerYearPerPanel = kiloWattHourPerYearPerKWp * kiloWattPeakPerPanel


    const consumptionPerYearInKwh = useMemo(() => {
        const costsPerMonth = consumption
        const costsPerYear = costsPerMonth * 12
        const pricePerKwh = connectionPower < 1300 ? lowTariff : highTariff

        return costsPerYear / pricePerKwh
    }, [consumption, connectionPower]);

    const multiplied = useMemo(() => {
        return consumptionPerYearInKwh / kiloWattHourPerYearPerPanel
    }, [consumptionPerYearInKwh]);


    const changeConsumption = (val?: string, name?: string) => {
        if (val) {
            setConsumption(parseInt(val));
        }
    }

    const changeConnection = (event: any) => {
        setConnectionPower(event.target.value)
    }


    return (
        <div>
            <table>
                <tr>
                    <td>Monthly Electricity bill</td>
                    <td align="right"><CurrencyInput prefix={'Rp. '} value={consumption} onValueChange={changeConsumption} /></td>
                </tr>
                <tr>
                    <td>Electricity Connection</td>
                    <td align="right">
                        <select value={connectionPower} onChange={changeConnection}>
                            {powerOptions.map(option => (<option value={option}>{option} Watt</option>))}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Konsumsi Listrik</td>
                    <td align="right">
                        <input type="range" min="0" max="1" step="0.1" defaultValue={0.5} />
                    </td>
                </tr>
                <tr>
                    <td>Yearly Consumption {Math.round(consumptionPerYearInKwh)} kWh</td><td>Panels: {Math.round(multiplied)}</td>
                </tr>
            </table>
        </div>
    )
}