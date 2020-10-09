import React, { useState, useEffect, ComponentType } from 'react'
import { theme, Header } from '../../ds'
// @ts-ignore
import { Flex, Select, FormControl, FormLabel, Textarea, Box, Checkbox } from '@chakra-ui/core'
import PanelGroup from 'react-panelgroup'
import { EditableProps } from '@react-mx/core'
import { useReactMXClient, MXClientConfig } from '@react-mx/client'

import MXThemeProvider from '../ThemeProvider'

import Inspector from '../Inspector'
import Stage from '../Stage'

import '../../ds/theme/ant.less'
import useSelectedComponent from '../../hooks/preview/useSelectedComponent'
import Core, { FileLoader } from '../../store/core'

import Selector from '../Selector'

export interface PreviewProps {
  componentLoader: FileLoader
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
  componentLoader,
  showHeader = true,
  config = { host: 'http://localhost', port: 5555 }
}) => {
  const { setConfig } = useReactMXClient()
  const { Component } = useSelectedComponent()

  const [props, setProps] = useState<object>({})

  useEffect(() => {
    Core.setLoader(componentLoader)
  }, [componentLoader])
  useEffect(() => {
    setConfig(config)
  }, [config])

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

  return (
    <MXThemeProvider theme={theme}>
      <>
        <Header>test</Header>
        <PanelGroup
          direction="row"
          borderColor={theme.colors.lightBorder}
          panelWidths={[
            { size: 250, minSize: 200, resize: 'dynamic' },
            { minSize: 300, resize: 'stretch' },
            { size: 300, minSize: 200, resize: 'dynamic' }
          ]}
        >
          <Selector />
          <Stage showHeader={showHeader}>
            {Component ? (
              <React.Suspense fallback="">
                <Component />
              </React.Suspense>
            ) : null}
          </Stage>
          <Inspector editableProps={{}} props={props} onUpdateProp={changeProp} />
        </PanelGroup>
      </>
    </MXThemeProvider>
  )
}

export default Preview
