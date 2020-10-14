import { createHash } from 'crypto'
import { createReadStream } from 'fs'

export const getChecksum = async (path: string): Promise<string> => {
  return new Promise(function(resolve, reject) {
    const hash = createHash('md5')
    const input = createReadStream(path)

    input.on('error', reject)

    input.on('data', function(chunk) {
      hash.update(chunk)
    })

    input.on('close', function() {
      resolve(hash.digest('hex'))
    })
  })
}

export default getChecksum
