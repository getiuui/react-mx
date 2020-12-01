import { EditableProps } from './EditableProps'

export type Component = {
  key: string
  name: string
  libraryName: string
  libraryVersion?: string
  definitionFile?: string
  editablePropsFile?: string | null | undefined
  exportType?: 'none' | 'named' | 'default'
  exportName?: string | null | undefined
  editableProps: EditableProps
  ast?: any
}
