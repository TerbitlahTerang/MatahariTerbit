import * as ReactGA from 'react-ga'

export enum Category {
  Documentation = 'Documentation',
  NativeEvent = 'NativeEvent',
  Wizard = 'Wizard',
  Navigation = 'Navigation'
}


export const event = (category: Category, action: string, label?: string) => {
  ReactGA.event({ category: 'documentation', action: action, label: label })
}

export const valueEvent = (category: Category, action: string, label?: string, value?: number) => {
  ReactGA.event({ category: 'documentation', action: action, label: label, value: value })
}


