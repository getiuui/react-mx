import React, { FC, Ref, forwardRef } from 'react'
import { Control, InputControl, SelectControl, SwitchControl } from '@react-mx/core'
import FormItem, { FormItemProps } from 'antd/lib/form/FormItem'
// import { FormControl, FormLabel, FormControlProps } from '@chakra-ui/core'
import { toPascalCase, toTextCase } from 'js-convert-case'
import Input from './Input'
import Switch from './Switch'
import useProp from '../../hooks/common/useProp'
import { mediumText } from '../../ds/theme'
// import { Select } from './Select'

type ControlProps = Omit<InputControl | SelectControl | SwitchControl, 'key' | 'type' | 'onChange'> & {
  ref: Ref<FC<ControlProps>>
  propKey: string
  containerProps?: FormItemProps | object | null | undefined
}

const Control = forwardRef<FC<ControlProps>, ControlProps>((props: ControlProps, ref: Ref<FC<ControlProps>>) => (
  <ControlBase ref={ref} {...props} />
))

const ControlBase: FC<ControlProps> = ({
  // ref,
  propKey,
  containerProps
  // ...props
}) => {
  const { value, prop, setValue } = useProp(propKey)

  const { default: defaultValue, label, type, controlProps /*, isRequired */ } = prop || {}
  const onValueChange = (value: any) => {
    setValue(value !== defaultValue ? value : undefined)
  }

  const _label: any = label || toPascalCase(propKey)
  const _placeholder =
    (controlProps ? controlProps.placeholder : undefined) || toTextCase(defaultValue?.toString() || propKey)

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
        marginBottom: 0,
        color: mediumText
      }}
    >
      {type === 'input' ? (
        <Input
          propKey={propKey}
          placeholder={_placeholder}
          controlProps={controlProps}
          value={value}
          onChange={onValueChange as any}
        />
      ) : null}
      {type === 'switch' ? (
        <Switch
          propKey={propKey}
          controlProps={controlProps}
          value={value !== undefined ? value : defaultValue}
          onChange={onValueChange as any}
        />
      ) : null}
      {/* {type === 'textarea' ? <TextAreaControl id={key} value={value} onChange={onChange} /> : null}
      {type === 'select' ? <SelectControl id={key} value={value} values={values} onChange={onChange} /> : null} */}
    </FormItem>
  )
}

export default Control
