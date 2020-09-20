import { Control } from '../types'
import { SelectProps } from '@chakra-ui/core'

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

export type SelectControlProps = SelectProps

export type SelectControl = Control<SelectType> & {
  type: SelectType
  options: Array<SelectOption>
  controlProps?: SelectControlProps
}
