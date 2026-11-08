import i18n, { changeLanguage, init } from 'i18next'
import { formatDigits, parseNumber } from './Formatters'

describe('parseNumber', () => {
  it.each([
    ['en', 3000, 0],
    ['id', 3000, 0],
    ['en', 1234.56, 2],
    ['id', 1234.56, 2],
    ['en', 0.25, 2],
    ['id', 0.25, 2]
  ])('reads back what formatDigits shows in %s for %d', (locale, value, digits) => {
    expect(parseNumber(formatDigits(value, digits, locale), locale)).toBe(value)
  })

  it('uses the page language when no locale is given', async () => {
    await init({ lng: 'id', resources: {} })
    expect(parseNumber(formatDigits(3000, 0, i18n.language))).toBe(3000)
    await changeLanguage('en')
    expect(parseNumber(formatDigits(3000, 0, i18n.language))).toBe(3000)
  })
})
