import { Component } from './Component'

export type ComponentsLibrary = {
  key: string
  name: string
  version?: string
  source: 'local' | 'external'
  components: Component[]
  exports: {
    [name: string]: string
  }
}
