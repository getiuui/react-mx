import React from 'react'
import Stack from './index'

const HStack = ({ children, center, ...props }) => (
  <Stack horizontal center={center} {...props}>
    {children}
  </Stack>
)

export default HStack
