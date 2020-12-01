import { SelectType } from './Control/Select'
import { InputType } from './Control/Input'
import { SwitchType } from './Control/Switch'

export type EditablePropType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function'
  | 'array'
  | Array<EditablePropType>

export type EditablePropSuggestionValue = {
  suggestionType: 'value'
  value: string | number | bigint | boolean | undefined
  type: EditablePropType
}

export type EditablePropSuggestionType = {
  suggestionType: 'type'
  type: EditablePropType
}

export type EditablePropSuggestion = EditablePropSuggestionValue | EditablePropSuggestionType

export type EditableProp = {
  key?: string
  type: SelectType | InputType | SwitchType
  valueType: EditablePropType
  suggestios?: Array<EditablePropSuggestion>
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
