import { Component } from '@react-mx/core'
import useComponents from './useComponents'

export const useComponentsByKey = (): {
  componentsByKey: { [key: string]: Component }
  error: any
  loading: boolean
} => {
  const { components, error, loading } = useComponents()

  const componentsByKey = {}

  if (components && components.length > 0) {
    components.map(component => {
      componentsByKey[component.key] = component
    })
  }

  return { componentsByKey, error, loading }
}

export default useComponentsByKey
