import React from 'react'
import Flex from './index'

const HFlex = ({ children, ...props }) => (
  <Flex horizontal {...props}>
    {children}
  </Flex>
)

export default HFlex
