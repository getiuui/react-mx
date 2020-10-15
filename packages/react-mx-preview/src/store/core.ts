import { BehaviorSubject } from 'rxjs'
import set from 'set-value'

import { FileLoader, Props } from '../types'

const clean = obj => JSON.parse(JSON.stringify(obj))

export default class CoreStore {
  private static loader: FileLoader = (_file: string) => undefined
  static props: BehaviorSubject<Props> = new BehaviorSubject<Props>({})

  static setProp(key: string, value: any): void {
    const newValue = clean({
      ...CoreStore.props.getValue(),
      ...set({}, key, value === '' ? undefined : value)
    })

    CoreStore.props.next(newValue)
  }

  static resetProps() {
    CoreStore.props.next({})
  }

  public static setLoader(loader: FileLoader): void {
    CoreStore.loader = loader
  }

  public static getLoader(): FileLoader {
    return CoreStore.loader
  }
}
