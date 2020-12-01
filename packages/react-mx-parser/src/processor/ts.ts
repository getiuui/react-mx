import reactTsDocgen from 'react-docgen-typescript'
import babelParser from '@babel/parser'
import { readFileSync } from 'fs'
import { DefintionData } from '../types'
import convertDocgenPropsToEditableProps from '../utils/docgenToEditableProps'

export const processTypescriptFile = (file: string, cwd: string): DefintionData => {
  const options = {
    savePropValueAsString: false,
    shouldExtractLiteralValuesFromEnum: true,
    shouldExtractValuesFromUnion: true
  }

  const jsContent = readFileSync(`${cwd}/${file}`, { encoding: 'utf-8' })

  const ast = babelParser.parse(jsContent, { plugins: ['jsx', 'typescript'], sourceType: 'unambiguous' })
  const result = reactTsDocgen.parse(`${cwd}/${file}`, options) as any

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

export default processTypescriptFile
