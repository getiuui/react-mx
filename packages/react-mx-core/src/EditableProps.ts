import { SelectType, SelectControlConfig } from './Control/Select'
import { InputType } from './Control/Input'
import { SwitchType } from './Control/Switch'
import { ListType, ListControlConfig } from './Control/List'
import { JSONEditorType } from './Control/JSONEditor'
import { CodeEditorType } from './Control/CodeEditor'

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
  | string
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

export type EditablePropControl = SelectType | InputType | SwitchType | ListType | JSONEditorType | CodeEditorType

export type EditableProp = {
  key?: string
  valueType: EditablePropType
  suggestions?: Array<EditablePropSuggestion>
  default?: EditablePropType | null | undefined
  control: EditablePropControl
  controlConfig?: ListControlConfig | SelectControlConfig
  controlProps?: any
  isRequired?: boolean
  label?: string
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
