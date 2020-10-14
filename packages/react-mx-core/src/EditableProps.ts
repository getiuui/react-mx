import { SelectType } from './Control/Select'
import { InputType } from './Control/Input'
import { SwitchType } from './Control/Switch'

export type EditablePropType = string | number | object | boolean | Function | any

export type EditableProp = {
  key?: string
  type: SelectType | InputType | SwitchType
  valueType: EditablePropType
  default?: EditablePropType
  isRequired?: boolean
  label?: string
  controlProps?: any
  validate?: string | Function
  validateParams?: Array<any> | any
  transform?: string | Function
  transformParams?: Array<any> | any
  propDataFromSource?: EditableProp | null | undefined
  explicit?: boolean
}

export type EditableProps = {
  [prop: string]: EditableProp
}
