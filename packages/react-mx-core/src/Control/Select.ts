import { Control } from './'

export type SelectOptionValueLabel = {
  [value: string]: string
  [value: number]: string
}

export type SelectOptionObject = {
  value: object | string | number | boolean | null | undefined
  label: string
}

export type SelectOption = SelectOptionObject | SelectOptionValueLabel | string | number | null | undefined

export type SelectType = 'select'

export type SelectControl = Control<SelectType> & {
  options: Array<SelectOption>
}
