import chokidar, { FSWatcher } from 'chokidar'
import { TypedEmitter } from 'tiny-typed-emitter'

export type MXServerWatcherConfig = {
  cwd: string
  cacheDir: string | number | undefined
}

const defaultConfig: MXServerWatcherConfig = {
  cwd: '',
  cacheDir: '.mxcache'
}

interface WatcherEvents {
  add: (path: string) => void
  change: (path: string) => void
  unlink: (path: string) => void
}

export class Watcher extends TypedEmitter<WatcherEvents> {
  constructor(cfg?: MXServerWatcherConfig) {
    super()
    this.setConfig(cfg || defaultConfig)
  }

  private config: MXServerWatcherConfig = defaultConfig
  // @ts-ignore
  private watcher: FSWatcher

  public setConfig(config: MXServerWatcherConfig) {
    this.config = {
      ...defaultConfig,
      ...(config || {})
    }
  }

  public start() {
    this.watcher = chokidar.watch('*.json', {
      cwd: `${this.config.cwd}/${this.config.cacheDir}`,
      ignored: 'checksums.json'
    })

    this.watcher.on('add', path => {
      this.emit('add', path)
    })
    this.watcher.on('change', path => {
      this.emit('change', path)
    })
    this.watcher.on('unlink', path => {
      this.emit('unlink', path)
    })
  }
}

export default Watcher
