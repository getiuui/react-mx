import express from 'express'
import cors from 'cors'
import * as http from 'http'
import * as socketIO from 'socket.io'
import Cache from './cache'
import Watcher from './watcher'
import Handler from './handler'

export type MXServerConfig = {
  port: string | number | undefined
  cwd: string
  cacheDir: string | undefined | null
}

const defaultConfig: MXServerConfig = {
  cwd: '',
  cacheDir: '.mxcache',
  port: 5555
}

export default class Server {
  constructor(cfg?) {
    this.setConfig(cfg || defaultConfig)
  }

  private config: MXServerConfig = defaultConfig

  public cache: Cache = new Cache()

  private watcher: Watcher = new Watcher()

  public isRunning: boolean = false
  //@ts-ignore
  private app: express.Application
  //@ts-ignore
  private server: http.Server
  //@ts-ignore
  private io: SocketIO.Server
  //@ts-ignore
  private handler: Handler = new Handler(this.cache)

  public setConfig(config: MXServerConfig) {
    this.config = {
      ...defaultConfig,
      ...(config || {})
    }

    this.cache.setConfig({ cacheDir: this.config.cacheDir, cwd: this.config.cwd })

    this.createApp()
    this.createServer()
    this.sockets()
  }

  private createApp() {
    this.app = express()
    this.app.use(cors())
  }

  private createServer(): void {
    this.server = http.createServer(this.app)
  }

  private sockets(): void {
    this.io = socketIO.listen(this.server, { origins: '*:*' })
  }

  private listen(): void {
    this.server.listen(this.config.port, () => {
      console.log('⚛️ ReactMX: Running server on port %s', this.config.port)
    })

    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', this.config.port)

      socket.on('request', this.handler.handle.bind(this.handler))

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  public start() {
    this.watcher.start()
    this.listen()
    this.isRunning = true
  }
}
