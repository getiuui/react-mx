import { Component } from '@react-mx/core'
import { useEffect, useState } from 'react'
import Preview from '../../store/preview'
import useComponent from '../common/useComponent'
import useSubscription from '../common/useSubscription'

import Core from '../../store/core'

export const useSelectedComponent = (): {
  key: string | undefined
  Component: any
  component: Component | undefined
  loading: boolean
  setSelectedComponent(key: string)
} => {
  const key = useSubscription(Preview.selectedComponentKey)

  const setKey = (key: string) => {
    Preview.selectedComponentKey.next(key)
  }

  const setSelectedComponent = key => {
    setKey(key)
  }

  const { component, loading } = useComponent(key)
  const [Component, setComponent] = useState(undefined)

  useEffect(() => {
    const load = async () => {
      const loadComponent = Core.getLoader()
      const Component = component ? await loadComponent(component?.definitinFile) : undefined
      //@ts-ignore
      setComponent(Component)
    }

    load()
  }, [component])

  return { key, component, Component, loading, setSelectedComponent }
}

export default useSelectedComponent
