import React from 'react'
import { Stack } from '@chakra-ui/core'
import apply from '../../theme/apply'

import Horizontal from './Horizontal'
import Vertical from './Vertical'

import userAgent from '../../../lib/utils/userAgent'

export { default as Horizontal } from './Horizontal'
export { default as Vertical } from './Vertical'

export { default as HStack } from './Horizontal'
export { default as VStack } from './Vertical'

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

const StackCmp = ({ direction, vertical, horizontal, center, children, spacing, width, ...props }) => {
  const { isMobile } = userAgent
  // chakra stack does not support direction based on breakpoints; @TODO: investigate
  // additionally, to suport more 'readable' format of direction="horizontal" etc, need to map this to column & row
  // -- stack component from /core package does not support spacing
  // -- stack component form /layout does not apply width correctly
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
    <Stack
      direction={_direction}
      isReversed={isReversed}
      className="stack"
      align={
        (center && ((isMobile && center.mobile) || (!isMobile && center.desktop))) || !!center ? 'center' : 'start'
      }
      justify={
        (center && ((isMobile && center.mobile) || (!isMobile && center.desktop))) || !!center ? 'center' : 'start'
      }
      spacing={apply(spacing, { mobile: 'xs', desktop: 'xsx2' })}
      width={
        width ? (isMobile && width.mobile ? width.mobile : !isMobile && width.desktop ? width.desktop : width) : null
      }
      {...props}
    >
      {children}
    </Stack>
  )
}

StackCmp.Horizontal = Horizontal
StackCmp.Vertical = Vertical

export default StackCmp
