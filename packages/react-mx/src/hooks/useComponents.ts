import useSWR from 'swr'
import fetcher from './fetcher'

export const useComponents = () => {
  const { data: components, error, isValidating: loading } = useSWR('components', fetcher)

  return { components, error, loading }
}

export default useComponents
