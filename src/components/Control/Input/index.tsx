import React, { FC } from 'react'

import Input, { InputProps } from 'antd/lib/input'
import { InputControl, InputType } from './types'

type InoutControlProps = Omit<InputControl, 'key' | 'type'> &
  InputProps & {
    propKey?: string
    type?: InputType
    id?: string
    onChange?: (value: any) => void
  }

const InputControlComponent: FC<InoutControlProps> = ({
  id,
  propKey,
  value = null,
  onChange = () => {},
  controlProps = {},
  ...props
}) => (
  <Input
    key={`${propKey}-control`}
    id={id}
    value={value as any}
    onChange={e => {
      onChange(e.target.value as any)
    }}
    size="small"
    allowClear={true}
    {...(props as any)}
    {...controlProps}
  />
)

export default InputControlComponent
