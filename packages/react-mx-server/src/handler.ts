import Cache from './cache'

export default class Handler {
  constructor(cache: Cache) {
    this.cache = cache
  }

  private cache: Cache

  public async libraries(): Promise<Array<any>> {
    return this.cache.getAllLibraries()
  }

  public async components(): Promise<Array<any>> {
    return this.cache.getAllLibraries()
  }

  public async library(name: string, version: string = '*'): Promise<any> {
    return this.cache.getLibrary(name, version)
  }

  //@ts-ignore
  public async handle({ action, params }, respond): Promise<void> {
    try {
      let data: any = null
      let status: boolean = true
      switch (action) {
        case 'components':
          const libraries = await this.libraries()

          data = []

          libraries.map(library => {
            if (library && library.components && library.components.length > 0) {
              library.components.map(component => {
                data.push(component)
              })
            }
          })
          break
        case 'libraries':
          data = await this.libraries()
          break
        default:
          throw new Error(`Invalid action: ${action}`)
          break
      }

      respond({ status, data })
    } catch (error) {
      console.log(`req error ${action}`, error)
      respond({ status: false, error: error.message })
    }
  }
}
