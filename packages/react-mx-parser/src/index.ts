import vm from 'vm'
import { extname, basename, dirname } from 'path'
import { readFileSync, statSync } from 'fs'
import { sync as pathExists } from 'path-exists'
import reactTsDocgen from 'react-docgen-typescript'
import reactJsDocgen from 'react-docgen'
import { EditableProp, EditableProps, EditablePropType, Component } from '@react-mx/core'
import ora from 'ora'

const typeToControlMap = {
  string: 'input',
  number: 'input',
  boolean: 'switch',
  object: 'object',
  array: 'select'
}

type MXParserConfig = {
  cwd: string | undefined | null
}

type ComponentFiles = {
  displayAlias: string | null | undefined // displayName with container info; ex: for /components/Card/index.js => container/Card
  componentName: string | null | undefined // at this stage we can only guess the component namer
  definitionFile: string | null | undefined
  editablePropsFile?: string | null | undefined
}

const defaultConfig: MXParserConfig = {
  cwd: ''
}

export default class Parser {
  constructor(cfg?: MXParserConfig) {
    this.setConfig(cfg || defaultConfig)
  }

  private config: MXParserConfig = defaultConfig

  public setConfig(config: MXParserConfig) {
    this.config = {
      ...defaultConfig,
      ...(config || {})
    }
  }

  private convertDocgenPropsToEditableProps(props: object): EditableProps {
    const propKeys = Object.keys(props)
    if (!propKeys || propKeys.length === 0) return {}

    const editableProps: EditableProps = {}

    propKeys.forEach(propKey => {
      const rawProp = props[propKey]

      let defaultValue: any = null
      if (
        rawProp.defaultValue !== undefined &&
        rawProp.defaultValue.value !== undefined &&
        typeof rawProp.defaultValue.value === 'string'
      ) {
        try {
          defaultValue = vm.runInNewContext(rawProp.defaultValue.value)
        } catch (error) {
          console.error(`default transoform error key: ${propKey}`, error)
        }
      }

      let valueType: EditablePropType = defaultValue !== undefined ? typeof defaultValue : typeof ''

      if (valueType === 'function') {
        defaultValue = rawProp.defaultValue.value
      }
      // extract type info if present from ts type

      const prop: EditableProp = {
        type: typeToControlMap[valueType] || 'input',
        valueType,
        key: propKey,
        ...(defaultValue
          ? {
              default: defaultValue
            }
          : {})
      }

      editableProps[propKey] = prop
    })
    return editableProps
  }

  private processEditablePropsFile(file: string) {
    // hanlde change of editable props file of a component
    try {
      const content = readFileSync(`${this.config.cwd}/${file}`, 'utf-8')
      const editableProps = JSON.parse(content)

      return {
        editableProps
      }
    } catch (error) {
      console.error(`Failed processiong ${file}`, error)
      return undefined
    }
    //try to determine the name of the component
    //check is there's a missmatchbetween props (new props in file or deleted)
  }

  private processJavascriptFile(file: string): any {
    const jsContent = readFileSync(`${this.config.cwd}/${file}`)
    const { displayName, props } = reactJsDocgen.parse(jsContent) as any

    const editableProps = this.convertDocgenPropsToEditableProps(props)
    return { displayName, editableProps }
  }

  private processTypescriptFile(file: string): any {
    const options = {
      savePropValueAsString: true
    }

    const { displayName, props } = reactTsDocgen.parse(`${this.config.cwd}/${file}`, options) as any
    const editableProps = this.convertDocgenPropsToEditableProps(props)
    return { displayName, editableProps }
  }

  // @ts-ignore
  public processDefinitionFile(file: string, tsconfigPath?: string) {
    const ext = extname(file)

    if (!pathExists(file)) throw new Error(`React MX analiser: ${file} does not exist`)
    if (!statSync(file).isFile()) throw new Error(`Invalid file ${file}`)

    if (ext === '.ts' || ext === '.tsx') {
      return this.processTypescriptFile(file)
    }

    if (ext === '.js') {
      return this.processJavascriptFile(file)
    }
  }

  private resolveComponentFiles(file: string): ComponentFiles {
    const componentFiles: ComponentFiles = {
      displayAlias: null,
      componentName: null,
      definitionFile: null,
      editablePropsFile: null
    }

    const fileName = basename(file)
    const ext = extname(file)
    const folderName = dirname(file)

    if (fileName.toLowerCase().replace(ext, '') === 'editableprops') {
      // this is the editable props file, need to find it's component file
      componentFiles.displayAlias = folderName.replace(`${this.config.cwd}/`, '')
      componentFiles.componentName = basename(folderName)
      componentFiles.editablePropsFile = file

      // try to find the component definition
      const possibleJSDefinitionPath = file.replace(fileName, 'index.js')
      const possibleTSDefinitionPath = file.replace(fileName, 'index.ts')
      const possibleTSXDefinitionPath = file.replace(fileName, 'index.tsx')

      if (pathExists(possibleJSDefinitionPath)) {
        componentFiles.definitionFile = possibleJSDefinitionPath
      } else if (pathExists(possibleTSDefinitionPath)) {
        componentFiles.definitionFile = possibleJSDefinitionPath
      } else if (pathExists(possibleTSXDefinitionPath)) {
        componentFiles.definitionFile = possibleTSXDefinitionPath
      }
    } else if (fileName.toLowerCase().replace(ext, '') === 'index') {
      // this is the index file within a folder with the componet definition
      // the folder might contain editableProps.json or editableProps.js files
      componentFiles.displayAlias = folderName.replace(`${this.config.cwd}/`, '')
      const possibleEditablePropsJSPath = file.replace(fileName, 'editableProps.jso')
      const possibleEditablePropsJSONPath = file.replace(fileName, 'editableProps.json')

      if (pathExists(possibleEditablePropsJSPath)) {
        componentFiles.editablePropsFile = possibleEditablePropsJSPath
      } else if (pathExists(possibleEditablePropsJSONPath)) {
        componentFiles.editablePropsFile = possibleEditablePropsJSONPath
      }

      componentFiles.componentName = basename(folderName)
      componentFiles.definitionFile = file
    } else {
      // this is a plain js / ts file, so no editableProps will be present
      componentFiles.displayAlias = `${folderName
        .replace(`${this.config.cwd}/`, '')
        .replace(ext, '')}/${fileName.replace(ext, '')}`
      componentFiles.componentName = fileName.replace(ext, '')
      componentFiles.definitionFile = file
    }

    return componentFiles
  }

  public async processFile(file: string): Promise<Component | undefined> {
    const spinner = ora(`⚛️ ReactMX: ${file}`).start()
    try {
      const componentFiles: ComponentFiles = await this.resolveComponentFiles(file)

      const definitionData = componentFiles.definitionFile
        ? await this.processDefinitionFile(componentFiles.definitionFile)
        : null // @todo: add tscofig info
      const editablePropsData = componentFiles.editablePropsFile
        ? await this.processEditablePropsFile(componentFiles.editablePropsFile)
        : null
      const component: Component = {
        key: componentFiles.displayAlias as string,
        name: definitionData ? definitionData.displayName : componentFiles.displayAlias,
        definitinFile: componentFiles.definitionFile
          ? componentFiles.definitionFile?.replace(`${this.config.cwd}/`, '')
          : '',
        editablePropsFile: componentFiles.editablePropsFile?.replace(`${this.config.cwd}/`, ''),
        editableProps: {}
      }

      // apply the data extracted from source
      if (definitionData && definitionData.editableProps) {
        Object.keys(definitionData.editableProps).map(propKey => {
          component.editableProps[propKey] = {
            ...definitionData.editableProps[propKey],
            explicit: false
          }
        })
      }

      // apply the data extracted from editableProps file
      // if props already exists, override, and mark is explicit
      if (editablePropsData && editablePropsData.editableProps) {
        Object.keys(editablePropsData.editableProps).map(propKey => {
          // if the prop was already read form source, replace it's definition, but keep the sourceProps info
          // this is to allow later updating of props from ui; EX: user has changed the props but has to update their editable props info
          component.editableProps[propKey] = {
            propDataFromSource: component.editableProps[propKey] || null,
            ...editablePropsData.editableProps[propKey],
            explicit: true
          }
        })
      }
      spinner.succeed(`⚛️ ReactMX: ${file} analysed`)
      return component
    } catch (error) {
      spinner.fail(`⚛️ ReactMX: ${file} failed to process:`)
      console.error(error)
    }

    return undefined
  }
}
