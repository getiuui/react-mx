import React from 'react'
import { Heading } from '@chakra-ui/core'
import apply from '../theme/apply'

const H1 = ({ children, fontSize, color, margin, fontWeight, ...props }) => (
  <Heading
    as="h1"
    fontSize={apply(fontSize, 'small')}
    color={apply(color, 'black')}
    fontFamily="default"
    fontWeight={apply(fontWeight, 'normal')}
    margin={apply(margin, 'none')}
    {...props}
  >
    {children}
  </Heading>
)

export default H1
