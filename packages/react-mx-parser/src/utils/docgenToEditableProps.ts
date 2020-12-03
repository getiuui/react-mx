import vm from 'vm'
import {
  EditableProp,
  EditableProps,
  EditablePropType,
  EditablePropSuggestion,
  INPUT,
  SWITCH,
  LIST,
  JSON_EDITOR,
  CODE_EDITOR,
  SELECT,
  EditablePropSuggestionValue
} from '@react-mx/core'

const typeToControlMap = {
  string: INPUT,
  number: INPUT,
  boolean: SWITCH,
  object: JSON_EDITOR,
  array: LIST,
  raw: CODE_EDITOR
}

const reactTypesToNative = {
  ReactText: 'string | number'
}

const nativePropTypes = ['string', 'number', 'bigint', 'boolean', 'symbol', 'undefined', 'object', 'function']

const extractDefaultValue = (prop: any): EditablePropType | null | undefined => {
  if (prop.defaultValue === null) return null
  if (
    prop.defaultValue !== undefined &&
    prop.defaultValue.value !== undefined &&
    typeof prop.defaultValue.value === 'string'
  ) {
    try {
      return vm.runInNewContext(prop.defaultValue.value)
    } catch (error) {
      return prop.defaultValue.value
    }
  }

  return undefined
}

const extractSuggestions = (type): Array<EditablePropSuggestion> => {
  let suggestions: Array<EditablePropSuggestion> = []

  if (type.value && Array.isArray(type.value) && type.value.length) {
    suggestions = []
    type.value.map(item => {
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
          // console.log('type suggestion conversion error', error)
        }
      }
    })
  }

  return suggestions
}

const determineTypeFromString = (_type: string): EditableProp | null => {
  let type = _type
  // console.log('determineTypeFromString', type)

  if (reactTypesToNative[type])
    return {
      control: INPUT,
      valueType: reactTypesToNative[type]
    }

  // clean wrapping paranthesis eg: (sting | number)[]
  if (type[0] === '(' && type[type.length - 1] === ')') {
    type = type.slice(1).slice(0, -1)
  }

  const lastTwoCharacters = type.slice(-2)
  // if the last two charactes are [], this is an array, so need to evaluate the type without
  if (lastTwoCharacters === '[]') {
    const itemConfig = determineTypeFromString(type.slice(0, -2))

    return {
      valueType: itemConfig ? itemConfig.valueType : 'string',
      control: LIST,
      ...(itemConfig ? { controlConfig: { itemConfig } } : {})
    }
  }

  //it is an object defintion
  if (type[0] === '{') {
    return {
      valueType: type,
      control: JSON_EDITOR
    }
  }

  // need to check ig the type is a valid json => it might show flixed values; eg: `a: "a", b: "b"`

  if (type.indexOf(' | ') >= 0) {
    // it is a union type

    let suggestions: Array<EditablePropSuggestion> = []
    type.split('|').map(item => {
      try {
        // if the piped info are about a specific value, add it to the suggestion as a valueType
        // eg: ("aaa" | "bbb" | string)[]  => will have to be converted into two value suggestions and a type suggestion
        const parsedValue = JSON.parse(item.trim())
        if (parsedValue) {
          suggestions.push({
            suggestionType: 'value',
            type: typeof parsedValue,
            value: parsedValue
          })
        }
        return
      } catch (error) {}

      suggestions.push({
        suggestionType: 'type',
        type: item.trim()
      })
    })

    return {
      valueType:
        suggestions && suggestions.length ? ensureSuggestionTypesArePresentInValueType(null, suggestions) : type,
      control: INPUT,
      ...(suggestions && suggestions.length ? { suggestions } : {})
    }
  }

  // then check if the name or rawType is a native type
  // the name of the type is one of the native ones
  if (typeToControlMap[type.toLowerCase()] && nativePropTypes.includes(type.toLowerCase())) {
    return {
      valueType: type.toLowerCase(),
      control: typeToControlMap[type.toLowerCase()]
    }
  }

  return null
}

const ensureSuggestionTypesArePresentInValueType = (type, suggestions) => {
  const suggestedTypes = suggestions ? suggestions.map(({ type }) => type) : null
  // console.log('sg', type, suggestedTypes)
  if (!Array.isArray(suggestedTypes) || suggestedTypes.length === 0) return type

  const definedTypes = type
    ? type
        .split('|')
        .map(item => item.trim()) // remove all spaces
        .filter(item => item !== 'enum') // remove enum in case it appears => in some cases, docgen adds an enum type with suggestions
    : []

  suggestedTypes.map(suggestedType => {
    const trimmedSuggestedType = suggestedType.trim()
    if (!definedTypes.includes(trimmedSuggestedType)) {
      definedTypes.push(trimmedSuggestedType)
    }
  })

  // console.log('definedTypes', definedTypes)
  return definedTypes.join(' | ')
}

const determineControlType = (type: any): EditableProp | null => {
  // console.log('raw prop type', type)
  const suggestions = extractSuggestions(type)
  // console.log('suggestions', suggestions)

  if (type.name) {
    const typeResult = determineTypeFromString(type.name)
    if (typeResult) {
      // console.log('typeResult', typeResult)
      const { valueType, ...rest } = typeResult
      return {
        valueType: ensureSuggestionTypesArePresentInValueType(valueType, suggestions),
        ...rest,
        ...(suggestions && suggestions.length ? { suggestions } : {})
      }
    }
  }

  // the raw name of the type is one of the native ones
  if (type.raw) {
    const typeResult = determineTypeFromString(type.raw)
    if (typeResult) {
      const { valueType, ...rest } = typeResult
      return {
        valueType: ensureSuggestionTypesArePresentInValueType(valueType, suggestions),
        ...rest,
        ...(suggestions && suggestions.length ? { suggestions } : {})
      }
    }
  }

  // if no types could be determined from name and raw, try the suggestions
  if (suggestions && suggestions.length > 0) {
    return {
      valueType: ensureSuggestionTypesArePresentInValueType(null, suggestions),
      control: INPUT,
      ...(suggestions && suggestions.length ? { suggestions } : {})
    }
  }

  return null
}

export const convertDocgenPropsToEditableProps = (props: object): EditableProps => {
  const propKeys = Object.keys(props)
  if (!propKeys || propKeys.length === 0) return {}

  const editableProps: EditableProps = {}

  propKeys.forEach(propKey => {
    const rawProp = props[propKey]

    let defaultValue: EditablePropType | null | undefined = extractDefaultValue(rawProp)

    let prop: EditableProp = {
      control: INPUT,
      valueType: defaultValue !== undefined && defaultValue !== null ? typeof defaultValue : typeof '',
      key: propKey,
      ...(defaultValue
        ? {
            default: defaultValue
          }
        : {})
    }

    if (prop.valueType === 'function') {
      // if the default value is a function, use the embeded default.value
      defaultValue = rawProp.defaultValue.value
      prop.control = CODE_EDITOR
    } else {
      // handle typescript specific types if any present
      if (rawProp.type) {
        // console.log(`-------------------------------------------- ${propKey}:`)
        const result = determineControlType(rawProp.type)

        if (result) {
          prop = {
            ...prop,
            ...result
          }
        }

        prop.valueType = result ? result.valueType : 'string'

        // if all the suggestions are value suggestions, use a select control instead
        if (
          prop.suggestions &&
          prop.suggestions.length > 0 &&
          prop.suggestions.filter(item => item.suggestionType === 'type').length === 0
        ) {
          prop.control = SELECT
          prop.controlConfig = {
            options: prop.suggestions.map(suggestion => ({
              label: ((suggestion as EditablePropSuggestionValue).value as any).toString(),
              value: (suggestion as EditablePropSuggestionValue).value as any
            }))
          }

          delete prop.suggestions
        }

        if (!prop.valueType) {
          // console.log(`unhandled ${propKey} type:`, rawProp.type)
        }

        // console.log('--------------------------------------------')
      }
    }

    editableProps[propKey] = prop
  })

  return editableProps
}

export default convertDocgenPropsToEditableProps
