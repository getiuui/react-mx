import path from 'path'
import fs from 'fs'
import reactTsDocgen from 'react-docgen-typescript'
import reactJsDocgen from 'react-docgen'

// @ts-ignore
export const parse = (filePath: string, tsconfigPath?: string, enableTypescript: boolean = true) => {
  const ext = path.extname(filePath)

  if (!fs.existsSync(filePath)) throw new Error(`React MX analiser: ${filePath} does not exist`)

  if ((enableTypescript && ext === '.ts') || ext === '.tsx') {
    const options = {
      savePropValueAsString: true
    }

    const data = reactTsDocgen.parse(filePath, options)

    return data
  }

  if (ext === '.js') {
    const jsContent = fs.readFileSync(filePath)
    var componentInfo = reactJsDocgen.parse(jsContent)
    return componentInfo
  }
}

export default parse
