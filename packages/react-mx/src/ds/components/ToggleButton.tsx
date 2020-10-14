import React, { FC } from 'react'
import { Tooltip } from 'antd'
import Icon from './Icon'

type ToggleButtonProps = {
  dark?: boolean
  icon: string
  checked: boolean
  tooltip?: string
  onChange?: (checked: boolean) => void
}

const ToggleButton: FC<ToggleButtonProps> = ({
  dark = false,
  icon = 'RiQuestionLine',
  tooltip,
  checked = false,
  onChange = _checked => null
}) => {
  if (!Icon) return null

  const renderedIcon = (
    <Icon
      name={icon}
      color={checked ? 'primary' : dark ? 'white' : 'darkGray'}
      padding="5px"
      borderRadius="sm"
      backgroundColor={dark ? 'darker' : 'lightGray'}
      onClick={() => onChange(!checked)}
    />
  )

  if (tooltip)
    return (
      <Tooltip aria-label={tooltip} title={tooltip} mouseEnterDelay={0.5}>
        {renderedIcon}
      </Tooltip>
    )

  return renderedIcon
}

export default ToggleButton
