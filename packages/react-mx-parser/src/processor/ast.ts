const isValidAst = (ast: any): boolean => {
  if (!ast) {
    console.error('Invalid ast - empty')
    return false
  }

  if (typeof ast !== 'object') {
    console.error('Invalid ast - not object')
    return false
  }

  if (!ast.program) {
    console.error('Invalid ast - no program')
    return false
  }

  if (!ast.program.body) {
    console.error('Invalid ast - no body')
    return false
  }

  return true
}

const getExportStatements = (ast: any): any => {
  const { body } = ast.program
  const namedExports = []
  let defaultExportIdentifier = null

  if (body && Array.isArray(body)) {
    body.map(node => {
      if (node.type === 'ExportNamedDeclaration') {
        // handle re-exports
        if (node.specifiers && node.specifiers.length > 0) {
          node.specifiers.map(specifier => {
            // @ts-ignore
            namedExports.push(specifier.exported.name)
          })
        }

        // handle traditional named export
        if (node.declaration) {
          if (node.declaration.declarations && node.declaration.declarations.length > 0) {
            node.declaration.declarations.map(declaration => {
              // @ts-ignore
              namedExports.push(declaration.id.name)
            })
          }
        }
      }

      if (node.type === 'ExportDefaultDeclaration') {
        defaultExportIdentifier = node.declaration.name
      }
    })
  }

  return {
    namedExports,
    default: defaultExportIdentifier
  }
}

export const findComponentExportInfo = (
  ast: any,
  componentName: string
): { exportType: 'named' | 'default'; exportName: string } | null => {
  if (!isValidAst(ast)) return null

  const exportData = getExportStatements(ast)

  if (exportData.default === componentName) return { exportName: 'default', exportType: 'default' }

  if (exportData.namedExports.includes(componentName)) {
    return { exportName: componentName, exportType: 'named' }
  }

  return null
}
