import { getInstance } from '@react-mx/client'
import { Component } from '@react-mx/core'
import { mutate } from 'swr'

const client = getInstance()

client.on('component', newComponent => {
  mutate('components', async components => {
    let found = false
    let newComponents: Array<Component> = components.map(component => {
      if (component.key === newComponent.key) {
        found = true
        return newComponent
      } else {
        return component
      }
    })

    if (!found) {
      newComponents.push(newComponent)
    }

    return newComponents
  })
})

export const fetcher = (key, params?) => getInstance().request(key, params)

export { getInstance as getClient } from '@react-mx/client'

export default fetcher
