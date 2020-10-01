import Cache from './cache'

export default class Handler {
  constructor(cache: Cache) {
    this.cache = cache
  }

  private cache: Cache
  public async getComponents(): Promise<Array<any>> {
    return this.cache.getAllComponents()
  }

  public async component(name: string): Promise<any> {
    return this.cache.getComponentData(name)
  }

  //@ts-ignore
  public async handle({ action, params }, respond): Promise<void> {
    try {
      let data: any = null
      let status: boolean = true
      switch (action) {
        case 'components':
          data = await this.getComponents()
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
