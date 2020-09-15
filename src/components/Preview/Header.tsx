import React from 'react'
import { Stack, ToggleButton } from '../../ds'
import { Box } from '@chakra-ui/core'
import { Space } from 'antd'
import Select from '../Control/Select'

type PreviewHeaderProps = {
  components: Array<string>
  currentComponent: string | null | undefined
  showCheckerboard: boolean
  showOutline: boolean
  setShowCheckerboard: (checked: boolean) => void
  setShowOutline: (checked: boolean) => void
  onChangeComponentType: (componentType?: string) => void
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  components = [],
  currentComponent = null,
  showCheckerboard = true,
  showOutline = true,
  setShowCheckerboard = () => {},
  setShowOutline = () => {},
  onChangeComponentType = () => {}
}) => {
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
      <Select
        options={components}
        value={currentComponent as any}
        size="small"
        onChange={onChangeComponentType as any}
        style={{ width: 200 }}
        dropdownMatchSelectWidth={false}
        showSearch={true}
      />
      <Box flex="1" />
      <Space align="center" size={10}>
        <ToggleButton
          icon="AppstoreOutlined"
          tooltip="Toggle checkerboard"
          checked={showCheckerboard}
          onChange={setShowCheckerboard}
        />
        <ToggleButton
          icon="BorderOuterOutlined"
          tooltip="Toggle outline"
          checked={showOutline}
          onChange={setShowOutline}
        />
      </Space>
    </Stack>
  )
}

export default PreviewHeader
