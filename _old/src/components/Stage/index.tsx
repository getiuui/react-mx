import React, { FC, ReactElement } from 'react'
import { Flex } from '@chakra-ui/core'

// @ts-ignore
import checkerBoardImage from './checkerboard.png'

interface StageProps {
  showCheckerboard?: boolean
  children?: (ReactElement | null)[]
}

const Stage: FC<StageProps> = ({ showCheckerboard = true, children }) => (
  <Flex
    direction="column"
    height="full"
    flex={1}
    padding="none"
    backgroundColor="backgroundGray"
    backgroundImage={showCheckerboard ? `url(${checkerBoardImage})` : 'none'}
  >
    {children}
  </Flex>
)

export default Stage
