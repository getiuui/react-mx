import { EditableProp } from '@react-mx/core'
import useEditableProps from './useEditableProps'
import useProps from './useProps'

const useProp = (
  key: string
): {
  value: any
  prop: EditableProp | undefined
  isVisible: boolean
  isAvailable: boolean
  setValue: (value: any) => void
} => {
  const { props, setProp, visibleProps, availableProps } = useProps()
  const { editableProps } = useEditableProps()

  const prop: EditableProp | undefined = editableProps ? editableProps[key] : undefined
  const value = props ? props[key] : undefined

  const setValue = (value: any) => {
    setProp(key, value)
  }

  const isVisible: boolean = visibleProps.includes(key)
  const isAvailable: boolean = availableProps.includes(key)

  return { prop, value, isVisible, isAvailable, setValue }
}

export default useProp
