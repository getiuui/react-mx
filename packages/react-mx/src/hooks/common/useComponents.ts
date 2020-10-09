import { Component } from '@react-mx/core'
import useSWR from 'swr'
import fetcher from './fetcher'

export const useComponents = (): {
  components: Array<Component>
  error: any
  loading: boolean
} => {
  const { data: components, error, isValidating: loading } = useSWR('components', fetcher)

  return { components, error, loading }
}

export default useComponents
