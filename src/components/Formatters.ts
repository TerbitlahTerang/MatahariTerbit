
export const formatRupiah = (value: string | number | undefined): string => {
   const amount = value ?? 0
   return `Rp. ${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatNumber = (value: number | undefined, locale: string): string => {
   const amount = value ?? 0
   return Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)
}