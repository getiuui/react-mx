import React from 'react'
import Stack from './Stack'

const Header = ({ children, ...props }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="center"
    width="full"
    height="40px"
    backgroundColor="black"
    paddingX="small"
    paddingY="xs"
    {...props}
  >
    {children}
  </Stack>
)

export default Header
