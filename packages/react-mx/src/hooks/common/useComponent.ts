import { Component } from '@react-mx/core'
import useComponentsByKey from './useComponentsByKey'

export const useComponent = (
  key: string | undefined
): {
  component: Component | undefined
  loading: boolean
} => {
  const { componentsByKey, loading } = useComponentsByKey()

  const component = key && componentsByKey[key] ? componentsByKey[key] : undefined

  return { component, loading }
}

export default useComponent
