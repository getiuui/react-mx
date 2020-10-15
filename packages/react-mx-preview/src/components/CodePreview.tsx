import { Box, Text, IconButton } from '@chakra-ui/core'
import React from 'react'

import SyntaxHighlighter from 'react-syntax-highlighter'
import theme from 'react-syntax-highlighter/dist/cjs/styles/hljs/github-gist'
import { Header } from '../ds'
import useCodePreview from '../hooks/preview/useCodePreview'
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import theme from 'react-syntax-highlighter/dist/esm/styles/prism/vs'

const CodePreview = () => {
  const { code, visible, hide } = useCodePreview()

  if (!code || !visible) return null
  return (
    <Box width="full" backgroundColor="white">
      <Header
        light={true}
        borderTop="1px"
        borderTopColor="lighterBorder"
        borderBottom="1px"
        borderBottomColor="lighterBorder"
        height="25px"
        backgroundColor="white"
      >
        <Text as="span" color="mediumText">
          Code Preview
        </Text>
        <Box flex="1" />
        <IconButton
          size="xs"
          aria-label="Close"
          icon="close"
          variant="ghost"
          minWidth="0.5rem"
          height="0.5rem"
          fontSize="0.5rem"
          onClick={hide}
        />
      </Header>
      <Box width="full" padding="small" backgroundColor="lightBackgroundGray">
        <SyntaxHighlighter
          language="jsx"
          width="100%"
          style={{
            ...theme,
            hljs: {
              ...theme.hljs,
              width: '100%',
              margin: 'none',
              marginBottom: '0px',
              borderRadius: '8px',
              backgroundColor: '#ececec'
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
    </Box>
  )
}

export default CodePreview
