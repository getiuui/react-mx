import { EditablePropControl } from '../EditableProps'

export type ControlBase = {
  key: string
  type: EditablePropControl
  label?: string | null
  value?: string | number | null | undefined
  default?: object | boolean | string | number | null | undefined
  validate?: string | Function
  validateParams?: Array<any> | any
  transform?: string | Function
  transformParams?: Array<any> | any
  controlProps?: any
}

export type Control<T> = ControlBase & {
  type: T | string
}
