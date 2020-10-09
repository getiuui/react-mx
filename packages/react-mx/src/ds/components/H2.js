import React from 'react'
import { Heading } from '@chakra-ui/core'
import apply from '../theme/apply'

const H2 = ({ children, fontSize, color, margin, fontWeight, ...props }) => (
  <Heading
    as="h2"
    fontSize={apply(fontSize, 'xsmall')}
    color={apply(color, 'dark')}
    fontFamily="default"
    fontWeight={apply(fontWeight, 'semibold')}
    margin={apply(margin, 'smallx2')}
    {...props}
  >
    {children}
  </Heading>
)

export default H2
