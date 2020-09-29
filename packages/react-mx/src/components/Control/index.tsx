import React, { FC, Ref, forwardRef } from 'react'
import { Control, InputControl, SelectControl } from '@react-mx/core'
import FormItem, { FormItemProps } from 'antd/lib/form/FormItem'
// import { FormControl, FormLabel, FormControlProps } from '@chakra-ui/core'
import { toPascalCase, toTextCase } from 'js-convert-case'
import { InputControlProps } from './Input'
import { SelectControlProps } from './Select'
import Input from './Input'
// import { Select } from './Select'

type ControlProps = Omit<InputControl | SelectControl, 'key' | 'onChange'> & {
  ref: Ref<FC<ControlProps>>
  propKey?: string
  value?: any
  containerProps?: FormItemProps | object | null | undefined
  controlProps?: InputControlProps | SelectControlProps
  onChange: (value: any) => void
}

const Control = forwardRef<FC<ControlProps>, ControlProps>((props: ControlProps, ref: Ref<FC<ControlProps>>) => (
  <ControlBase ref={ref} {...props} />
))

const ControlBase: FC<ControlProps> = ({
  ref,
  propKey,
  type,
  label,
  placeholder,
  value,
  defaultValue,
  containerProps,
  controlProps,
  transform,
  transformParams,
  validate,
  validateParams,
  onChange,
  ...props
}) => {
  const onValueChange = (value: any) => {
    // apply transformers and validators

    onChange(value !== defaultValue ? value : undefined)
  }

  const _label: any = label || toPascalCase(propKey)
  const _placeholder = placeholder || toTextCase(defaultValue?.toString() || propKey)

  return (
    <FormItem
      key={`${propKey}-container`}
      label={_label}
      labelAlign="right"
      labelCol={{ span: 6, style: { maxWidth: 100, minWidth: 80 } }}
      wrapperCol={{ span: 18, style: { flex: 1, maxWidth: '100%' } }}
      colon={false}
      {...containerProps}
      style={{
        marginBottom: 0
      }}
    >
      {type === 'input' ? (
        <Input
          propKey={propKey}
          placeholder={_placeholder}
          controlProps={controlProps}
          {...props}
          value={value}
          onChange={onValueChange as any}
        />
      ) : null}
      {/* {type === 'textarea' ? <TextAreaControl id={key} value={value} onChange={onChange} /> : null}
      {type === 'select' ? <SelectControl id={key} value={value} values={values} onChange={onChange} /> : null} */}
    </FormItem>
  )
}

export default Control
