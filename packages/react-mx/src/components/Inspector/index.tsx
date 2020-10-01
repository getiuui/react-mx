import React, { FC } from 'react'
import { Form } from 'antd'
import { Flex } from '../../ds'
import { EditableProps } from '@react-mx/core'
import Control from '../Control'

interface InspectorProps {
  editableProps?: EditableProps | undefined | null
  props?: { [name: string]: any } | undefined | null
  onUpdateProp?: (prop: string, value: string | number | object | boolean | null | undefined) => void
}

// @ts-ignore
const Inspector: FC<InspectorProps> = ({ editableProps, props, onUpdateProp = () => {} }) => {
  return (
    <Flex direction="column" height="full" vertical width="full" padding="small" backgroundColor="lightBackgroundGray">
      <Form layout="horizontal">
        {editableProps
          ? Object.keys(editableProps).map(editablePropKey => {
              const { key, ...editableProp } = editableProps[editablePropKey]
              const propKey = key || editablePropKey
              return (
                <Control
                  propKey={propKey}
                  {...editableProp}
                  value={props ? props[propKey] : null}
                  onChange={(value: any) => {
                    onUpdateProp(key || editablePropKey, value)
                  }}
                />
              )
            })
          : null}
      </Form>
    </Flex>
  )
}

export default Inspector
