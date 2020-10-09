import { statSync, writeFileSync, mkdirSync } from 'fs'
import { basename } from 'path'
import { sync as pathExists } from 'path-exists'
import low, { LowdbSync } from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import glob from 'tiny-glob'
import { Component } from '@react-mx/core'

export type MXCacheConfig = {
  cwd: string | undefined | null
  cacheDir: string | undefined | null
}

const defaultConfig: MXCacheConfig = {
  cwd: '',
  cacheDir: ''
}

export default class Cache {
  constructor(cfg?: MXCacheConfig) {
    this.setConfig(cfg || defaultConfig)
  }

  private config: MXCacheConfig = defaultConfig
  private path: string = ''

  // @ts-ignore
  private fileHashDb: LowdbSync<any>

  public setConfig(config: MXCacheConfig) {
    this.config = {
      ...defaultConfig,
      ...(config || {})
    }

    if (this.config.cwd !== '' && this.config.cacheDir !== '') {
      this.path = `${this.config.cwd}/${this.config.cacheDir}`

      this.createCacheFolderIfNotExists()
      this.initHashDb()
    }
  }

  private createCacheFolderIfNotExists(): void {
    if (this.path === '') return

    if (!pathExists(this.path) || !statSync(this.path as string).isDirectory()) {
      mkdirSync(this.path as string)
    }
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
    return this.fileHashDb.get(`entries.${entryKey}`).value() as string | null | undefined
  }

  public saveChecksum(file: string, checksum: string): void {
    const entryKey = this.pathToEntryKey(file)
    return this.fileHashDb.set(`entries.${entryKey}`, checksum).write()
  }

  public saveComponentData(file: string, data: Component): void {
    const path = `${this.getEntryPathForFile(file)}.json`
    writeFileSync(path, JSON.stringify(data, null, 2))
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

        return require(file)
      })
      .filter(cmp => cmp)
  }
}
