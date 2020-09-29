import vm from 'vm'
import { extname, basename, dirname } from 'path'
import { readFileSync, statSync } from 'fs'
import { sync as pathExists } from 'path-exists'
import reactTsDocgen from 'react-docgen-typescript'
import reactJsDocgen from 'react-docgen'
import { EditableProp, EditableProps, EditablePropType } from '@react-mx/core'
import ora from 'ora'

const typeToControlMap = {
  string: 'input',
  number: 'input',
  boolean: 'switch',
  object: 'object',
  array: 'select'
}

type MXParserConfig = {
  cwd: string
}

type ComponentFiles = {
  displayAlias: string | null | undefined // displayName with container info; ex: for /components/Card/index.js => container/Card
  componentName: string | null | undefined // at this stage we can only guess the component namer
  definitionFile: string | null | undefined
  editablePropsFile?: string | null | undefined
}

type ComponentData = {
  name: string
  definitinFile: string
  editablePropsFile?: string | null | undefined
  editableProps: EditableProps
}

type ProcessResults = { [componentKey: string]: ComponentData } | null | undefined

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

  private convertDocgenPropsToEditableProps = (props: object): EditableProps => {
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

      let valueType: EditablePropType = defaultValue ? typeof defaultValue : typeof ''
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

  private processEditablePropsFile = (file: string) => {
    // hanlde change of editable props file of a component
    const content = require(file)
    //try to determine the name of the component
    //check is there's a missmatchbetween props (new props in file or deleted)
    return {
      editableProps: content
    }
  }

  private processJavascriptFile = (file: string): any => {
    const jsContent = readFileSync(file)
    const { displayName, props } = reactJsDocgen.parse(jsContent) as any

    const editableProps = this.convertDocgenPropsToEditableProps(props)
    return { displayName, editableProps }
  }

  private processTypescriptFile = (file: string): any => {
    const options = {
      savePropValueAsString: true
    }

    const { displayName, props } = reactTsDocgen.parse(file, options) as any
    const editableProps = this.convertDocgenPropsToEditableProps(props)
    return { displayName, editableProps }
  }

  // @ts-ignore
  public processDefinitionFile = (file: string, tsconfigPath?: string) => {
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

  private resolveComponentFiles = (file: string): ComponentFiles => {
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

  public processFiles = async (files: Array<string>): Promise<ProcessResults> => {
    // prepare files by grouping them by their componentDefinition
    // this is to avoid processing twice the component files when all files are re-processed
    // also when definition file changes, the editableProps has to be checked too, and vice-versa
    const results: ProcessResults = {}
    const filesByComponent: { [componentName: string]: ComponentFiles } = {}

    // console.log(`⚛️ ReactMX: ${files.length} files to process`)
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const componentFiles: ComponentFiles = await this.resolveComponentFiles(file)
        if (componentFiles.displayAlias) {
          if (!filesByComponent[componentFiles.displayAlias as string]) {
            filesByComponent[componentFiles.displayAlias as string] = componentFiles
          }
        }
      }

      const componentAliases = Object.keys(filesByComponent)

      const spinner = ora(`⚛️ ReactMX: ${files.length} files changed.`).start()

      if (componentAliases.length > 0) {
        for (let i = 0; i < componentAliases.length; i++) {
          const componentAlias = componentAliases[i]
          const component = filesByComponent[componentAlias]
          spinner.text = `⚛️ ReactMX ( ${i + 1} / ${componentAliases.length} ): ${component.componentName}`
          try {
            const definitionData = component.definitionFile
              ? await this.processDefinitionFile(component.definitionFile)
              : null // @todo: add tscofig info
            const editablePropsData = component.editablePropsFile
              ? await this.processEditablePropsFile(component.editablePropsFile)
              : null
            const componentData: ComponentData = {
              name: definitionData ? definitionData.displayName : component.displayAlias,
              definitinFile: component.definitionFile
                ? component.definitionFile?.replace(`${this.config.cwd}/`, '')
                : '',
              editablePropsFile: component.editablePropsFile?.replace(`${this.config.cwd}/`, ''),
              editableProps: {}
            }

            // apply the data extracted from source
            if (definitionData && definitionData.editableProps) {
              Object.keys(definitionData.editableProps).map(propKey => {
                componentData.editableProps[propKey] = {
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
                componentData.editableProps[propKey] = {
                  propDataFromSource: componentData.editableProps[propKey] || null,
                  ...editablePropsData.editableProps[propKey],
                  explicit: true
                }
              })
            }
            results[componentAlias] = componentData
          } catch (error) {
            spinner.fail(`⚛️ ReactMX: ${componentAlias} failed to process:`)
            console.error(error)
            return null
          }
        }
        spinner.succeed(
          `⚛️ ReactMX: ${componentAliases.length} components analysed: [ ${componentAliases.join(', ')} ]`
        )
      } else {
        spinner.succeed(`⚛️ ReactMX: no components found in changed files`)
      }

      return results
    } else {
      console.log(`⚛️ ReactMX: ✔ no files were modified`)
      return null
    }
  }
}
