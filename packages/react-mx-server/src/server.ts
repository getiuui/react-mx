import express from 'express'
import cors from 'cors'
import * as http from 'http'
import * as socketIO from 'socket.io'
import Cache, { MXCacheConfig, defaultCacheConfig } from './cache'
import CodeAnalyzer, { defaultAnalyzerConfig, MXCodeAnalyzerConfig } from './analyzer'
import Handler from './handler'
import { Component } from '@react-mx/core'

export type MXServerConfig = MXCodeAnalyzerConfig &
  MXCacheConfig & {
    /**
     * port on which the ReactMX server will run (default: 5555)
     */
    port?: string | number
  }

export const defaultServerConfig: MXServerConfig = {
  ...defaultCacheConfig,
  ...defaultAnalyzerConfig,
  port: 5555
}

export default class Server {
  constructor(cfg?) {
    this.setConfig(cfg || defaultServerConfig)
  }

  private config: MXServerConfig = defaultServerConfig

  public cache: Cache = new Cache()

  private analyzer: CodeAnalyzer = new CodeAnalyzer(this.cache, defaultServerConfig)

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
      ...defaultServerConfig,
      ...(config || {})
    }

    this.cache.setConfig(this.config)
    this.analyzer.setConfig(this.config)

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

      this.analyzer.on('component', (component: Component) => {
        socket.emit('component', component)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  public start() {
    this.cache.init()
    this.analyzer.start()
    this.listen()
    this.isRunning = true
  }
}
