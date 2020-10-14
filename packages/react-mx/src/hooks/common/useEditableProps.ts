import { EditableProps } from '@react-mx/core'
import useSelectedComponent from '../preview/useSelectedComponent'

const useEditableProps = (): { editableProps: EditableProps } => {
  const { component } = useSelectedComponent()

  const editableProps: EditableProps = component ? component.editableProps : {}

  return { editableProps }
}

export default useEditableProps
