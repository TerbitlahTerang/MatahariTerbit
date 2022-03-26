import ConnectionPowerMarkdownId from '../assets/documentation/id/inputform/ConnectionPower.md'
import ConnectionPowerMarkdownEn from '../assets/documentation/en/inputform/ConnectionPower.md'
import MonthlyBillEn from '../assets/documentation/en/inputform/MonthlyBill.md'
import MonthlyBillId from '../assets/documentation/id/inputform/MonthlyBill.md'
import NumberOfPanelsEn from '../assets/documentation/en/results/NumberOfPanels.md'
import NumberOfPanelsId from '../assets/documentation/id/results/NumberOfPanels.md'
import NumberOfPanelsConnectionSizeEn from '../assets/documentation/en/results/NumberOfPanelsConnectionSize.md'
import NumberOfPanelsConnectionSizeId from '../assets/documentation/id/results/NumberOfPanelsConnectionSize.md'
import NumberOfPanelsConsumptionEn from '../assets/documentation/en/results/NumberOfPanelsConsumption.md'
import NumberOfPanelsConsumptionId from '../assets/documentation/id/results/NumberOfPanelsConsumption.md'
import NumberOfPanelsMinimumPaymentEn from '../assets/documentation/en/results/NumberOfPanelsMinimumPayment.md'
import NumberOfPanelsMinimumPaymentId from '../assets/documentation/id/results/NumberOfPanelsMinimumPayment.md'
import AreaRequiredEn from '../assets/documentation/en/results/AreaRequired.md'
import AreaRequiredId from '../assets/documentation/id/results/AreaRequired.md'
import MinimalPaymentEn from '../assets/documentation/en/results/MinimalPayment.md'
import MinimalPaymentId from '../assets/documentation/id/results/MinimalPayment.md'
import LocationEn from '../assets/documentation/en/inputform/Location.md'
import LocationId from '../assets/documentation/id/inputform/Location.md'
import RoiExplanationEn from '../assets/documentation/en/results/RoiExplanation.md'
import RoiExplanationId from '../assets/documentation/id/results/RoiExplanation.md'
import PriorityEn from '../assets/documentation/en/inputform/Priority.md'
import PriorityId from '../assets/documentation/id/inputform/Priority.md'
import PlnSettingsEn from '../assets/documentation/en/expert/PLNSettings.md'
import PlnSettingsId from '../assets/documentation/id/expert/PLNSettings.md'
import { LimitingFactor } from './CalculationService'

export enum Documentation {
  ConnectionPower,
  MonthlyBill,
  Location,
  NumberOfPanels,
  NumberOfPanelsConnectionSize,
  NumberOfPanelsConsumption,
  NumberOfPanelsMinimumPayment,
  AreaRequired,
  MinimalPayment,
  RoiExplanation,
  Priority,
  PlnSettings
}

export enum Locale {
  Indonesian = 'id',
  English = 'en'
}

function getIndonesian(doc: Documentation): string {
  switch (doc) {
    case Documentation.ConnectionPower: return ConnectionPowerMarkdownId.body
    case Documentation.MonthlyBill: return MonthlyBillId.body
    case Documentation.NumberOfPanels: return NumberOfPanelsId.body
    case Documentation.AreaRequired: return AreaRequiredId.body
    case Documentation.MinimalPayment: return MinimalPaymentId.body
    case Documentation.NumberOfPanelsConnectionSize: return NumberOfPanelsConnectionSizeId.body
    case Documentation.NumberOfPanelsConsumption: return NumberOfPanelsConsumptionId.body
    case Documentation.NumberOfPanelsMinimumPayment: return NumberOfPanelsMinimumPaymentId.body
    case Documentation.Location: return LocationId.body
    case Documentation.RoiExplanation: return RoiExplanationId.body
    case Documentation.Priority: return PriorityId.body
    case Documentation.PlnSettings: return PlnSettingsId.body
  }
}

function getEnglish(doc: Documentation): string {
  switch (doc) {
    case Documentation.ConnectionPower: return ConnectionPowerMarkdownEn.body
    case Documentation.MonthlyBill: return MonthlyBillEn.body
    case Documentation.NumberOfPanels: return NumberOfPanelsEn.body
    case Documentation.AreaRequired: return AreaRequiredEn.body
    case Documentation.MinimalPayment: return MinimalPaymentEn.body
    case Documentation.NumberOfPanelsConnectionSize: return NumberOfPanelsConnectionSizeEn.body
    case Documentation.NumberOfPanelsConsumption: return NumberOfPanelsConsumptionEn.body
    case Documentation.NumberOfPanelsMinimumPayment: return NumberOfPanelsMinimumPaymentEn.body
    case Documentation.Location: return LocationEn.body
    case Documentation.RoiExplanation: return RoiExplanationEn.body
    case Documentation.Priority: return PriorityEn.body
    case Documentation.PlnSettings: return PlnSettingsEn.body
  }
}


export function documentation(locale: Locale, doc: Documentation): string {
  switch (locale) {
    case Locale.Indonesian: return getIndonesian(doc)
    case Locale.English: return getEnglish(doc)
  }
}

export function toExplanation(limitingFactor: LimitingFactor): Documentation {
  switch (limitingFactor) {
    case LimitingFactor.ConnectionSize: return Documentation.NumberOfPanelsConnectionSize
    case LimitingFactor.Consumption: return Documentation.NumberOfPanelsConsumption
    case LimitingFactor.MinimumPayment: return Documentation.NumberOfPanelsMinimumPayment
  }
}
