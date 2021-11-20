
export const formatRupiah = (value: string | number | undefined): string => {
  const amount = +`${value ?? 0}`
  return `Rp. ${Math.round(amount)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatNumber = (value: number | undefined, locale: string): string => {
  return formatDigits(value, 0, locale)
}

export const formatDigits = (value: number | undefined, digits: number | undefined, locale: string): string => {
  const amount = value ?? 0
  return Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount)
}