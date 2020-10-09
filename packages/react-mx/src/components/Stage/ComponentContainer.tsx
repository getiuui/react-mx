import React, { ReactElement, FC } from 'react'
import useOutline from '../../hooks/preview/useOutline'

type ComponentContainerProps = {
  children: ReactElement | null | undefined
}

const ComponentContainer: FC<ComponentContainerProps> = ({ children = null }) => {
  const { enabled: showOutline } = useOutline()
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex' }}>
      <div
        style={{
          outline: showOutline ? '1px solid #ff0000' : 'none',
          display: 'inline-block',
          margin: '0 auto'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ComponentContainer
