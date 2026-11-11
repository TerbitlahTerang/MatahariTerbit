import { InputNumber, InputNumberProps } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = Omit<InputNumberProps<number>, 'formatter' | 'parser' | 'precision' | 'decimalSeparator'>

const style = { width: '100%', textAlign: 'right' } as const

const decimalSeparatorOf = (locale: string) =>
  new Intl.NumberFormat(locale).formatToParts(0.1).find((p) => p.type === 'decimal')?.value ?? '.'

const isEmpty = (value: unknown) => value === undefined || value === null || `${value}` === ''

// Whole numbers: every non-digit is a thousands separator or a unit ("Rp.", "kWh"), so drop them all.
export const parseInteger = (text = ''): number => {
  const digits = text.replace(/\D/g, '')
  return digits === '' ? NaN : Number(digits)
}

// Decimals are shown without thousands separators, so '.' or ',' can only be the decimal point.
export const parseDecimal = (text = ''): number => parseFloat(text.replace(',', '.'))

export const IntegerInput = ({ before = '', after = '', ...props }: Props & { before?: string, after?: string }) => {
  const { i18n } = useTranslation()
  return (
    <InputNumber<number> style={style} autoComplete="off" {...props}
      precision={0}
      // Never show decimals: parseInteger would read "1.699,53" back as 169953.
      formatter={(value, { userTyping, input }) =>
        userTyping || isEmpty(value)
          ? input
          : `${before}${new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }).format(Number(value))}${after}`}
      parser={parseInteger}
    />
  )
}

export const DecimalInput = ({ digits = 2, ...props }: Props & { digits?: number }) => {
  const { i18n } = useTranslation()
  return (
    <InputNumber<number> style={style} autoComplete="off" {...props}
      precision={digits}
      decimalSeparator={decimalSeparatorOf(i18n.language)}
      parser={parseDecimal}
    />
  )
}

/** A fraction (0.35) shown as a percentage ("35 %"). */
export const PercentInput = ({ digits = 0, ...props }: Props & { digits?: number }) => {
  const { i18n } = useTranslation()
  return (
    <InputNumber<number> style={style} autoComplete="off" {...props}
      formatter={(value, { userTyping, input }) =>
        userTyping || isEmpty(value)
          ? input
          : `${(Number(value) * 100).toFixed(digits).replace('.', decimalSeparatorOf(i18n.language))} %`}
      parser={(text) => parseDecimal(text) / 100}
    />
  )
}
