import useSubscription from '../../hooks/common/useSubscription'
import Preview from '../../store/preview'

export const initialLeftPanelSize = 250
export const initialRightPanelSize = 300

const usePanels = (): {
  leftPanelSize: number
  leftPanelTempSize: number
  leftPanelVisible: boolean
  rightPanelSize: number
  rightPanelTempSize: number
  rightPanelVisible: boolean
  isResizing: boolean
  setLeftPanelSize: (size: number) => void
  setLeftPanelTempSize: (size: number) => void
  showLeftPanel: () => void
  hideLeftPanel: () => void
  toggleLeftPanel: () => void
  setRightPanelSize: (size: number) => void
  setRightPanelTempSize: (size: number) => void
  showRightPanel: () => void
  hideRightPanel: () => void
  toggleRightPanel: () => void
  setIsResizing: (resizing: boolean) => void
} => {
  const leftPanelSize = useSubscription(Preview.leftPanelSize)
  const leftPanelTempSize = useSubscription(Preview.leftPanelSize)
  const leftPanelVisible = useSubscription(Preview.leftPanelVisible)

  const rightPanelSize = useSubscription(Preview.rightPanelSize)
  const rightPanelTempSize = useSubscription(Preview.rightPanelSize)
  const rightPanelVisible = useSubscription(Preview.rightPanelVisible)

  const isResizing = useSubscription(Preview.isResizing)

  const setLeftPanelSize = (size: number) => {
    Preview.leftPanelSize.next(size)
  }
  const setLeftPanelTempSize = (size: number) => {
    Preview.leftPanelTempSize.next(size)
  }
  const showLeftPanel = () => {
    Preview.leftPanelVisible.next(true)
  }
  const hideLeftPanel = () => {
    Preview.leftPanelVisible.next(false)
  }
  const toggleLeftPanel = () => {
    Preview.leftPanelVisible.next(!leftPanelVisible)
  }

  const setRightPanelSize = (size: number) => {
    Preview.rightPanelSize.next(size)
  }
  const setRightPanelTempSize = (size: number) => {
    Preview.rightPanelTempSize.next(size)
  }
  const showRightPanel = () => {
    Preview.rightPanelVisible.next(true)
  }
  const hideRightPanel = () => {
    Preview.rightPanelVisible.next(false)
  }
  const toggleRightPanel = () => {
    Preview.rightPanelVisible.next(!rightPanelVisible)
  }

  const setIsResizing = (resizing: boolean) => {
    Preview.isResizing.next(resizing)
  }

  return {
    leftPanelSize,
    leftPanelTempSize,
    leftPanelVisible,
    rightPanelSize,
    rightPanelTempSize,
    rightPanelVisible,
    isResizing,
    setLeftPanelSize,
    setLeftPanelTempSize,
    showLeftPanel,
    hideLeftPanel,
    toggleLeftPanel,
    setRightPanelSize,
    setRightPanelTempSize,
    showRightPanel,
    hideRightPanel,
    toggleRightPanel,
    setIsResizing
  }
}

export default usePanels
