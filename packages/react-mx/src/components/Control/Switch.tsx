import React, { FC } from 'react'

import Switch, { SwitchProps } from 'antd/lib/switch'
import { SwitchControl, SwitchType } from '@react-mx/core'

export type SwitchControlProps = Omit<SwitchControl, 'key' | 'type' | 'controlProps'> &
  Omit<SwitchProps, 'defaultValue'> & {
    propKey?: string
    type?: SwitchType
    id?: string
    onChange?: (value: boolean) => void
    controlProps?: SwitchProps
  }

const SwitchControlComponent: FC<SwitchControlProps> = ({
  id,
  propKey,
  value = null,
  onChange = () => {},
  controlProps = {},
  ...props
}) => (
  <Switch
    key={`${propKey}-control`}
    id={id}
    checked={value}
    onChange={value => {
      onChange(value)
    }}
    size="small"
    {...(props as any)}
    {...controlProps}
  />
)

export default SwitchControlComponent
