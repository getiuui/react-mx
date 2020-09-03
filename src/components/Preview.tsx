import React, { ReactElement, useState } from 'react'
import { Container } from '../ds'
import { EditableProps } from '..'

export type PreviewProps = {
  components?: {
    [componentName: string]: ReactElement
  }
  editableProps?: {
    [componentName: string]: EditableProps
  }
  component?: string
}

// @ts-ignore
const Preview: React.FC<PreviewProps> = ({ components, editableProps, component }) => {
  const [currentComponentType, setCurrentComponentType] = useState<string | null | undefined>(component)

  console.log(currentComponentType, setCurrentComponentType)

  return (
    <Container horizontal alignItems="center" justifyContent="center" height="100vh" maxWidth="full" paddingX="none">
      preview
    </Container>
  )
}

export default Preview
