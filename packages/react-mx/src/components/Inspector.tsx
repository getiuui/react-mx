import React, { FC } from 'react'
import { Form } from 'antd'
import { Flex } from '../ds'
import Control from './Control'
import useSelectedComponent from '../hooks/preview/useSelectedComponent'

// @ts-ignore
const Inspector: FC = () => {
  const { component } = useSelectedComponent()
  const { editableProps } = component || {}

  return (
    <Flex horizontal height="full" vertical width="full" padding="small" backgroundColor="lightBackgroundGray">
      <Form layout="horizontal">
        {editableProps
          ? Object.keys(editableProps).map(editablePropKey => {
              const { key } = editableProps[editablePropKey]
              const propKey = key || editablePropKey
              return <Control key={propKey} propKey={propKey} />
            })
          : null}
      </Form>
    </Flex>
  )
}

export default Inspector
