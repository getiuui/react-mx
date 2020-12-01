import { MutableRefObject, useEffect, useRef } from 'react'

const useInterval = (callback: () => void, delay: number): number | undefined => {
  const intervalId: MutableRefObject<number | undefined> = useRef(undefined)
  const savedCallback = useRef(callback)
  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    const tick = () => savedCallback.current()

    if (typeof delay === 'number') {
      intervalId.current = window.setInterval(tick, delay)

      return () => window.clearInterval(intervalId.current)
    }
    return undefined
  }, [delay])

  return intervalId.current
}

export default useInterval
