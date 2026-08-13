import MonthlyBillEn from '../assets/documentation/en/inputform/MonthlyBill.md'
import MonthlyBillId from '../assets/documentation/id/inputform/MonthlyBill.md'
import NumberOfPanelsEn from '../assets/documentation/en/results/NumberOfPanels.md'
import NumberOfPanelsId from '../assets/documentation/id/results/NumberOfPanels.md'
import AreaRequiredEn from '../assets/documentation/en/results/AreaRequired.md'
import AreaRequiredId from '../assets/documentation/id/results/AreaRequired.md'
import MinimalPaymentEn from '../assets/documentation/en/results/MinimalPayment.md'
import MinimalPaymentId from '../assets/documentation/id/results/MinimalPayment.md'
import LocationEn from '../assets/documentation/en/inputform/Location.md'
import LocationId from '../assets/documentation/id/inputform/Location.md'
import RoiExplanationEn from '../assets/documentation/en/results/RoiExplanation.md'
import RoiExplanationId from '../assets/documentation/id/results/RoiExplanation.md'
import PlnSettingsEn from '../assets/documentation/en/expert/PLNSettings.md'
import PlnSettingsId from '../assets/documentation/id/expert/PLNSettings.md'
import BatterySettingsEn from '../assets/documentation/en/expert/BatterySettings.md'
import BatterySettingsId from '../assets/documentation/id/expert/BatterySettings.md'
import AppInfoEn from '../assets/documentation/en/app/AppInfo.md'
import AppInfoId from '../assets/documentation/id/app/AppInfo.md'
import * as Analytics from './Analytics'
import { Category } from './Analytics'

export enum Documentation {
  MonthlyBill,
  Location,
  NumberOfPanels,
  AreaRequired,
  MinimalPayment,
  RoiExplanation,
  PlnSettings,
  BatterySettings,
  AppInfo
}

export enum Locale {
  Indonesian = 'id',
  English = 'en'
}

function getIndonesian(doc: Documentation): string {
  switch (doc) {
    case Documentation.MonthlyBill: return MonthlyBillId.body
    case Documentation.NumberOfPanels: return NumberOfPanelsId.body
    case Documentation.AreaRequired: return AreaRequiredId.body
    case Documentation.MinimalPayment: return MinimalPaymentId.body
    case Documentation.Location: return LocationId.body
    case Documentation.RoiExplanation: return RoiExplanationId.body
    case Documentation.PlnSettings: return PlnSettingsId.body
    case Documentation.BatterySettings: return BatterySettingsId.body
    case Documentation.AppInfo: return AppInfoId.body
  }
}

function getEnglish(doc: Documentation): string {
  switch (doc) {
    case Documentation.MonthlyBill: return MonthlyBillEn.body
    case Documentation.NumberOfPanels: return NumberOfPanelsEn.body
    case Documentation.AreaRequired: return AreaRequiredEn.body
    case Documentation.MinimalPayment: return MinimalPaymentEn.body
    case Documentation.Location: return LocationEn.body
    case Documentation.RoiExplanation: return RoiExplanationEn.body
    case Documentation.PlnSettings: return PlnSettingsEn.body
    case Documentation.BatterySettings: return BatterySettingsEn.body
    case Documentation.AppInfo: return AppInfoEn.body
  }
}


export function documentation(locale: Locale, doc: Documentation): string {
  if (doc) {
    Analytics.event(Category.Documentation, Documentation[doc], locale)
  }
  switch (locale) {
    case Locale.Indonesian: return getIndonesian(doc)
    case Locale.English: return getEnglish(doc)
  }
}
