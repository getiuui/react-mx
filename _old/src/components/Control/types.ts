import { SelectType } from './Select/types'
import { InputType } from './Input/types'

export type ControlBase = {
  key: string
  type: SelectType | InputType
  label?: string | null
  placeholder?: string
  value?: string | number | null | undefined
  defaultValue?: string | number | null | undefined
  default?: boolean
  required?: boolean
  validate?: string | Function
  validateParams?: Array<any> | any
  transform?: string | Function
  transformParams?: Array<any> | any
  controlProps?: object
}

export type Control<T> = ControlBase & {
  type: string | T
}
