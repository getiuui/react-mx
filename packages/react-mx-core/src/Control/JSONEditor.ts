import { Control } from './'

export const JSON_EDITOR = 'json-editor'

export type JSONEditorType = 'json-editor'

export type JSONEditorControl = Control<JSONEditorType> & {
  // itemTypes?: Array<EditableProp>   @TODO: determine how to store the types of a list
}
