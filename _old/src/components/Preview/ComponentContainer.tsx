import React, { ReactElement, FC } from 'react'
import { Box } from '@chakra-ui/core'

type ComponentContainerProps = {
  showOutline: boolean
  children: ReactElement
}
const ComponentContainer: FC<ComponentContainerProps> = ({ showOutline = true, children = null }) => (
  <Box outline={showOutline ? '1px solid #ff0000' : 'none'} display="inline-block" margin="0 auto">
    {children}
  </Box>
)

export default ComponentContainer
