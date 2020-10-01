import { getInstance } from '@react-mx/client'

export const fetcher = (key, params?) => getInstance().request(key, params)

export default fetcher
