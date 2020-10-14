import { statSync, writeFileSync, readFileSync, mkdirSync } from 'fs'
import { basename } from 'path'
import { sync as pathExists } from 'path-exists'
import low, { LowdbSync } from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import glob from 'tiny-glob'
import { Component } from '@react-mx/core'

export type MXCacheConfig = {
  /**
   * current working dorectory
   */
  cwd: string | undefined | null
  /**
   * folder were React MX stores runtime data (default: .mxcache)
   */
  cacheDir: string | undefined | null
}

export const defaultCacheConfig: MXCacheConfig = {
  cwd: '',
  cacheDir: '.mxcache'
}

export default class Cache {
  constructor(cfg?: MXCacheConfig) {
    this.setConfig(cfg || defaultCacheConfig)
  }

  private config: MXCacheConfig = defaultCacheConfig
  private path: string = ''

  // @ts-ignore
  private fileHashDb: LowdbSync<any>

  public setConfig(config: MXCacheConfig) {
    this.config = {
      ...defaultCacheConfig,
      ...(config || {})
    }

    this.path = `${this.config.cwd}/${this.config.cacheDir}`
  }

  private createCacheFolderIfNotExists(): void {
    if (this.path === '') return

    if (!pathExists(this.path) || !statSync(this.path as string).isDirectory()) {
      mkdirSync(this.path as string)
    }
  }

  public init() {
    if (this.config.cwd === '' || this.config.cacheDir === '')
      throw new Error(
        `Invalid cache config: ${JSON.stringify({ cwd: this.config.cwd, cacheDir: this.config.cacheDir })}`
      )

    this.path = `${this.config.cwd}/${this.config.cacheDir}`

    this.createCacheFolderIfNotExists()
    this.initHashDb()
  }

  private initHashDb() {
    this.fileHashDb = low(new FileSync(`${this.path}/checksums.json`))
    this.fileHashDb.defaults({ entries: {} }).write()
  }

  private pathToEntryKey(path: string): string {
    const entryRelativeToCWD = path.replace(`${this.config.cwd}/`, '')
    return entryRelativeToCWD.replace(/\//g, '____').replace(/\./g, '____')
  }

  private getEntryPathForFile(file: string): string {
    const entryKey = this.pathToEntryKey(file)
    return `${this.path}/${entryKey}`
  }

  public async entryExists(file: string): Promise<boolean> {
    const entryPath = this.getEntryPathForFile(file)
    return pathExists(entryPath) && statSync(entryPath).isFile()
  }

  public getChecksum(file: string): string | null | undefined {
    const entryKey = this.pathToEntryKey(file)
    //@ts-ignore
    return this.fileHashDb.get(`entries.${entryKey}`).value() as string | null | undefined
  }

  public saveChecksum(file: string, checksum: string): void {
    const entryKey = this.pathToEntryKey(file)
    return this.fileHashDb.set(`entries.${entryKey}`, checksum).write()
  }

  public saveComponentData(component: Component): void {
    const path = `${this.getEntryPathForFile(component.key)}.json`
    writeFileSync(path, JSON.stringify(component, null, 2))
  }

  public getComponentData(key: string): Component {
    const path = `${this.getEntryPathForFile(key)}.json`
    if (!this.entryExists(path)) throw new Error(`Invalid file: ${key}`)
    return require(path)
  }

  public async getAllComponents(): Promise<Array<Component>> {
    const files = await glob(`*.json`, {
      dot: false,
      filesOnly: true,
      cwd: this.path,
      absolute: true,
      flush: true
    })

    return files
      .map(file => {
        const fileName = basename(file)
        if (fileName === 'checksums.json') return null

        // return require(file)
        const content = readFileSync(file, 'utf-8')
        return JSON.parse(content)
      })
      .filter(cmp => cmp)
  }
}
