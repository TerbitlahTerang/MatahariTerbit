
export const formatRupiah = (value: string | number | undefined): string => {
  const amount = +`${value ?? 0}`
  return `Rp. ${Math.round(amount)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}


export const formatNumber = (value: string | number | undefined, locale: string): string => {
  return formatDigits(value, 0, locale)
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
