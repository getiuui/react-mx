import React from 'react'
import { Heading } from '@chakra-ui/core'
import apply from '../theme/apply'

const H6 = ({ children, fontSize, color, margin, fontWeight, ...props }) => (
  <Heading
    as="h6"
    fontSize={apply(fontSize, 'xsmall')}
    color={apply(color, 'teal')}
    fontFamily="default"
    fontWeight={apply(fontWeight, 'medium')}
    margin={apply(margin, false)}
    {...props}
  >
    {children}
  </Heading>
)

export default H6
