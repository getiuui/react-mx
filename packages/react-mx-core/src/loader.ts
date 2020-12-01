import { lazy, ComponentType } from 'react'

export type ComponentLoader = (library: string) => Promise<{ default: ComponentType<any> }>

export const lazyImport = <T extends React.ComponentType<any>, I extends { [K2 in K]: T }, K extends keyof I>(
  factory: () => Promise<I>,
  name: K
): I => {
  return Object.create({
    [name]: lazy(() => factory().then(module => ({ default: module[name] })))
  })
}

export const loader = (loaders: { [key: string]: ComponentLoader }) => {
  return async (library: string, exportName: string = 'default') => {
    for (const key of Object.keys(loaders)) {
      const loaderFn: ComponentLoader = loaders[key]

      if (library.indexOf(key) === 0)
        return lazy(() => loaderFn(library.replace(`${key}/`, '')).then(module => ({ default: module[exportName] })))
    }

    return undefined
  }
}

export default loader
