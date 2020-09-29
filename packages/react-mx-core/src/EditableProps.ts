import { SelectType } from './Control/Select'
import { InputType } from './Control/Input'

export type EditablePropType = string | number | object | boolean | Function | any

export type EditableProp = {
  key?: string
  type: SelectType | InputType
  valueType: EditablePropType
  default?: boolean
  isVisibleByDefault?: boolean
  label?: string
  controlProp?: any
  propDataFromSource?: EditableProp | null | undefined
  explicit?: boolean
}

export type EditableProps = {
  [prop: string]: EditableProp
}
