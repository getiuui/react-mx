import io from 'socket.io-client'
import { TypedEmitter } from 'tiny-typed-emitter'

export type MXClientConfig = {
  host: string | null | undefined
  port: string | number | undefined
}

const defaultConfig: MXClientConfig = {
  host: 'http://localhost',
  port: 5555
}

interface ClientEvents {
  connect: () => void
  disconnect: () => void
}

export default class Client extends TypedEmitter<ClientEvents> {
  constructor(cfg?: MXClientConfig) {
    super()
    this.setConfig(cfg || defaultConfig)
    this.socket = io(`${this.config.host}:${this.config.port}`, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 99999,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket']
    })
  }

  private config: MXClientConfig = defaultConfig
  private socket: SocketIOClient.Socket

  public connected: boolean = false

  public setConfig(config: MXClientConfig) {
    this.config = {
      ...defaultConfig,
      ...(config || {})
    }

    if (this.socket) {
      // if the host and port have changed, update and reconnect
      if (this.socket.io.uri !== `${this.config.host}:${this.config.port}`) {
        let wasConnected = !!this.socket.connected

        if (this.socket.connected) {
          this.socket.disconnect()
        }

        this.socket.io.uri = `${this.config.host}:${this.config.port}`

        if (wasConnected) {
          this.socket.connect()
        }
      }
    }
  }

  public connect(): void {
    console.log('connecting')
    this.socket.on('connect', () => {
      this.connected = true
      this.emit('connect')
    })

    this.socket.on('disconnect', () => {
      this.connected = false
      this.emit('disconnect')
    })

    this.socket.connect()
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect()
    }
  }

  public async isConnected() {
    return new Promise(resolve => {
      console.log('this.connected', this.connected)
      if (this.connected) return resolve()

      this.once('connect', () => {
        resolve()
      })
    })
  }

  public async request(action: string, params?: { [key: string]: any } | Array<any>): Promise<any> {
    await this.isConnected()

    return new Promise((resolve, reject) => {
      this.socket.emit('request', { action, params }, res => {
        if (res.error) {
          reject(res.error)
          return
        }

        resolve(res.data)
      })
    })
  }

  public async getComponents(): Promise<Array<any>> {
    return await this.request('components')
  }
}

let client: Client

export const getInstance = (): Client => {
  if (!client) {
    client = new Client()
  }

  return client
}
