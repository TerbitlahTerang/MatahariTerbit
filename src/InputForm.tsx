import { Col, Form, InputNumber, Row, Select } from 'antd'
import React, { useMemo, useState } from 'react'

export interface PowerOption {
  name: string
  value: number
}

export default function InputForm() {
  const powerOptions: PowerOption[] = [
    { name: '450 KVA', value: 450 },
    { name: '900 KVA', value: 900 },
    { name: '1300 KVA', value: 1300 },
    { name: '2200 KVA', value: 2200 },
    { name: '3500 KVA', value: 3500 },
    { name: '3900 KVA', value: 3900 },
    { name: '4400 KVA', value: 4400 },
    { name: '5500 KVA', value: 5500 },
    { name: '6600 KVA', value: 6600 },
    { name: '7700 KVA', value: 7700 },
    { name: '10600 KVA', value: 10600 },
    { name: '11000 KVA', value: 11000 },
    { name: '13200 KVA', value: 13200 },
    { name: '16500 KVA', value: 16500 }
  ]

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


  const changeConsumption = (value: number) => {
    setConsumption(value)
  }

  const changeConnection = (value: number) => {
    setConnectionPower(value)
  }

  return (
    <div>
      <Form layout="vertical" name="calculator">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="bill" label="Monthly Electricity bill">
              <InputNumber style={{ width: '100%', textAlign: 'right' }}
                defaultValue={consumption}
                onChange={changeConsumption}
                formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value ? +value.replace(/Rp\.\s?|(,*)/g, '') : 0} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="connection" label="Electricity Connection">
              <Select style={{ width: '100%' }} value={connectionPower} onChange={changeConnection} >
                {powerOptions.map(option => (<Select.Option key={option.value} value={option.value}>{option.name}</Select.Option>))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <table className="results">
        <tbody>
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
        </tbody>
      </table>
    </div>
  )
}