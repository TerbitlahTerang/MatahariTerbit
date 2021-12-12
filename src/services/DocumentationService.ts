import ConnectionPowerMarkdownId from '../assets/documentation/id/inputform/ConnectionPower.md'
import ConnectionPowerMarkdownEn from '../assets/documentation/en/inputform/ConnectionPower.md'


export enum Documentation {
  ConnectionPower
}

export enum Locale {
  Indonesian = 'id',
  English = 'en'
}

function getIndonesian(doc: Documentation): string {
  switch (doc) {
    case Documentation.ConnectionPower: return ConnectionPowerMarkdownId.body
  }
}

function getEnglish(doc: Documentation): string {
  switch (doc) {
    case Documentation.ConnectionPower: return ConnectionPowerMarkdownEn.body
  }
}


export function documentation(locale: Locale, doc: Documentation): string {
  switch (locale) {
    case Locale.Indonesian: return getIndonesian(doc)
    case Locale.English: return getEnglish(doc)
  }
}
