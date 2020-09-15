import { Control } from '../types'
import { InputProps } from '@chakra-ui/core'

export type InputType = 'input'

export type InputControlProps = InputProps

export type InputControl = Control<InputType> & {
  type: InputType
  controlProps?: InputControlProps
}
