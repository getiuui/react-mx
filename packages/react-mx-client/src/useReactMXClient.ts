import { useEffect } from 'react'
import Client, { getInstance as getClientInstance, MXClientConfig } from './client'

export type MXClientConfigHook = MXClientConfig & { autoconnect?: boolean }

export type MXClientHookResults = {
  client: Client
  setConfig: (config?: MXClientConfigHook) => void
}

const defaultConfig: MXClientConfigHook = {
  host: 'http://localhost',
  port: 5555,
  autoconnect: true
}

const setConfig = (config?: MXClientConfigHook) => {
  const client = getClientInstance()

  const { autoconnect, ...clientConfig } = config || defaultConfig
  client.setConfig(clientConfig)
  if (autoconnect) {
    client.connect()
  }
}

export const useReactMXClient = (): MXClientHookResults => {
  const client = getClientInstance()

  useEffect(() => {
    if (!client.connected) {
      client.connect()
    }
    return () => {
      client.disconnect()
    }
  }, [])

  return { client, setConfig }
}

export default useReactMXClient
