import React, { FC } from 'react'
import { Flex } from '@chakra-ui/core'
import Frame from 'react-frame-component'
import PreviewHeader from './Header'
import ComponentContainer from './ComponentContainer'
// @ts-ignore
import checkerBoardImage from './checkerboard.png'
import useCheckerboard from '../../hooks/preview/useCheckerboard'

interface StageProps {
  showHeader?: boolean
  children?: any
}

const Stage: FC<StageProps> = ({ showHeader = true, children }) => {
  const { enabled: showCheckerboard } = useCheckerboard()
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
      <Frame style={{ width: '100%', height: '100%' }}>
        <ComponentContainer>{children}</ComponentContainer>
      </Frame>
    </Flex>
  )
}

export default Stage
