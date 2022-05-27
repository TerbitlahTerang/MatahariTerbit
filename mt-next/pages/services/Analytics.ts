import ReactGA from 'react-ga4'

export enum Category {
  Documentation = 'Documentation',
  NativeEvent = 'NativeEvent',
  Wizard = 'Wizard',
  Navigation = 'Navigation',
  Form = 'Form'
}


export const event = (category: Category, action: string, label?: string) => {
  valueEvent(category, action, label, undefined)
}

export const valueEvent = (category: Category, action: string, label?: string, value?: number) => {
  console.log('event', category, action, label, value)
  ReactGA.event({ category: category, action: action, label: label, value: value })
}


