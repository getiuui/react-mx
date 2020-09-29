import React, { FC } from 'react'

import Input, { InputProps } from 'antd/lib/input'
import { InputControl, InputType } from '@react-mx/core'

export type InputControlProps = Omit<InputControl, 'key' | 'type' | 'controlProps'> &
  Omit<InputProps, 'defaultValue'> & {
    propKey?: string
    type?: InputType
    id?: string
    onChange?: (value: any) => void
    controlProps?: InputProps
  }

const InputControlComponent: FC<InputControlProps> = ({
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
