import { lazy, ComponentType } from 'react'
export type ComponentLoader = (file: string) => Promise<{ default: ComponentType<any> }>

export const loader = (loaders: { [key: string]: ComponentLoader }) => {
  return async (path: string) => {
    for (const key of Object.keys(loaders)) {
      const loaderFn: ComponentLoader = loaders[key]

      if (path.indexOf(key) === 0) return lazy(() => loaderFn(path.replace(`${key}/`, '')))
    }
    return undefined
  }
}

export default loader
