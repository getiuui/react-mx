import React from 'react'
import { Flex } from '@chakra-ui/core'
import apply from '../theme/apply'

const Container = ({ direction, vertical, horizontal, center, padding, margin, children, ...props }) => {
  const _direction = direction
    ? direction
    : horizontal || vertical
    ? horizontal
      ? 'row'
      : vertical
      ? 'column'
      : 'column'
    : 'column'

  return (
    <Flex
      className="container"
      direction={_direction}
      alignItems="center"
      justifyContent={center ? 'center' : 'flex-start'}
      maxWidth="containers.maxWidth"
      bg="white"
      padding={apply(padding, false)}
      paddingX={{ mobile: 'smallx2', desktop: 'medium' }}
      margin={apply(margin, false)}
      {...props}
    >
      {children}
    </Flex>
  )
}

export default Container
