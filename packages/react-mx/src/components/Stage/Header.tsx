import React, { FC } from 'react'
import { Stack, ToggleButton } from '../../ds'
import { Box } from '@chakra-ui/core'
import { Space } from 'antd'
import useCheckerboard from '../../hooks/preview/useCheckerboard'
import useOutline from '../../hooks/preview/useOutline'

const PreviewHeader: FC = () => {
  const { enabled: showCheckerboard, set: setCheckerboard } = useCheckerboard()
  const { enabled: showOutline, set: setOutine } = useOutline()

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
      <Box flex="1" />
      <Space align="center" size={10} style={{ marginTop: '-5px' }}>
        <ToggleButton
          icon="AppstoreOutlined"
          tooltip="Toggle checkerboard"
          checked={showCheckerboard}
          onChange={setCheckerboard}
        />
        <ToggleButton icon="BorderOuterOutlined" tooltip="Toggle outline" checked={showOutline} onChange={setOutine} />
      </Space>
    </Stack>
  )
}

export default PreviewHeader
