import chokidar, { FSWatcher } from 'chokidar'
import { TypedEmitter } from 'tiny-typed-emitter'
import Cache from './cache'
import Parser from '@react-mx/parser'
import { Component } from '@react-mx/core'
import computeChecksum from './utils/checksum'

export type MXCodeAnalyzerConfig = {
  /**
   * current working dorectory
   */
  cwd: string | undefined | null
  /**
   * files to include (default: ['componments/**'])
   */
  include?: string[]
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
   * enable / disable re-analyzinig of components on webpack's hotreaload (default: true)
   */
  watch?: boolean

  /**
   * disable content change checking; might decrease performace
   */
  ignoreChecksum?: boolean
}

export const defaultAnalyzerConfig: MXCodeAnalyzerConfig = {
  cwd: '',
  include: ['components/**/*', 'src/components/**/*'],
  editablePropsPersistType: 'folder',
  editablePropsTargetFolder: './editableProps',
  watch: true,
  ignoreChecksum: false
}

interface AnalyzerEvents {
  component: (component: Component) => void
}

export class CodeAnalyzer extends TypedEmitter<AnalyzerEvents> {
  constructor(cache: Cache, cfg?: MXCodeAnalyzerConfig) {
    super()
    this.cache = cache
    this.setConfig(cfg || defaultAnalyzerConfig)
  }

  private parser: Parser = new Parser()
  private cache: Cache

  private config: MXCodeAnalyzerConfig = defaultAnalyzerConfig
  // @ts-ignore
  private watcher: FSWatcher

  public setConfig(config: MXCodeAnalyzerConfig) {
    this.config = {
      ...defaultAnalyzerConfig,
      ...(config || {})
    }
    this.parser.setConfig(this.config)
  }

  public start() {
    this.watcher = chokidar.watch(this.config.include || [], {
      cwd: this.config.cwd as string
    })

    this.watcher.on('add', async path => {
      await this.processFile(path)
    })
    this.watcher.on('change', async path => {
      await this.processFile(path)
    })
    this.watcher.on('unlink', path => {
      console.log('unlink', path)
      // this.emit('unlink', path)
    })
  }

  public async processFile(file: string) {
    if (this.config.ignoreChecksum || (await this.hasFileChanged(file))) {
      const component: Component | undefined = await this.parser.processFile(file)
      if (component) {
        this.cache.saveComponentData(component)

        this.emit('component', component)
      }
    }
  }

  private async hasFileChanged(file: string): Promise<boolean> {
    const savedChecksum = this.cache.getChecksum(file)
    const currentChecksum = await this.getFileChecksum(file)

    if (savedChecksum === undefined) return true

    return currentChecksum !== savedChecksum
  }

  private getFileChecksum = async (file: string): Promise<string> => {
    const checksum = await computeChecksum(file)
    this.cache.saveChecksum(file, checksum)
    return checksum
  }
}

export default CodeAnalyzer
