// @ts-nocheck

import React, { useEffect, ComponentType, useCallback } from 'react'
import { theme } from '../ds'
import { Flex, Select, FormControl, FormLabel, Textarea, Box, Checkbox } from '@chakra-ui/core'
import PanelGroup from 'react-panelgroup'
import { EditableProps } from '@react-mx/core'
import { useReactMXClient, MXClientConfig } from '@react-mx/client'

import MXThemeProvider from './ThemeProvider'

import Inspector from './Inspector'
import Stage from './Stage'
import MainHeader from './Header'

import '../ds/theme/ant.less'
import useSelectedComponent from '../hooks/preview/useSelectedComponent'
import Core from '../store/core'

import { FileLoader } from '../types'
import Selector from './Selector'
import useProps from '../hooks/common/useProps'
import usePanels, { initialLeftPanelSize, initialRightPanelSize } from '../hooks/preview/usePanels'

// need to alter values from store
import PreviewStore from '../store/preview'

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
  const { props } = useProps()
  const {
    leftPanelSize,
    rightPanelSize,
    setLeftPanelSize,
    setRightPanelSize,
    setLeftPanelTempSize,
    setRightPanelTempSize,
    leftPanelVisible,
    rightPanelVisible,
    setIsResizing
  } = usePanels()

  const updatePanelSizes = useCallback(
    (data, leftSetter, rightSetter) => {
      if (leftPanelVisible) leftSetter(data[0].size)
      if (rightPanelVisible) rightSetter(data[2].size)
    },
    [leftPanelVisible, rightPanelVisible]
  )

  useEffect(() => {
    Core.setLoader(componentLoader)
  }, [componentLoader])
  useEffect(() => {
    setConfig(config)
  }, [config])

  return (
    <MXThemeProvider theme={theme}>
      <PanelGroup
        direction="row"
        borderColor={theme.colors.lightBorder}
        panelWidths={[
          { size: leftPanelVisible ? leftPanelSize : 0, minSize: leftPanelVisible ? 200 : 0, resize: 'dynamic' },
          { minSize: 300, resize: 'stretch' },
          { size: rightPanelVisible ? rightPanelSize : 0, minSize: rightPanelVisible ? 200 : 0, resize: 'dynamic' }
        ]}
        onUpdate={data => {
          updatePanelSizes(data, setLeftPanelTempSize, setRightPanelTempSize)
        }}
        onResizeStart={() => {
          setIsResizing(true)
        }}
        onResizeEnd={data => {
          updatePanelSizes(data, setLeftPanelSize, setRightPanelSize)
          setIsResizing(false)
        }}
      >
        <Selector />
        <Stage showHeader={showHeader}>
          {Component ? (
            <React.Suspense fallback="">
              <Component {...(props || {})} />
            </React.Suspense>
          ) : null}
        </Stage>
        <Inspector />
      </PanelGroup>
    </MXThemeProvider>
  )
}

export default Preview
