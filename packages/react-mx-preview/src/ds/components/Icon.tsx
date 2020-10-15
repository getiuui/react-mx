import React, { FC } from 'react'
import * as icons from 'react-icons/all'
import { Box, BoxProps } from '@chakra-ui/core'

type IconProps = BoxProps & {
  name: string
}

const Icon: FC<IconProps> = ({ name = 'RiQuestionLine', ...props }) => {
  const Icon = icons[name]

  return <Box as={Icon} size="24px" {...props} />
}

export default Icon
