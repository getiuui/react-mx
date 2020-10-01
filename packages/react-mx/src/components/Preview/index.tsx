import React, { useState, useEffect, ComponentType } from 'react'
import { theme } from '../../ds'
// @ts-ignore
import { Flex, Select, FormControl, FormLabel, Textarea, Box, Checkbox } from '@chakra-ui/core'
import PanelGroup from 'react-panelgroup'
import { EditableProps } from '@react-mx/core'
import { useReactMXClient, MXClientConfig } from '@react-mx/client'

import PreviewHeader from './Header'
import MXThemeProvider from '../ThemeProvider'

import ComponentContainer from './ComponentContainer'
import Inspector from '../Inspector'
import Stage from '../Stage'

import '../../ds/theme/ant.less'
import useComponents from '../../hooks/useComponents'

export interface PreviewProps {
  components?: {
    [componentName: string]: ComponentType<any> & { editableProps: EditableProps }
  }
  editableProps?: {
    [componentName: string]: EditableProps
  }
  config?: MXClientConfig
  component?: string | null | undefined
  showHeader?: boolean
}

const Preview: React.FC<PreviewProps> = ({
  components,
  editableProps,
  component,
  showHeader = true,
  config = { host: 'http://localhost', port: 5555 }
}) => {
  const { setConfig } = useReactMXClient()
  const { components: data, loading, error } = useComponents()
  console.log('components data', { data, loading, error })

  const [currentComponentType, setCurrentComponentType] = useState<string | null | undefined>(component || null)

  const [showOutline, setShowOutline] = useState<boolean>(false)
  const [showCheckerboard, setShowCheckerboard] = useState<boolean>(false)
  const [props, setProps] = useState<object>({})

  useEffect(() => {
    setConfig(config)
  }, [config])

  const changeType = type => {
    setCurrentComponentType(type)
    setProps({})
  }

  const changeProp = (prop, value) => {
    console.log(`changeProp ${prop}`, value)
    const newProps = {
      ...props
    }

    if (value !== '' && value !== undefined) {
      newProps[prop] = value
    } else if (newProps[prop] !== undefined) {
      delete newProps[prop]
    }

    setProps(newProps)
  }

  useEffect(() => {
    setCurrentComponentType(component || null)
    if (component) {
      changeType(component)
    }
  }, [component])

  const CurrentComponent: any =
    currentComponentType && components && components[currentComponentType] ? components[currentComponentType] : null

  // @ts-ignore
  // console.log('aaaa', typeof ComponentProps<CurrentComponent>)

  const currentEditableProps =
    currentComponentType && editableProps && editableProps[currentComponentType]
      ? editableProps[currentComponentType]
      : currentComponentType && components && components[currentComponentType]
      ? components[currentComponentType].editableProps
      : null
  return (
    <MXThemeProvider theme={theme}>
      <Box height="100vh" maxWidth="full" paddingX="none">
        <PanelGroup
          direction="row"
          borderColor={theme.colors.lightBorder}
          panelWidths={[
            { minSize: 300, resize: 'stretch' },
            { size: 300, minSize: 200, resize: 'dynamic' }
          ]}
        >
          <Stage showCheckerboard={showCheckerboard}>
            {showHeader ? (
              <PreviewHeader
                components={Object.keys(components || {})}
                currentComponent={currentComponentType}
                showOutline={showOutline}
                showCheckerboard={showCheckerboard}
                setShowCheckerboard={setShowCheckerboard}
                setShowOutline={setShowOutline}
                onChangeComponentType={changeType}
              />
            ) : null}
            {CurrentComponent ? (
              <ComponentContainer showOutline={showOutline}>
                <CurrentComponent {...props} />
              </ComponentContainer>
            ) : null}
          </Stage>
          <Inspector editableProps={currentEditableProps} props={props} onUpdateProp={changeProp} />
        </PanelGroup>
      </Box>
    </MXThemeProvider>
  )
}

export default Preview
