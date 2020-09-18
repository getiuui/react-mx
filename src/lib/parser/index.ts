import path from 'path'
import fs from 'fs'
import tsDocgen from 'react-docgen-typescript'
import reactDocs from 'react-docgen'

// @ts-ignore
export const parse = (filePath: string, tsconfigPath?: string, enableTypescript: boolean = true) => {
  const ext = path.extname(filePath)

  if (!fs.existsSync(filePath)) throw new Error(`React MX analiser: ${filePath} does not exist`)

  if ((enableTypescript && ext === '.ts') || ext === '.tsx') {
    const options = {
      savePropValueAsString: true
    }

    const data = tsDocgen.parse(filePath, options)

    return data
  }

  if (ext === '.js') {
    const jsContent = fs.readFileSync(filePath)
    var componentInfo = reactDocs.parse(jsContent)
    return componentInfo
  }
}

export default parse
