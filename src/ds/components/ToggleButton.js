import React from 'react'
import { Tooltip } from 'antd'
import * as icons from '@ant-design/icons'
import theme from '../theme'

const ToggleButton = ({ icon, tooltip, checked, onChange, style }) => {
  const Icon = icons[icon]

  if (!Icon) return null

  const renderedIcon = (
    <Icon
      style={{
        color: checked ? theme.colors.primary : theme.colors.darkGray,
        padding: 5,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.lightGray,
        ...(style || {})
      }}
      onClick={() => onChange(!checked)}
    />
  )

  if (tooltip) return <Tooltip title={tooltip}>{renderedIcon}</Tooltip>

  return renderedIcon
}

export default ToggleButton
