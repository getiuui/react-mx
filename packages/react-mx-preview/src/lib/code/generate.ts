import { Component } from '@react-mx/core'
import { Props, CodeLanguage } from '../../types'
import prettier from 'prettier/standalone'
import babylon from "prettier/parser-babel"
import parser from "prettier/parser-html"

const generateJavascript = (component: Component, props: Props): string => {
  const propNames = Object.keys(props)
  return pretty(`<${component.name}${propNames.length > 0 ? ' ' : ''}${propNames
    .map(propName => `${propName}={${JSON.stringify(props[propName])}}`)
    .join(' ')} />
  `).replace(';', '').replace(/[\r\n]+$/,'')
}

const pretty = (code: string): string => prettier.format(code, {
  parser: "babel",
  plugins: [babylon, parser],
  printWidth: 60,
  trailingComma: "none",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  arrowParens: "avoid"
})

export const generate = (
  component: Component,
  props: Props,
  language: CodeLanguage = 'javascript'
): string | undefined => {
  if (language === 'javascript') return generateJavascript(component, props)
  return undefined
}
export default generate
