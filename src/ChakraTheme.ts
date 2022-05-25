import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  primary: '#4cffb3',
  secondary: '#a071ee',
  tertiary: '#d355e7',
  green: '#4cffb3',
  purple: '#a071ee',
  pink: '#d355e7',
  'dark-pink': '#e7559c',
  gold: '#fedd5b',
  blue: '#00cbff',
  gray: '#394a4f',
  'dark-grey': '#2a3d42',
  'darkest-grey': '#21383d',
  'medium-grey': '#7d9fb1',
  'medium-grey-blue': '#0a282e',
  grey: '#bfcbd0',
  'light-grey': '#fbfbfb',
  black: '#000000',
  white: '#fff',
  'white-50': 'rgba(255, 255, 255, 0.05)',
  'white-70': 'rgba(255, 255, 255, 0.07)',
  'white-100': 'rgba(255, 255, 255, 0.1)',
  'white-200': 'rgba(255, 255, 255, 0.2)',
  'white-300': 'rgba(255, 255, 255, 0.3)',
  'white-400': 'rgba(255, 255, 255, 0.4)',
  'white-500': 'rgba(255, 255, 255, 0.5)',
  'white-600': 'rgba(255, 255, 255, 0.6)',
  'white-700': 'rgba(255, 255, 255, 0.7)',
  'white-800': 'rgba(255, 255, 255, 0.8)',
  'white-900': 'rgba(255, 255, 255, 0.9)',
  'black-100': 'rgba(0, 0, 0, 0.1)',
  'black-200': 'rgba(0, 0, 0, 0.2)',
  'black-300': 'rgba(0, 0, 0, 0.3)',
  'black-400': 'rgba(0, 0, 0, 0.4)',
  'black-500': 'rgba(0, 0, 0, 0.5)',
  'black-600': 'rgba(0, 0, 0, 0.6)',
  'black-700': 'rgba(0, 0, 0, 0.7)',
  'black-800': 'rgba(0, 0, 0, 0.8)',
  'black-900': 'rgba(0, 0, 0, 0.9)',
}

export const theme = extendTheme({
  colors,
  styles: {
    global: () => ({
      'html, body': {
        fontFamily:
          "'SofiaPro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid" +
          " Sans', 'Helvetica Neue', sans-serif",
        color: colors.white,
        backgroundColor: colors['medium-grey-blue'],
        lineHeight: 'normal',
      },
      '*, *::before, *::after': {
        boxSizing: 'unset',
      },
    }),
  },
})
