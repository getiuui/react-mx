import { createElement, useMemo, useState } from 'react'
import isEqual from 'lodash/isEqual'
import useInterval from '../../hooks/utils/useInterval'

export const useStyleJsx = () => {
  const [rawRtyleSheets, setRawStyles] = useState<Array<string>>([])

  const styleElements = useMemo(() => {
    return rawRtyleSheets.map((rawStyle: any, i) => {
      return createElement('style', {
        id: `__${i}`,
        // Avoid warnings upon render with a key
        key: `__${i}`,
        nonce: undefined,
        dangerouslySetInnerHTML: {
          __html: rawStyle
        }
      })
    })
  }, [rawRtyleSheets])

  const refresh = () => {
    const styleNodes = document.querySelectorAll('[data-styled-jsx]')

    if (styleNodes.length > 0) {
      const newRawStyles = Array.from(styleNodes).map((styleNode: any) => styleNode.innerHTML)

      if (!isEqual(rawRtyleSheets, newRawStyles)) {
        setRawStyles(newRawStyles)
      }
    }
  }

  useInterval(refresh, 1000)

  return { styleElements, rawRtyleSheets, refresh }
}
