export const asyncFilter = async (arr: Array<any>, predicate: (item: any) => Promise<boolean>) => {
  const results = await Promise.all(arr.map(predicate))

  return arr.filter((_v, index) => results[index])
}

export default asyncFilter
