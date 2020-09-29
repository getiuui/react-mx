import { SelectControl } from './Control/Select'
import { InputControl } from './Control/Input'

export const Select = (def: Omit<SelectControl, 'type'>): SelectControl => ({ ...def, type: 'select' })
export const Input = (def: Omit<InputControl, 'type'>): InputControl => ({ ...def, type: 'input' })
