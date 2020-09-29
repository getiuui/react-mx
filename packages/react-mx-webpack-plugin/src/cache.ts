import { statSync, mkdirSync, writeFileSync } from 'fs'
import { sync as pathExists } from 'path-exists'
import low, { LowdbSync } from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

export type MXCacheConfig = {
  cwd: string
  folder: string
  path?: string
}

const defaultConfig: MXCacheConfig = {
  cwd: '',
  folder: ''
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

    if (this.config.cwd !== '' && this.config.folder !== '') {
      this.path = `${this.config.cwd}/${this.config.folder}`

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
    return entryRelativeToCWD.replace(/\//g, '_').replace(/\./g, '_')
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

  public saveComponentData(file: string, data: any): void {
    const path = `${this.getEntryPathForFile(file)}.json`
    writeFileSync(path, JSON.stringify(data, null, 2))
  }
}
