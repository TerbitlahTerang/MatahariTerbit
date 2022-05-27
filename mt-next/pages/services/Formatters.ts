
export const formatRupiah = (value: string | number | undefined): string => {
  const amount = +`${value ?? 0}`
  return `Rp. ${Math.round(amount)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const parseRupiah = (value: string | number | undefined): number => {
  if (value === undefined) {
    return 0
  }
  if (typeof value === 'string') {
    return +value.replace(/Rp\.\s?|(,*)/g, '')
  }
  return value
}


export const formatNumber = (value: string | number | undefined, locale: string): string => {
  return formatDigits(value, 0, locale)
}

export const parseNumber = (value: string | number | undefined): number => {
  if (value === undefined) {
    return 0
  }
  if (typeof value === 'string') {
    return parseFloat(value.replace(',', '.'))
  }
  return value
}

export const formatPercentage = (value: string | number | undefined, locale: string, digits = 0): string => {
  if (value === undefined) {
    return '0 %'
  }
  if (typeof value === 'string') {
    const val = parseFloat(value) * 100.0
    const percentage = Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(val)
    return `${percentage} %`
  }
  return `${value} %`
}

export const parsePercentage = (value: string | number | undefined): number => {
  if (value === undefined) {
    return 0.0
  }

  if (typeof value === 'string') {
    return parseFloat(value.replace(' %', '').replace(',', '.')) / 100.0
  }

  return value
}

export const formatDigits = (value: string | number | undefined, digits: number | undefined, locale: string): string => {
  const amount = value === undefined ? 0 : +value
  return Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount)
}

export const formatKwh = (value: string | number | undefined): string => {
  const amount = +`${value ?? 0}`
  return `kWh ${Math.round(amount)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const parseKwh = (value: string | number | undefined): number => {
  if (value === undefined) {
    return 0
  }
  if (typeof value === 'string') {
    return +value.replace(/kWh\s?|(,*)/g, '')
  }
  return value
}