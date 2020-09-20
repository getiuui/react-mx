import { Button, ButtonProps } from '@material-ui/core'
import React, { FC } from 'react'

type LocalProps = ButtonProps & {
  test: string
}

const TestCmp: FC<LocalProps> = ({ test, ...props }) => {
  return <Button {...props} />
}

export default TestCmp
