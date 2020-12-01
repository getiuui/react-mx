import { extname, basename, dirname } from 'path'
import { statSync } from 'fs'
import { sync as pathExists } from 'path-exists'

import { Component, EditableProps } from '@react-mx/core'
import ora from 'ora'
import { MXParserConfig, LibraryFiles, DefintionData, EditablePropsData } from './types'
import processTypescriptFile from './processor/ts'
import processJavascriptFile from './processor/js'
import processEditablePropsFile from './processor/editableProps'
import { ComponentsLibrary } from '@react-mx/core'
import { findComponentExportInfo } from './processor/ast'

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

  // @ts-ignore
  public processDefinitionFile(file: string, tsconfigPath?: string): DefintionData {
    const ext = extname(file)

    if (!pathExists(file)) throw new Error(`React MX analiser: ${file} does not exist`)
    if (!statSync(file).isFile()) throw new Error(`Invalid file ${file}`)

    if (ext === '.ts' || ext === '.tsx') {
      return processTypescriptFile(file, this.config.cwd as string)
    }

    if (ext === '.js') {
      return processJavascriptFile(file, this.config.cwd as string)
    }
  }

  private resolveLocalLibraryFiles(file: string): LibraryFiles {
    let libraryName: string | null = null
    let definitionFile: string = ''
    let editablePropsFile: string | null = null

    const fileName = basename(file)
    const ext = extname(file)
    const folderName = dirname(file)

    if (fileName.toLowerCase().replace(ext, '') === 'editableprops') {
      // this is the editable props file, need to find it's component file
      libraryName = folderName.replace(`${this.config.cwd}/`, '')
      editablePropsFile = file

      // try to find the component definition
      const possibleJSDefinitionPath = file.replace(fileName, 'index.js')
      const possibleTSDefinitionPath = file.replace(fileName, 'index.ts')
      const possibleTSXDefinitionPath = file.replace(fileName, 'index.tsx')

      if (pathExists(possibleJSDefinitionPath)) {
        definitionFile = possibleJSDefinitionPath
      } else if (pathExists(possibleTSDefinitionPath)) {
        definitionFile = possibleJSDefinitionPath
      } else if (pathExists(possibleTSXDefinitionPath)) {
        definitionFile = possibleTSXDefinitionPath
      }
    } else if (fileName.toLowerCase().replace(ext, '') === 'index') {
      // this is the index file within a folder with the componet definition
      // the folder might contain editableProps.json or editableProps.js files
      libraryName = folderName.replace(`${this.config.cwd}/`, '')
      const possibleEditablePropsJSPath = file.replace(fileName, 'editableProps.jso')
      const possibleEditablePropsJSONPath = file.replace(fileName, 'editableProps.json')

      if (pathExists(possibleEditablePropsJSPath)) {
        editablePropsFile = possibleEditablePropsJSPath
      } else if (pathExists(possibleEditablePropsJSONPath)) {
        editablePropsFile = possibleEditablePropsJSONPath
      }

      definitionFile = file
    } else {
      // this is a plain js / ts file, so no editableProps will be present
      libraryName = `${folderName.replace(`${this.config.cwd}/`, '').replace(ext, '')}/${fileName.replace(ext, '')}`
      definitionFile = file
    }

    return {
      libraryName,
      definitionFile,
      editablePropsFile
    }
  }

  public async processFile(file: string): Promise<ComponentsLibrary | undefined> {
    const spinner = ora(`⚛️ ReactMX: ${file}`).start()

    try {
      const libraryFiles: LibraryFiles = await this.resolveLocalLibraryFiles(file)

      const library: ComponentsLibrary = {
        key: `${libraryFiles.libraryName}@*`,
        name: libraryFiles.libraryName,
        version: '*',
        source: 'local',
        components: [],
        exports: {}
      }

      const definitionData: DefintionData | null | undefined = libraryFiles.definitionFile
        ? await this.processDefinitionFile(libraryFiles.definitionFile)
        : null // @todo: add tscofig info

      const editablePropsData: EditablePropsData | null | undefined = libraryFiles.editablePropsFile
        ? await processEditablePropsFile(libraryFiles.editablePropsFile, this.config.cwd as string)
        : null

      if (definitionData) {
        const { components, ast } = definitionData
        const componentNames = Object.keys(components)

        componentNames.map(name => {
          const componentData = components[name]

          const editableProps: EditableProps = {}
          // apply the data extracted from source
          if (componentData && componentData.editableProps) {
            Object.keys(componentData.editableProps).map(propKey => {
              editableProps[propKey] = {
                ...componentData.editableProps[propKey],
                explicit: false
              }
            })
          }

          // apply the data extracted from editableProps file
          // if props already exists, override, and mark is explicit
          if (editablePropsData) {
            const componentProps = editablePropsData[name]
            if (componentProps) {
              Object.keys(componentProps).map(propKey => {
                // if the prop was already read form source, replace it's definition, but keep the sourceProps info
                // this is to allow later updating of props from ui; EX: user has changed the props but has to update their editable props info
                editableProps[propKey] = {
                  propDataFromSource: editableProps[propKey] || null,
                  ...componentProps[propKey],
                  explicit: true
                }
              })
            }
          }

          const exportInfo = findComponentExportInfo(ast, componentData.displayName)
          const { exportType, exportName } = exportInfo || {}

          const component: Component = {
            key: `${library.key} - ${componentData.displayName}`,
            libraryName: library.name,
            libraryVersion: library.version,
            name: componentData.displayName,
            definitionFile: libraryFiles.definitionFile.replace(`${this.config.cwd}/`, ''),
            editablePropsFile: libraryFiles.editablePropsFile?.replace(`${this.config.cwd}/`, ''),
            editableProps,
            exportName,
            exportType
          }

          // add info about exported components
          if (!library.components.includes(component)) {
            if (component.exportType === 'default') {
              library.exports['default'] = component.name
            } else if (component.exportType === 'named') {
              library.exports[component.exportName as string] = component.name
            }

            library.components.push(component)
          }
        })
      }

      spinner.succeed(`⚛️ ReactMX: ${file} analysed`)

      return library
    } catch (error) {
      spinner.fail(`⚛️ ReactMX: ${file} failed to process:`)
      console.error(error)
    }

    return undefined
  }
}
