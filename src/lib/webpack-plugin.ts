/**
 * @class WebpackReactMXPlugin
 * @extends Object
 * A Webpack plugin that analyses react compionent to determin editable props based on source files.
 */
import path from 'path'
// import process from 'process'
// import { exec, execFileSync } from 'child_process'
import fs from 'fs'
import webpack from 'webpack'
import parse from './parser'

export type MXWebpackConfig = {
  /**
   * path to config file; (default: .reactmxrc)
   */
  config?: string
  /**
   * files to include (default: ['./componments/**'])
   */
  include?: string | string[]
  /**
   * folder were React MX stores runtime data (default: .react-mx-cache)
   */
  cacheDir: string
  /**
   * method of persitance used for calculated propTypes: (default: folder)
   *  - folder: each source component will have it's own json file within a global folder
   *  - single-file: all data will be kept in a single large JSON file
   *  - inline: data will be written to the source file of the component
   */
  editablePropsPersistType?: 'folder' | 'single-file' | 'inline'
  /**
   * folder where generated editable props info will be stored if 'editablePropsPersistType' = folder (default: './editableProps)
   */
  editablePropsTargetFolder?: string
  /**
   * to on which the ReactMX server will run
   */
  port?: string | number
  /**
   * enable / disable re-analyzinig of components on webpack's hotreaload (default: true)
   */
  watch?: boolean
}

export const defaultConfig: MXWebpackConfig = {
  config: './.reactmxrc',
  include: ['./components/**/*'],
  cacheDir: '.react-mx-cache',
  editablePropsPersistType: 'folder',
  editablePropsTargetFolder: './editableProps',
  port: 5123,
  watch: true
}

export default class WebpackReactMXWatchPlugin {
  constructor(cfg?: MXWebpackConfig) {
    this.config = {
      ...defaultConfig,
      ...(cfg || {})
    }
    this.cwd = null
  }

  private config: MXWebpackConfig
  private cwd: string | null

  private readConfig = (compiler: webpack.Compiler) => {
    this.cwd = compiler.context

    if (this.config.config) {
      const cfgFilePath = path.resolve(this.cwd, this.config.config)
      // there is a config file defined, check if it exists on disk
      if (fs.existsSync(cfgFilePath)) {
        const cfgFromFileContent = fs.readFileSync(cfgFilePath, 'utf8')
        let cfgFromFile: MXWebpackConfig | undefined

        if (cfgFromFileContent) {
          try {
            cfgFromFile = JSON.parse(cfgFromFileContent)
          } catch (error) {
            throw new Error('React MX configuration file is malformated')
          }
        }

        if (cfgFromFile && typeof cfgFromFile === 'object') {
          this.config = {
            ...this.config,
            ...cfgFromFile
          }
        }
      }
    }
  }
  public apply(compiler: webpack.Compiler): void {
    this.readConfig(compiler)

    // if recompilation is disabled
    if (!this.config.watch) return
    if (compiler.hooks && compiler.hooks.watchRun && compiler.hooks.done) {
      // for webpack >= 4
      compiler.hooks.watchRun.tap('webpack-react-mx-analyser-watch', (compiler: webpack.Compiler) => {
        // @ts-ignore
        const watcher = compiler.watchFileSystem.watcher || compiler.watchFileSystem.wfs.watcher

        const changedFiles = Object.keys(watcher.mtimes)
        this.onFilesChanged(changedFiles)
      })
    } else {
      console.warn('React MX requires webpack > 4 to run')
    }
  }

  private readonly onFilesChanged = (files: string[]): void => {
    if (files.length === 0) {
      console.log('full recompile')
      // full recompile
    } else {
      console.log('files recompile', files)
      for (const file of files) {
        console.log(`React MX: changed ${file}`)
        try {
          const componentInfo = parse(file)
          console.log('cmp:', componentInfo)
        } catch (error) {
          console.error(`React MX failed\n  file: ${file}\n  ${error}`)
        }
      }
      // just a file
    }
  }
}
