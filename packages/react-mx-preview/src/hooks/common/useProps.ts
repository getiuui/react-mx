import { useEffect } from 'react'
import useSelectedComponent from '../preview/useSelectedComponent'

import Core from '../../store/core'
import useSubscription from './useSubscription'
import useEditableProps from './useEditableProps'

const useProps = () => {
  const { component } = useSelectedComponent()
  const props = useSubscription(Core.props)
  const { editableProps } = useEditableProps()

  useEffect(() => {
    Core.resetProps()
  }, [component])

  const allPropKeys: Array<string> = Array.from(new Set([...Object.keys(editableProps), ...Object.keys(props)]))

  let visibleProps: Array<string> = []
  let availableProps: Array<string> = []

  let hasExplicitDeclarations = false

  allPropKeys.forEach(key => {
    if (editableProps[key] && editableProps[key].explicit) {
      hasExplicitDeclarations = true
    }

    if (props[key] || (editableProps[key] && editableProps[key].isRequired)) {
      visibleProps.push(key)
    } else {
      availableProps.push(key)
    }
  })

  if (!hasExplicitDeclarations) {
    visibleProps = allPropKeys
    availableProps = []
  }

  return { props, allPropKeys, visibleProps, availableProps, reset: Core.resetProps, setProp: Core.setProp }
}

export default useProps
