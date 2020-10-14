import React, { FC } from 'react'
import { Stack, ToggleButton } from '../../ds'
import { Space } from 'antd'
import useCheckerboard from '../../hooks/preview/useCheckerboard'
import useOutline from '../../hooks/preview/useOutline'
import usePanels from '../../hooks/preview/usePanels'
import useCodePreview from '../../hooks/preview/useCodePreview'

const PreviewHeader: FC = () => {
  const { enabled: showCheckerboard, set: setCheckerboard } = useCheckerboard()
  const { enabled: showOutline, set: setOutine } = useOutline()
  const { leftPanelVisible, rightPanelVisible, toggleLeftPanel, toggleRightPanel } = usePanels()
  const { visible: codeVisible, toggle: toggleCode } = useCodePreview()

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      width="full"
      height="10"
      borderBottom={'1px'}
      borderBottomColor="#e5e5e5"
      backgroundColor="white"
      padding="small"
    >
      <Space align="center" size={10}>
        <ToggleButton
          icon="RiLayoutLeft2Line"
          tooltip="Toggle Component List"
          checked={leftPanelVisible}
          onChange={toggleLeftPanel}
        />
      </Space>
      <Stack flex="1" direction="row" alignItems="center" justifyContent="center">
        <Space align="center" size={10}>
          <ToggleButton
            icon="AiOutlineAppstore"
            tooltip="Toggle checkerboard"
            checked={showCheckerboard}
            onChange={setCheckerboard}
          />
          <ToggleButton
            icon="AiOutlineBorderOuter"
            tooltip="Toggle outline"
            checked={showOutline}
            onChange={setOutine}
          />
          <ToggleButton icon="RiLayoutBottom2Line" tooltip="Toggle Code" checked={codeVisible} onChange={toggleCode} />
        </Space>
      </Stack>
      <Space align="center" size={10}>
        <ToggleButton
          icon="RiLayoutRight2Line"
          tooltip="Toggle Inspector"
          checked={rightPanelVisible}
          onChange={toggleRightPanel}
        />
      </Space>
    </Stack>
  )
}

export default PreviewHeader
