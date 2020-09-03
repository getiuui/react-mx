import { ReactElement } from 'react'

export type EditablePropType = string | number | boolean | Function | ReactElement

export type EditablePropControl = {
  default: boolean
  label: string
  type: any
  options?: any
}

export type EditableProp = {
  key: string
  type: EditablePropType
  control: EditablePropControl
}

export type EditableProps = {
  [prop: string]: EditableProp
}
