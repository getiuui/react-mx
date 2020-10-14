/**
 * @class WebpackReactMXPlugin
 * @extends Object
 * A Webpack plugin that analyses react compionent to determin editable props based on source files.
 */
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { sync as pathExists } from 'path-exists'
import webpack from 'webpack'
import Server, { MXServerConfig, defaultServerConfig } from '@react-mx/server'
import { MXClientConfig } from '@react-mx/client'

export type MXWebpackConfig = MXServerConfig & {
  /**
   * path to config file; (default: .reactmxrc)
   */
  config?: string
}

export const defaultConfig: MXWebpackConfig = {
  config: './.reactmxrc',
  ...defaultServerConfig
}

export class WebpackReactMXWatchPlugin {
  constructor(cfg?: MXWebpackConfig) {
    this.config = {
      ...defaultConfig,
      ...(cfg || {})
    }

    this.server = new Server()
  }

  private config: MXWebpackConfig
  // private globs: Array<{ include: string; glob: any; expression: any }> = []
  private server: Server

  private readConfig = (compiler: webpack.Compiler) => {
    this.config = {
      ...this.config,
      cwd: compiler.context
    }

    if (this.config.config) {
      const cfgFilePath = resolve(this.config.cwd as string, this.config.config)
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
    }

    this.server.setConfig(this.config as MXServerConfig)
  }

  private getClientConfig(): MXClientConfig {
    return {
      port: this.config.port,
      host: 'localhost'
      // host: this.config.host
    }
  }

  private injectPlugins(compiler: webpack.Compiler): void {
    const ignoreCacheExpression = new RegExp(this.config.cacheDir as string)

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
  }
}

module.exports = WebpackReactMXWatchPlugin
