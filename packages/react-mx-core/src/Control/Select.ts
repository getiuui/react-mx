import { EditablePropType } from '../'
import { Control } from './'

export type SelectOptionValueLabel = {
  [value: string]: string
  [value: number]: string
}

export type SelectOptionObject = {
  value: EditablePropType | null | undefined
  label: string
}

export type SelectOption = SelectOptionObject | SelectOptionValueLabel | string | number | null | undefined

export const SELECT = 'select'

export type SelectType = 'select'

export type SelectControlConfig = {
  options: Array<SelectOption>
}

export type SelectControl = Control<SelectType> & SelectControlConfig
