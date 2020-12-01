import React, { FC, useEffect, useRef, useState } from 'react'
import { Flex } from '@chakra-ui/core'
import Frame, { FrameContextConsumer } from 'react-frame-component'
import PreviewHeader from './Header'
import ComponentContainer from './ComponentContainer'
// @ts-ignore
import checkerBoardImage from './checkerboard.png'
import useCheckerboard from '../../hooks/preview/useCheckerboard'
import CodePreview from '../CodePreview'
import usePanels from '../../hooks/preview/usePanels'
import { useStyleJsx } from '../StyleHandler/StyleJsx'
import { initialize as initialiseFrontend } from 'react-devtools-inline/frontend'
import { activate as activateBackend, initialize as initialiseBackend } from 'react-devtools-inline/backend'

interface StageProps {
  showHeader?: boolean
  children?: any
}

const Stage: FC<StageProps> = ({ showHeader = true, children }) => {
  const { enabled: showCheckerboard } = useCheckerboard()
  const { isResizing } = usePanels()
  const { styleElements: jsxStyles, refresh: refreshJsx } = useStyleJsx()
  const iframe = useRef(null)
  const [DevTools, setDevTools] = useState<any>(null)

  useEffect(() => {
    refreshStyles
  }, [children])

  const refreshStyles = () => {
    refreshJsx()
  }

  const onIframeLoaded = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    const iframe = e.target as HTMLIFrameElement
    const { contentWindow } = iframe

    setDevTools(initialiseFrontend(contentWindow))

    // Let the backend know to initialize itself.
    // We can't do this directly because the iframe is sandboxed.
    // Only initialize the backend once the DevTools frontend has been initialized.
    if (contentWindow) {
      contentWindow.postMessage(
        {
          type: 'activate-backend'
        },
        '*'
      )
    }
  }

  return (
    <Flex
      direction="column"
      height="full"
      flex={1}
      padding="none"
      backgroundColor="backgroundGray"
      backgroundImage={showCheckerboard ? `url(${checkerBoardImage})` : 'none'}
    >
      {showHeader ? <PreviewHeader /> : null}
      <Frame
        style={{ width: '100%', height: '100%', pointerEvents: isResizing ? 'none' : 'auto' }}
        head={jsxStyles}
        contentDidMount={() => {
          refreshStyles()
        }}
        contentDidUpdate={() => {
          refreshStyles()
        }}
        onLoad={onIframeLoaded}
        ref={iframe}
      >
        <FrameContextConsumer>
          {
            // Callback is invoked with iframe's window and document instances
            // @ts-ignore
            ({ document, window }) => {
              // The DevTools hook needs to be installed before React is even required!
              // The safest way to do this is probably to install it in a separate script tag.
              initialiseBackend(window)

              // Wait for the frontend to let us know that it's ready.
              function onMessage({ data }) {
                switch (data.type) {
                  case 'activate-backend':
                    window.removeEventListener('message', onMessage)

                    activateBackend(window)
                    break
                  default:
                    break
                }
              }

              window.addEventListener('message', onMessage)
              return <ComponentContainer>{children}</ComponentContainer>
            }
          }
        </FrameContextConsumer>
      </Frame>
      {DevTools ? <DevTools /> : null}
      <CodePreview />
    </Flex>
  )
}

export default Stage
