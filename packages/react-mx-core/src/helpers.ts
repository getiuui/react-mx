import { SelectControl } from './Control/Select'
import { InputControl } from './Control/Input'
import { SwitchControl } from './Control/Switch'

export const Select = (def: Omit<SelectControl, 'type'>): SelectControl => ({ ...def, type: 'select' })
export const Input = (def: Omit<InputControl, 'type'>): InputControl => ({ ...def, type: 'input' })
export const Switch = (def: Omit<SwitchControl, 'type'>): SwitchControl => ({ ...def, type: 'switch' })
