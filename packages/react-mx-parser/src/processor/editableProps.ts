import { readFileSync } from 'fs'
import { EditablePropsData } from '../types'

const processEditablePropsFile = (file: string, cwd: string): EditablePropsData | undefined => {
  // hanlde change of editable props file of a component
  try {
    const content = readFileSync(`${cwd}/${file}`, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Failed processiong ${file}`, error)
    return undefined
  }
  //try to determine the name of the component
  //check is there's a missmatchbetween props (new props in file or deleted)
}

export default processEditablePropsFile
