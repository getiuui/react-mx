import userAgent from '../../lib/utils/userAgent'

/**
 * gets the relevant value based on userAgent and mobile / desktop keys
 * @param {any} value
 * @param {any} defaultValue
 */
export const apply = (value, defaultValue) => {
  // if the value is true, return the default value, flase otherwise
  if (typeof value === 'boolean') return value ? defaultValue : false

  // if no value has been passed, return the default value
  let result = typeof value !== 'undefined' && value !== null ? value : defaultValue
  // handle mobile / desktop for situations when props don't support mapping on breakpoints
  if (result.mobile !== undefined && userAgent.isMobile) return result.mobile
  if (result.m !== undefined && userAgent.isMobile) return result.m
  if (result.desktop !== undefined && !userAgent.isMobile) return result.desktop
  if (result.d !== undefined && !userAgent.isMobile) return result.d

  return result
}

export default apply
