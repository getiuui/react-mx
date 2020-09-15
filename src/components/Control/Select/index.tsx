import React, { FC } from 'react'

import { SelectControl, SelectType } from './types'
import Select, { SelectProps, SelectValue } from 'antd/lib/select'

type SelectControlProps = Omit<SelectControl, 'key' | 'type'> &
  Omit<SelectProps<SelectValue>, 'options'> & {
    propKey?: string
    type?: SelectType
    id?: string
    onChange?: (value: SelectValue) => void
  }

const SelectControlComponent: FC<SelectControlProps> = ({
  id,
  propKey,
  value = null,
  options = [],
  onChange = () => {},
  controlProps = {},
  ...props
}) => (
  <Select
    key={`${propKey}-control`}
    id={id}
    value={value as any}
    onChange={value => {
      onChange(value)
    }}
    {...(props as any)}
  >
    <Select.Option value={null as any}>-----</Select.Option>
    {options.map((option, index) => {
      // option = undefined | option = null
      if (option === undefined || option === null)
        return (
          <Select.Option key={index} value={null as any}>
            -----
          </Select.Option>
        )

      // option = 'text'
      if (typeof option === 'string')
        return (
          <Select.Option key={index} value={option as any}>
            {option}
          </Select.Option>
        )

      // option = 5 | option = true
      if (typeof option === 'number' || typeof option === 'boolean')
        return (
          <Select.Option key={index} value={option.toString()}>
            {option.toString()}
          </Select.Option>
        )
      if (typeof option === 'object') {
        const keys = Object.keys(option)

        // option = { label: 'label', value: 'value'}
        if (keys.includes('value') || keys.includes('label')) {
          return (
            <Select.Option key={index} value={option.value as any}>
              {option.label}
            </Select.Option>
          )
        }

        return keys.map(key => (
          <Select.Option key={key} value={key}>
            {option[key]}
          </Select.Option>
        ))
      }
      return null
    })}
  </Select>
)

export default SelectControlComponent
