import React from 'react'
import Stack from './index'

const VStack = ({ center, children, ...props }) => (
  <Stack vertical center={center} {...props}>
    {children}
  </Stack>
)

export default VStack
