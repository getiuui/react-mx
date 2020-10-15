import React from 'react'
import { Heading } from '@chakra-ui/core'
import apply from '../theme/apply'

const H3 = ({ children, fontSize, color, margin, fontWeight, ...props }) => (
  <Heading
    as="h3"
    fontSize={apply(fontSize, 'xxsmall')}
    color={apply(color, 'dark')}
    fontFamily="default"
    fontWeight={apply(fontWeight, 'medium')}
    margin={apply(margin, 'smallx2')}
    {...props}
  >
    {children}
  </Heading>
)

export default H3
