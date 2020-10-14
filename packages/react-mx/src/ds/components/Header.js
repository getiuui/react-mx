import React from 'react'
import Stack from './Stack'

const Header = ({ dark = true, light = false, children, ...props }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="center"
    width="full"
    height="40px"
    backgroundColor={(dark === true || dark===undefined) && light === false ? "black" : "white"}
    paddingX="small"
    paddingY="xs"
    {...props}
  >
    {children}
  </Stack>
)

export default Header
