import { EditableProps } from './EditableProps'

export type Component = {
  key: string
  name: string
  definitinFile: string
  editablePropsFile?: string | null | undefined
  editableProps: EditableProps
}
