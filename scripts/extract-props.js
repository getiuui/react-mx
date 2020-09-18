const path = require('path')
const fs = require('fs')
const tsDocgen = require('react-docgen-typescript')
const reactDocs = require('react-docgen')

const filename = process.argv[2]
// const tsconfigFilename = process.argv[3]

const ext = path.extname(filename)
console.log('processing: ', filename)
console.log('ext: ', ext)

if (ext === '.ts' || ext === '.tsx') {
  console.log('TS')
  const options = {
    savePropValueAsString: true
  }

  // Parse a file for docgen info
  const data = tsDocgen.parse(filename, options)

  console.log(JSON.stringify(data))
  return
}

if (ext === '.js') {
  console.log('JS')
  const jsContent = fs.readFileSync(filename)
  var componentInfo = reactDocs.parse(jsContent)
  console.log(JSON.stringify(componentInfo))
  return
}
