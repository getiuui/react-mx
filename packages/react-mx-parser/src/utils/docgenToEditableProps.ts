import vm from 'vm'
import { EditableProp, EditableProps, EditablePropType } from '@react-mx/core'

const typeToControlMap = {
  string: 'input',
  number: 'input',
  boolean: 'switch',
  object: 'json-editor',
  array: 'json-editor',
  raw: 'raw'
}

const nativePropTypes = ['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined', 'object', 'function']

export const convertDocgenPropsToEditableProps = (props: object): EditableProps => {
  const propKeys = Object.keys(props)
  if (!propKeys || propKeys.length === 0) return {}

  const editableProps: EditableProps = {}

  propKeys.forEach(propKey => {
    const rawProp = props[propKey]

    let defaultValue: any = null

    if (rawProp.defaultValue === null) {
      defaultValue = null
    } else {
      if (
        rawProp.defaultValue !== undefined &&
        rawProp.defaultValue.value !== undefined &&
        typeof rawProp.defaultValue.value === 'string'
      ) {
        try {
          defaultValue = vm.runInNewContext(rawProp.defaultValue.value)
        } catch (error) {
          defaultValue = rawProp.defaultValue.value
        }
      }
    }

    let valueType: EditablePropType = defaultValue !== undefined ? typeof defaultValue : typeof ''
    let suggestions

    if (valueType === 'function') {
      defaultValue = rawProp.defaultValue.value
    } else {
      // handle typescript specific types if any present
      if (rawProp.type) {
        if (
          (rawProp.type.name && rawProp.type.name.indexOf('[]') >= 0) ||
          (rawProp.type.raw && rawProp.type.raw.indexOf('[]') >= 0)
        ) {
          // array types will map to json-editor for now
          valueType = 'array'
        } else if (
          // then check if the name or rawType is a native type
          // the name of the type is one of the native ones
          rawProp.type.name &&
          typeToControlMap[rawProp.type.name.toLowerCase()] &&
          nativePropTypes.includes(rawProp.type.name.toLowerCase())
        ) {
          valueType = rawProp.type.name.toLowerCase()
        } else if (
          // the raw name of the type is one of the native ones
          rawProp.type.raw &&
          typeToControlMap[rawProp.type.raw.toLowerCase()] &&
          nativePropTypes.includes(rawProp.type.raw.toLowerCase())
        ) {
          valueType = rawProp.type.raw.toLowerCase()
        } else if (rawProp.type.value && Array.isArray(rawProp.type.value) && rawProp.type.value.length) {
          // treat some compound types ( such as string | number )
          suggestions = []
          rawProp.type.value.map(item => {
            if (nativePropTypes.includes(item.value.toLowerCase())) {
              suggestions.push({
                suggestionType: 'type',
                type: item.value
              })
            } else if (['true', 'false'].includes(item.value.toLowerCase())) {
              suggestions.push({
                suggestionType: 'value',
                type: 'boolean',
                value: item.value === 'true'
              })
            } else {
              try {
                let value = vm.runInNewContext(item.value)
                suggestions.push({
                  suggestionType: 'value',
                  type: typeof value,
                  value
                })
              } catch (error) {
                console.log('type suggestion conversion error', error)
              }
            }
          })
        } else {
          console.log(`unhandled ${propKey} type:`, rawProp.type)
        }
      }
    }
    // extract type info if present from ts type

    let type = 'input'

    if (!Array.isArray(valueType)) {
      type = typeToControlMap[valueType] || 'input'
    }

    const prop: EditableProp = {
      // @ts-ignore
      type,
      valueType,
      key: propKey,
      ...(suggestions && suggestions.length ? { suggestions } : {}),
      ...(defaultValue
        ? {
            default: defaultValue
          }
        : {})
    }

    editableProps[propKey] = prop
  })

  return editableProps
}

export default convertDocgenPropsToEditableProps
