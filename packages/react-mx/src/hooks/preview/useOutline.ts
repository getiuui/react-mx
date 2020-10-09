import Preview from '../../store/preview'
import useSubscription from '../common/useSubscription'

export const useOutline = (): {
  enabled: boolean | undefined
  show: () => void
  hide: () => void
  toggle: () => void
  set: (enabled: boolean) => void
} => {
  const enabled = useSubscription(Preview.showOutline)

  const show = () => {
    Preview.showOutline.next(true)
  }

  const hide = () => {
    Preview.showOutline.next(false)
  }

  const toggle = () => {
    Preview.showOutline.next(!enabled)
  }

  const set = enabled => {
    Preview.showOutline.next(enabled)
  }

  return { enabled, show, hide, toggle, set }
}

export default useOutline
