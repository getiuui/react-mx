import { Control } from './'

export const CODE_EDITOR = 'code-editor'

export type CodeEditorType = 'code-editor'

export type CodeEditorControl = Control<CodeEditorType> & {
  // itemTypes?: Array<EditableProp>   @TODO: determine how to store the types of a list
}
