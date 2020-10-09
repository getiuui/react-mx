export type FileLoader = (path: string) => any

export default class CoreStore {
  private static loader: FileLoader = (_file: string) => undefined

  public static setLoader(loader: FileLoader): void {
    CoreStore.loader = loader
  }

  public static getLoader(): FileLoader {
    return CoreStore.loader
  }
}
