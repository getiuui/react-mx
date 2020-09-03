import { theme as defaultTheme } from '@chakra-ui/core'

export const defaultFont = `'Work Sans', sans-serif`

export const fonts = {
  ...defaultTheme.fonts,
  body: defaultFont,
  default: defaultFont,
  heading: defaultFont,
  mono: defaultFont
}

export const fontSizes = {
  xxxsmall: '10px',
  xxsmall: '12px',
  xsmall: '14px',
  small: '16px',
  medium: '18px',
  mediumlg: '20px',
  large: '25px',
  xlarge: '30px',
  xxlarge: '35px'
}

export const lineHeights = {
  ...defaultTheme.lineHeights,
  normal: 'normal',
  none: '1',
  shorter: '1.25',
  short: '1.375',
  base: '1.5',
  tall: '1.625',
  taller: '2',
  xxl: 53
}

export const letterSpacings = {
  ...defaultTheme.letterSpacings,
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em'
}

export const brand = '#1774ff'
export const dark = '#6b6b6b'
export const darker = '#16161D'
export const yellow = '#ffc417'
export const orange = '#f79138'
export const white = '#fff'
export const black = '#000'
export const red = '#FF1717'
export const lightGray = '#F7F9FA'
export const border = '#E3E5E6'
export const darkGray = '#A6ADAF'

export const brandColors = {
  brand,
  dark,
  darker,
  yellow,
  orange,
  white,
  black,
  red,
  lightGray,
  darkGray,
  border
}

export const colors = {
  ...defaultTheme.colors,
  ...brandColors,
  primary: brand,
  secondary: yellow,
  tertiary: orange,
  variantPrimary: {
    50: '#defcfa',
    100: '#beefec',
    200: '#9ae2df',
    300: '#74d4d1',
    400: '#50c8c4',
    500: brand,
    600: '#278884',
    700: '#16625e',
    800: '#033b3a',
    900: '#001616'
  },
  variantSecondary: {
    50: '#fff9da',
    100: '#ffecad',
    200: '#ffdf7d',
    300: '#ffd24b',
    400: '#ffc51a',
    500: yellow,
    600: '#b38500',
    700: '#805f00',
    800: '#4e3900',
    900: '#1d1300'
  },
  variantTertiary: {
    50: '#ffefdc',
    100: '#ffd5b0',
    200: '#fbbb82',
    300: '#f9a052',
    400: '#f68522',
    500: orange,
    600: '#ad5405',
    700: '#7c3b02',
    800: '#4c2300',
    900: '#1f0900'
  },
  variantWhite: {
    50: '#f2f2f2',
    100: '#d9d9d9',
    200: '#bfbfbf',
    300: '#a6a6a6',
    400: '#8c8c8c',
    500: white,
    600: '#595959',
    700: '#404040',
    800: '#262626',
    900: '#0d0d0d'
  },
  variantRed: {
    50: '#ffe1e1',
    100: '#ffb1b1',
    200: '#ff7f7f',
    300: '#ff4c4c',
    400: '#ff1a1a',
    500: red,
    600: '#b40000',
    700: '#810000',
    800: '#500000',
    900: '#210000'
  }
}

const shadows = {
  ...defaultTheme.shadows,
  default: '0px -2px 4px rgba(128, 128, 128, 0.1),0px 2px 4px rgba(120, 120, 120, 0.25)',
  large: '0px 6px 12px rgba(8, 35, 48, 0.14), 0px -1px 24px rgba(8, 35, 48, 0.08);'
}

const space = {
  ...defaultTheme.space,
  none: '0px',
  xs: '4px',
  xsx2: '8px',
  small: '10px',
  smallx2: '20px',
  smallx3: '30px',
  smallx4: '40px',
  medium: '50px',
  mediumlg: '60px',
  large: '80px',
  xxlarge: '100px'
}

const sizes = {
  ...defaultTheme.sizes,
  containers: {
    ...defaultTheme.sizes.containers,
    maxWidth: 970
  }
}

const radii = {
  ...defaultTheme.radii,
  none: false,
  sm: '4px',
  md: '8px',
  lg: '10px'
}

const breakpoints = defaultTheme.breakpoints

breakpoints.mobile = null
breakpoints.m = null
breakpoints.desktop = '668px'
breakpoints.d = '668px'
breakpoints.sm = breakpoints[0]
breakpoints.md = breakpoints[1]
breakpoints.lg = breakpoints[2]
breakpoints.xl = breakpoints[3]

// @ts-ignore
export const theme = {
  ...defaultTheme,
  colors,
  fonts,
  fontSizes,
  lineHeights,
  letterSpacings,
  breakpoints,
  shadows,
  space,
  sizes,
  radii
}

export default theme
