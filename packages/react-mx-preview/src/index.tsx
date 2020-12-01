import * as React from 'react'
export { default as Preview } from './components/Preview'
export { default as ThemeProvider } from './components/ThemeProvider'
export { default as theme } from './ds/theme'
export { loader, lazyImport, ComponentLoader } from '@react-mx/core'

// @ts-ignore
export { Select, Input } from '@react-mx/core'

const ReactMX = () => {
  return <div>REACT MX CONTAINER</div>
}

export default ReactMX
