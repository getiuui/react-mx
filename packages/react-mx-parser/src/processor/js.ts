import reactJsDocgen from 'react-docgen'
import babelParser from '@babel/parser'
import { readFileSync } from 'fs'
import { DefintionData } from '../types'
import convertDocgenPropsToEditableProps from '../utils/docgenToEditableProps'

export const processJavascriptFile = (file: string, cwd: string): DefintionData => {
  const jsContent = readFileSync(`${cwd}/${file}`, { encoding: 'utf-8' })

  const ast = babelParser.parse(jsContent, { plugins: ['jsx', 'flow'], sourceType: 'unambiguous' })
  const result = reactJsDocgen.parse(jsContent, reactJsDocgen.resolver.findAllExportedComponentDefinitions) as any

  const defintionData: DefintionData = {
    ast,
    components: {}
  }

  if (result && Array.isArray(result) && result.length > 0) {
    result.map(({ displayName, props }) => {
      if (displayName) {
        defintionData.components[displayName] = {
          displayName,
          editableProps: convertDocgenPropsToEditableProps(props) as any
        }
      }
    })
  }

  return defintionData
}

export default processJavascriptFile
