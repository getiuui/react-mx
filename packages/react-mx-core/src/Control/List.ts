// import { EditableProp } from '../EditableProps'
import { EditableProp } from '../EditableProps'
import { Control } from './'

export const LIST = 'list'

export type ListType = 'list'

export type ListControlConfig = {
  itemConfig: EditableProp
}

export type ListControl = Control<ListType> & ListControlConfig
