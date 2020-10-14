import Preview from '../../store/preview'
import useSubscription from '../common/useSubscription'

export const useCheckerboard = (): {
  enabled: boolean
  show: () => void
  hide: () => void
  toggle: () => void
  set: (enabled: boolean) => void
} => {
  const enabled = useSubscription(Preview.showCheckerboard)

  const show = () => {
    Preview.showCheckerboard.next(true)
  }

  const hide = () => {
    Preview.showCheckerboard.next(false)
  }

  const toggle = () => {
    Preview.showCheckerboard.next(!enabled)
  }

  const set = enabled => {
    Preview.showCheckerboard.next(enabled)
  }

  return { enabled, show, hide, toggle, set }
}

export default useCheckerboard
