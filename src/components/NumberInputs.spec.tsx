import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DecimalInput, IntegerInput, parseDecimal, parseInteger, PercentInput } from './NumberInputs'

beforeAll(async () => {
  await i18n.use(initReactI18next).init({ lng: 'en', resources: {} })
})

const renderIn = async (language: string, element: React.ReactElement) => {
  await i18n.changeLanguage(language)
  render(element)
  return screen.getByRole('spinbutton') as HTMLInputElement
}

const typeInto = (input: HTMLInputElement, text: string) => {
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value: text } })
  fireEvent.blur(input)
}

const lastValue = (onChange: jest.Mock) => onChange.mock.calls[onChange.mock.calls.length - 1][0]

describe('Parsing whole numbers', () => {
  it('ignores thousands separators of any language', async () => {
    expect(parseInteger('300,000,000')).toBe(300000000)
    expect(parseInteger('300.000.000')).toBe(300000000)
    expect(parseInteger('300 000 000')).toBe(300000000)
    expect(parseInteger('300 000 000')).toBe(300000000) // French narrow no-break space
  })

  it('ignores currency and units around the number', async () => {
    expect(parseInteger('Rp. 300.000.000')).toBe(300000000)
    expect(parseInteger('Rp. 300,000,000')).toBe(300000000)
    expect(parseInteger('1,234 kWh')).toBe(1234)
  })

  it('returns NaN when there are no digits, so antd keeps the previous value', async () => {
    expect(parseInteger('')).toBeNaN()
    expect(parseInteger('Rp. ')).toBeNaN()
    expect(parseInteger(undefined)).toBeNaN()
  })
})

describe('Parsing decimals', () => {
  it('accepts both a point and a comma as the decimal separator', async () => {
    expect(parseDecimal('0.80')).toBe(0.8)
    expect(parseDecimal('0,80')).toBe(0.8)
    expect(parseDecimal('1.5')).toBe(1.5)
    expect(parseDecimal('1,5')).toBe(1.5)
  })

  it('ignores a trailing percent sign', async () => {
    expect(parseDecimal('35 %')).toBe(35)
    expect(parseDecimal('5,25 %')).toBe(5.25)
  })

  it('returns NaN for an empty field', async () => {
    expect(parseDecimal('')).toBeNaN()
  })
})

describe('IntegerInput', () => {
  it('shows Rupiah with the thousands separator of the page language', async () => {
    const monthlyBill = 300000000

    expect((await renderIn('en', <IntegerInput before="Rp. " defaultValue={monthlyBill}/>)).value).toBe('Rp. 300,000,000')
    cleanup()
    expect((await renderIn('id', <IntegerInput before="Rp. " defaultValue={monthlyBill}/>)).value).toBe('Rp. 300.000.000')
  })

  it('shows a unit after the number', async () => {
    const input = await renderIn('id', <IntegerInput after=" kWh" defaultValue={1234}/>)

    expect(input.value).toBe('1.234 kWh')
  })

  it('reads an English-style amount typed on an Indonesian page', async () => {
    const onChange = jest.fn()
    const input = await renderIn('id', <IntegerInput before="Rp. " onChange={onChange}/>)

    typeInto(input, '1,500,000')

    expect(lastValue(onChange)).toBe(1500000)
    expect(input.value).toBe('Rp. 1.500.000')
  })

  it('reads an amount that still contains the currency prefix', async () => {
    const onChange = jest.fn()
    const input = await renderIn('de', <IntegerInput before="Rp. " onChange={onChange}/>)

    typeInto(input, 'Rp. 1.500.000')

    expect(lastValue(onChange)).toBe(1500000)
  })
})

describe('DecimalInput', () => {
  it('shows the decimal separator of the page language', async () => {
    const daysOfAutonomy = 0.8

    expect((await renderIn('en', <DecimalInput digits={2} defaultValue={daysOfAutonomy}/>)).value).toBe('0.80')
    cleanup()
    expect((await renderIn('de', <DecimalInput digits={2} defaultValue={daysOfAutonomy}/>)).value).toBe('0,80')
  })

  it('does not group thousands, so a point or comma can only be the decimal separator', async () => {
    const input = await renderIn('id', <DecimalInput digits={1} defaultValue={1500}/>)

    expect(input.value).toBe('1500,0')
  })

  it('reads 0.80 typed on an Indonesian page as 0.8, not 80', async () => {
    const onChange = jest.fn()
    const input = await renderIn('id', <DecimalInput digits={2} onChange={onChange}/>)

    typeInto(input, '0.80')

    expect(lastValue(onChange)).toBe(0.8)
    expect(input.value).toBe('0,80')
  })

  it('reads 0,80 typed on an English page as 0.8', async () => {
    const onChange = jest.fn()
    const input = await renderIn('en', <DecimalInput digits={2} onChange={onChange}/>)

    typeInto(input, '0,80')

    expect(lastValue(onChange)).toBe(0.8)
    expect(input.value).toBe('0.80')
  })
})

describe('PercentInput', () => {
  it('shows a stored fraction as a percentage', async () => {
    const daytimeUseShare = 0.35
    const input = await renderIn('id', <PercentInput defaultValue={daytimeUseShare}/>)

    expect(input.value).toBe('35 %')
  })

  it('shows decimals with the separator of the page language', async () => {
    const inflationRate = 0.0525
    const input = await renderIn('de', <PercentInput digits={2} defaultValue={inflationRate}/>)

    expect(input.value).toBe('5,25 %')
  })

  it('stores a typed percentage as a fraction, whichever decimal separator is used', async () => {
    const onChange = jest.fn()
    const input = await renderIn('id', <PercentInput digits={2} onChange={onChange}/>)

    typeInto(input, '5,25')
    expect(lastValue(onChange)).toBeCloseTo(0.0525, 10)

    typeInto(input, '5.25')
    expect(lastValue(onChange)).toBeCloseTo(0.0525, 10)
  })
})
