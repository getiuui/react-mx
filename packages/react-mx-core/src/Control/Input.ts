import { Control } from './'

export type InputType = 'input'

export type InputControl = Control<InputType> & {
  type: InputType
}
