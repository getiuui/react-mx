import React, { useState, useEffect, ComponentType } from 'react'
import { theme } from '../../ds'
// @ts-ignore
import { Flex, Select, FormControl, FormLabel, Textarea, Box, Checkbox } from '@chakra-ui/core'
import PanelGroup from 'react-panelgroup'
import { EditableProps } from '../..'

import PreviewHeader from './Header'
import MXThemeProvider from '../ThemeProvider'

import ComponentContainer from './ComponentContainer'
import Inspector from '../Inspector'
import Stage from '../Stage'

import '../../ds/theme/ant.less'

export interface PreviewProps {
  components?: {
    [componentName: string]: ComponentType<any> & { editableProps: EditableProps }
  }
  editableProps?: {
    [componentName: string]: EditableProps
  }
  component?: string | null | undefined
  showHeader?: boolean
}

// @ts-ignore
const Preview: React.FC<PreviewProps> = ({ components, editableProps, component, showHeader = true }) => {
  const [currentComponentType, setCurrentComponentType] = useState<string | null | undefined>(component || null)

  const [showOutline, setShowOutline] = useState<boolean>(false)
  const [showCheckerboard, setShowCheckerboard] = useState<boolean>(false)
  const [props, setProps] = useState<object>({})

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
