import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import * as icons from '@ant-design/icons'
import theme from '../theme'

const ToggleButton = ({ dark, icon, tooltip, checked, onChange, style }) => {
  const Icon = icons[icon]

  if (!Icon) return null

  const renderedIcon = (
    <Icon
      style={{
        color: checked ? theme.colors.primary : dark ? theme.colors.white : theme.colors.darkGray,
        padding: 5,
        borderRadius: theme.radii.sm,
        backgroundColor: dark ? theme.colors.darker : theme.colors.lightGray,
        ...(style || {})
      }}
      onClick={() => onChange(!checked)}
    />
  )

  if (tooltip) return <Tooltip title={tooltip}>{renderedIcon}</Tooltip>

  return renderedIcon
}

ToggleButton.propTypes = {
  icon: PropTypes.elementType,
  tooltip: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  style: PropTypes.object
}

export default ToggleButton
