import { EditableProps } from '@react-mx/core'

export type MXParserConfig = {
  cwd: string | undefined | null
}

export type LibraryFiles = {
  libraryName: string
  definitionFile: string
  editablePropsFile?: string | null | undefined
}

export type EditablePropsData = {
  [name: string]: EditableProps
}

export type DefintionData = {
  ast: any
  components: {
    [name: string]: {
      displayName: string
      editableProps: EditableProps
    }
  }
}
