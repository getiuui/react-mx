import { ReactElement } from 'react'
import { SelectType } from '../../components/Control/Select/types'
import { InputType } from '../../components/Control/Input/types'

export type EditablePropType = string | number | boolean | Function | ReactElement

export type EditableProp = {
  key?: string
  type: SelectType | InputType
  valueType: EditablePropType
  default: boolean
  isVisibleByDefault: boolean
  label: string
  controlProp?: any
}

export type EditableProps = {
  [prop: string]: EditableProp
}
