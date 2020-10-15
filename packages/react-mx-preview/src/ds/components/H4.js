import React from 'react'
import { Heading } from '@chakra-ui/core'
import apply from '../theme/apply'

const H4 = ({ children, fontSize, color, margin, fontWeight, ...props }) => (
  <Heading
    as="h4"
    fontSize={apply(fontSize, 'xxxsmall')}
    color={apply(color, 'dark')}
    fontFamily="default"
    fontWeight={apply(fontWeight, 'extrabold')}
    margin={apply(margin, 'smallx2')}
    {...props}
  >
    {children}
  </Heading>
)

export default H4
