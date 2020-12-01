import React, { ReactElement, FC, useRef } from 'react'
import useOutline from '../../hooks/preview/useOutline'

type ComponentContainerProps = {
  children: ReactElement | null | undefined
}

const FindReactData = function (dom) {
  let key = Object.keys(dom).find(key => key.startsWith('__reactInternalInstance$'))
  console.log('key', key)
  // @ts-ignore
  let internalInstance = dom[key]
  // @ts-ignore

  return dom[key]
}

const ComponentContainer: FC<ComponentContainerProps> = ({ children = null }) => {
  const { enabled: showOutline } = useOutline()
  const ref = useRef(null)

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log('e', FindReactData(e.nativeEvent.target))
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex' }} onClick={onClick} ref={ref}>
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
