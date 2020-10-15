import { useEffect } from 'react'
import useProps from '../common/useProps'
import useSelectedComponent from './useSelectedComponent'
import Preview from '../../store/preview'
import useSubscription from '../common/useSubscription'
import generate from '../../lib/code/generate'

const useCodePreview = (): {
  visible: boolean
  code: string
  show: () => void
  hide: () => void
  toggle: () => void
  setCode: (code: string) => void
} => {
  const visible = useSubscription(Preview.showCodePreview)
  const { component } = useSelectedComponent()
  const { props } = useProps()

  useEffect(() => {
    if (component && props) {
      const code = generate(component, props)
      setCode(code)
    }
  }, [component, props])

  const code = useSubscription(Preview.codeContent)

  const show = () => {
    Preview.showCodePreview.next(true)
  }

  const hide = () => {
    Preview.showCodePreview.next(false)
  }

  const toggle = () => {
    Preview.showCodePreview.next(!visible)
  }

  const setCode = code => {
    Preview.codeContent.next(code)
  }

  return { visible, code, show, hide, toggle, setCode }
}

export default useCodePreview
