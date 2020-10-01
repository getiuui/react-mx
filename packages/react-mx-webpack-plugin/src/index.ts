/**
 * @class WebpackReactMXPlugin
 * @extends Object
 * A Webpack plugin that analyses react compionent to determin editable props based on source files.
 */
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { sync as pathExists } from 'path-exists'
import webpack from 'webpack'
import glob from 'tiny-glob'
import globrex from 'globrex'
import globalyzer from 'globalyzer'
import computeChecksum from './utils/checksum'
import asyncFilter from './utils/asyncFilter'
import Parser from '@react-mx/parser'
import Server from '@react-mx/server'
import { MXClientConfig } from '@react-mx/client'

export type MXWebpackConfig = {
  /**
   * path to config file; (default: .reactmxrc)
   */
  config?: string
  /**
   * files to include (default: ['componments/**'])
   */
  include?: string[]
  /**
   * folder were React MX stores runtime data (default: .mxcache)
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
   * host where the server will be reachable (default: http://localhost)
   */
  host?: string | null | undefined

  /**
   * port on which the ReactMX server will run (default: 5555)
   */
  port?: string | number
  /**
   * enable / disable re-analyzinig of components on webpack's hotreaload (default: true)
   */
  watch?: boolean

  /**
   * disable content change checking; might decrease performace
   */
  ignoreChecksum?: boolean
}

export const defaultConfig: MXWebpackConfig = {
  config: './.reactmxrc',
  include: ['components/**/*', 'src/components/**/*'],
  cacheDir: '.mxcache',
  editablePropsPersistType: 'folder',
  editablePropsTargetFolder: './editableProps',
  host: 'http://localhost',
  port: 5555,
  watch: true,
  ignoreChecksum: true
}

export class WebpackReactMXWatchPlugin {
  constructor(cfg?: MXWebpackConfig) {
    this.config = {
      ...defaultConfig,
      ...(cfg || {})
    }

    this.parser = new Parser()
    this.server = new Server()
  }

  private config: MXWebpackConfig
  private cwd: string | undefined
  private globs: Array<{ include: string; glob: any; expression: any }> = []
  private parser: Parser
  private server: Server

  private readConfig = (compiler: webpack.Compiler) => {
    this.cwd = compiler.context

    if (this.config.config) {
      const cfgFilePath = resolve(this.cwd, this.config.config)
      // there is a config file defined, check if it exists on disk
      if (pathExists(cfgFilePath)) {
        const cfgFromFileContent = readFileSync(cfgFilePath, 'utf8')
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

      this.parser.setConfig({ cwd: this.cwd })
      this.server.setConfig({
        port: this.config.port,
        cacheDir: this.config.cacheDir,
        cwd: this.cwd
      })
    }

    // make sure the icludes have extention filtering added;
    this.config.include = this.config.include?.map(
      include => `${include}${include.indexOf('.{') < 0 ? '.{ts,tsx,js,json}' : ''}`
    )

    // prepare globs for later use
    this.globs =
      this.config.include?.map(include => {
        const glob = globalyzer(`${this.cwd}/${include}`)
        const expression = glob.isGlob
          ? globrex(glob.glob, {
              filepath: true,
              globstar: true,
              extended: true
            })
          : null
        return { include, glob, expression }
      }) || []
  }

  private getClientConfig(): MXClientConfig {
    return {
      port: this.config.port,
      host: this.config.host
    }
  }

  private injectPlugins(compiler: webpack.Compiler): void {
    const ignoreCacheExpression = new RegExp(this.config.cacheDir)

    const plugins = [
      new webpack.IgnorePlugin(ignoreCacheExpression),
      // @TODO: this does not work!!!
      new webpack.DefinePlugin({ REACT_MX_CLIENT_CONFIG: JSON.stringify(this.getClientConfig()) })
    ]

    plugins.forEach(plugin => {
      plugin.apply(compiler)
    })
  }

  public apply(compiler: webpack.Compiler): void {
    this.readConfig(compiler)

    this.injectPlugins(compiler)

    this.server.start()

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

  private readonly onFilesChanged = async (files: string[]): Promise<void> => {
    let filesToAnalyse: Array<string> = []
    if (files.length === 0) {
      // no specific file was sent, so all files that match the patterns need to be analysed
      if (this.config.include && this.config.include.length) {
        filesToAnalyse = (
          await Promise.all(
            this.config.include.map(async include => {
              try {
                if (!include) return []

                return await glob(`${include}`, {
                  filesOnly: true,
                  cwd: this.cwd,
                  absolute: true,
                  flush: true
                })
              } catch (error) {
                return []
              }
            })
          )
        ).flat()
      }
    } else {
      // there are specific files send;
      // this happens when the user changes a file
      // filter out all files that do not match any patters, or not listed explicitly
      filesToAnalyse = files.filter(file =>
        this.globs?.some(({ glob, expression }) => (glob.isGlob ? expression.regex.test(file) : glob.include === file))
      )
    }

    await this.processChnagedFiles(filesToAnalyse)
  }

  private processChnagedFiles = async (files: Array<string>): Promise<void> => {
    // only analyze files who's checksum has changed since last analyze
    const changedFiles = this.config.ignoreChecksum ? files : await asyncFilter(files, await this.hasFileChanged)

    const results = await this.parser.processFiles(changedFiles)
    if (results) {
      Object.keys(results).map(componetAlias =>
        this.server.cache.saveComponentData(componetAlias, results[componetAlias])
      )
    }
  }

  private hasFileChanged = async (file: string): Promise<boolean> => {
    const savedChecksum = this.server.cache.getChecksum(file)
    const currentChecksum = await this.getFileChecksum(file)

    if (savedChecksum === undefined) return true

    return currentChecksum !== savedChecksum
  }

  private getFileChecksum = async (file: string): Promise<string> => {
    const checksum = await computeChecksum(file)
    this.server.cache.saveChecksum(file, checksum)
    return checksum
  }
}

module.exports = WebpackReactMXWatchPlugin
