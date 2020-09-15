import { SelectControl } from '../../components/Control/Select/types'
import { InputControl } from '../../components/Control/Input/types'

export const Select = (def: Omit<SelectControl, 'type'>): SelectControl => ({ ...def, type: 'select' })
export const Input = (def: Omit<InputControl, 'type'>): InputControl => ({ ...def, type: 'input' })
