// Demonstrates extracting complete props info, using real TypeScript
// compiler type info.

//
const ts = require('typescript')
const fs = require('fs')
const path = require('path')

// Arguments:
// 0. node
// 1. this script
// 2. filename to examine
// 3. [tsconfig file]

const filename = process.argv[2]
const tsconfigFilename = process.argv[3]
let compilerOptions = {}

console.log(`Parsing ${filename}`)

if (tsconfigFilename) {
  console.log(` using tsconfig from ${tsconfigFilename}`)

  const configJson = JSON.parse(fs.readFileSync(tsconfigFilename, 'utf8'))
  const basePath = path.dirname(tsconfigFilename)

  const { options, errors } = ts.convertCompilerOptionsFromJson(configJson.compilerOptions, basePath, tsconfigFilename)
  if (errors && errors.length) {
    for (let error of errors) {
      console.error(error)
    }

    process.exit(5)
  }
  compilerOptions = options
} else {
  console.log(' no tsconfig file specified - using default options')
}

const program = ts.createProgram([filename], compilerOptions)

const checker = program.getTypeChecker()
for (let rootFilename of program.getRootFileNames()) {
  const source = program.getSourceFile(rootFilename)

  // Find the actual exports from the source file; we don't care about
  // anything that isn't exported.
  const moduleSymbol = checker.getSymbolAtLocation(source)
  const exports = checker.getExportsOfModule(moduleSymbol)

  for (let exp of exports) {
    // The original export name; may be named or 'default'
    const exportName = exp.getName()
    const declarations = exp.getDeclarations()
    const firstDeclaration = declarations[0]
    const exportedExpressionName = firstDeclaration.expression.escapedText
    const props = firstDeclaration.getChildren()

    // If it's the "default" export, the component is named after the file without
    // its extension.
    const componentName =
      exportName === 'default'
        ? exportedExpressionName || path.basename(source.fileName, path.extname(source.fileName))
        : exportName

    console.log('found component:', componentName)
    const type = checker.getTypeOfSymbolAtLocation(exp, exp.valueDeclaration)

    // We don't really know what we have at this point. Could be a constant, or an interface,
    // or anything.
    const callSignatures = type.getCallSignatures()
    const constructSignatures = type.getConstructSignatures()

    if (callSignatures.length) {
      // Could be a stateless component.  Is a function, so the props object we're interested
      // in is the (only) parameter.

      for (let sig of callSignatures) {
        const params = sig.getParameters()
        // if (params.length !== 1) {
        //   continue
        // }

        // We've found an exported function with a single parameter.
        // Might be a stateless component. For now this is fine, but we could
        // theoretically check its return type to see if it's ReactElement or friends.

        const propsParam = params[0]
        dumpComponentInfo(componentName, propsParam)
      }
    }

    if (constructSignatures.length) {
      // React.Component. Is a class, so the props object we're interested
      // in is the type of 'props' property of the object constructed by the class.

      for (let sig of constructSignatures) {
        const instanceType = sig.getReturnType()
        const props = instanceType.getProperty('props')

        if (!props) {
          // No props. Not a React component!
          continue
        }

        dumpComponentInfo(componentName, props)
      }
    }
  }
}

function dumpComponentInfo(componentName, propsObj) {
  const propsType = checker.getTypeOfSymbolAtLocation(propsObj, propsObj.valueDeclaration)
  const propertiesOfProps = propsType.getProperties()

  console.log(`Component ${componentName}:`)
  propertiesOfProps.forEach(prop => {
    const propName = prop.getName()

    // Find type of prop by looking in context of the props object itself.
    const propType = checker.getTypeOfSymbolAtLocation(prop, propsObj.valueDeclaration)
    const propTypeString = checker.typeToString(propType)
    console.log(` ${propName}: ${propTypeString}`)
  })
  console.log()
}
