import React from 'react'

import { Flex } from '@chakra-ui/core'
import apply from '../../theme/apply'

import Horizontal from './Horizontal'
import Vertical from './Vertical'

export { default as Horizontal } from './Horizontal'
export { default as Vertical } from './Vertical'

export { default as HFlex } from './Horizontal'
export { default as VFlex } from './Vertical'

const directions = {
  horizontal: 'row',
  'horizontal-reverse': 'row-reverse',
  'horizontal-reversed': 'row-reverse',
  row: 'row',
  'row-reverse': 'row-reverse',
  vertical: 'column',
  'vertical-reverse': 'column-reverse',
  'vertical-reversed': 'column-reverse',
  column: 'column',
  'column-reverse': 'column-reverse'
}

const FlexCmp = ({ direction, vertical, horizontal, children, ...props }) => {
  let _direction = apply(
    direction
      ? direction
      : horizontal || vertical
      ? horizontal
        ? directions.horizontal
        : directions.vertical
      : directions.vertical
  )

  if (Object.keys(directions).includes(_direction)) {
    _direction = directions[_direction]
  }

  let isReversed = directions[_direction].indexOf('-reverse') > 0

  return (
    <Flex direction={_direction} isReversed={isReversed} className="flex" {...props}>
      {children}
    </Flex>
  )
}

FlexCmp.Horizontal = Horizontal
FlexCmp.Vertical = Vertical

export default FlexCmp
