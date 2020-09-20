import React, { ReactElement } from 'react'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'

type MXThemeProviderProps = {
  children: ReactElement
  theme: any
}

const MXThemeProvider: React.FC<MXThemeProviderProps> = ({ theme, children }) => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    {children}
  </ThemeProvider>
)

export default MXThemeProvider
