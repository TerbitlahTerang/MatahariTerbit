import ConnectionPowerMarkdownId from '../assets/documentation/id/inputform/ConnectionPower.md'
import ConnectionPowerMarkdownEn from '../assets/documentation/en/inputform/ConnectionPower.md'
import MonthlyBillEn from '../assets/documentation/en/inputform/MonthlyBill.md'
import MonthlyBillId from '../assets/documentation/id/inputform/MonthlyBill.md'


export enum Documentation {
  ConnectionPower,
  MonthlyBill
}

export enum Locale {
  Indonesian = 'id',
  English = 'en'
}

function getIndonesian(doc: Documentation): string {
  switch (doc) {
    case Documentation.ConnectionPower: return ConnectionPowerMarkdownId.body
    case Documentation.MonthlyBill: return MonthlyBillId.body
  }
}

function getEnglish(doc: Documentation): string {
  switch (doc) {
    case Documentation.ConnectionPower: return ConnectionPowerMarkdownEn.body
    case Documentation.MonthlyBill: return MonthlyBillEn.body
  }
}


export function documentation(locale: Locale, doc: Documentation): string {
  switch (locale) {
    case Locale.Indonesian: return getIndonesian(doc)
    case Locale.English: return getEnglish(doc)
  }
}
