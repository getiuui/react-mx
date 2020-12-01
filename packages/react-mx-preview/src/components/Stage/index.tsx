import React, { FC, useEffect, useRef } from 'react'
import { Flex } from '@chakra-ui/core'
import Frame from 'react-frame-component'
import PreviewHeader from './Header'
import ComponentContainer from './ComponentContainer'
// @ts-ignore
import checkerBoardImage from './checkerboard.png'
import useCheckerboard from '../../hooks/preview/useCheckerboard'
import CodePreview from '../CodePreview'
import usePanels from '../../hooks/preview/usePanels'
import { useStyleJsx } from '../StyleHandler/StyleJsx'

interface StageProps {
  showHeader?: boolean
  children?: any
}

const Stage: FC<StageProps> = ({ showHeader = true, children }) => {
  const { enabled: showCheckerboard } = useCheckerboard()
  const { isResizing } = usePanels()
  const { styleElements: jsxStyles, refresh: refreshJsx } = useStyleJsx()
  const iframe = useRef(null)

  useEffect(() => {
    refreshStyles
  }, [children])

  const refreshStyles = () => {
    refreshJsx()
  }

  return (
    <Flex
      direction="column"
      height="full"
      flex={1}
      padding="none"
      backgroundColor="backgroundGray"
      backgroundImage={showCheckerboard ? `url(${checkerBoardImage})` : 'none'}
    >
      {showHeader ? <PreviewHeader /> : null}
      <Frame
        style={{ width: '100%', height: '100%', pointerEvents: isResizing ? 'none' : 'auto' }}
        head={jsxStyles}
        contentDidMount={() => {
          refreshStyles()
        }}
        contentDidUpdate={() => {
          refreshStyles()
        }}
        ref={iframe}
      >
        <ComponentContainer>{children}</ComponentContainer>
      </Frame>
      <CodePreview />
    </Flex>
  )
}

export default Stage
