import React from 'react'
import Flex from './index'

const VFlex = ({ children, ...props }) => (
  <Flex vertical {...props}>
    {children}
  </Flex>
)

export default VFlex
