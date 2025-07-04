import { createTheme } from '@mui/material/styles'

// Paleta suave e moderna baseada em roxo
const primaryColor = '#7C3AED'    // Roxo vibrante
const secondaryColor = '#F54952'  // Vermelho rosado (coral intenso)
const successColor = '#4ADE80'      // Verde menta
const warningColor = '#FACC15'      // Amarelo vibrante
const errorColor = '#F43F5E'        // Rosa avermelhado
const infoColor = '#38BDF8'         // Azul moderno

const darkBackground = '#111827'
const darkPaper = '#1F2937'
const lightBackground = '#F9FAFB'
const lightPaper = '#FFFFFF'
const textDark = '#F3F4F6'
const textLight = '#1F2937'

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      light: '#A78BFA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: secondaryColor,
      light: '#FF6B72',
      dark: '#C4343C',  
      contrastText: '#1F1F1F',
    },
    error: { main: errorColor },
    warning: { main: warningColor },
    info: { main: infoColor },
    success: { main: successColor },
    background: {
      default: lightBackground,
      paper: lightPaper,
    },
    text: {
      primary: textLight,
      secondary: '#4B5563',
      disabled: '#9CA3AF',
    },
    action: {
      active: primaryColor,
      selected: 'rgba(124, 58, 237, 0.15)',
      disabled: 'rgba(0, 0, 0, 0.3)',
      disabledBackground: 'rgba(0, 0, 0, 0.1)',
      focus: 'rgba(124, 58, 237, 0.25)',
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: primaryColor,
          light: '#A78BFA',
          dark: '#1D4ED8',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: secondaryColor,
        light: '#FF6B72',
    dark: '#C4343C',  
          contrastText: '#111111',
        },
        error: { main: errorColor },
        warning: { main: warningColor },
        info: { main: infoColor },
        success: { main: successColor },
        background: {
          default: darkBackground,
          paper: darkPaper,
        },
        text: {
          primary: textDark,
          secondary: '#9CA3AF',
          disabled: '#4B5563',
        },
        action: {
          active: primaryColor,
          selected: 'rgba(124, 58, 237, 0.15)',
          disabled: 'rgba(255, 255, 255, 0.3)',
          disabledBackground: 'rgba(255, 255, 255, 0.1)',
          focus: 'rgba(124, 58, 237, 0.25)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Fira Code", monospace',
    h1: { fontSize: '3.8rem', fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.025em' },
    h3: { fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.02em' },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.9rem', lineHeight: 1.6 },
    subtitle1: { fontSize: '0.75rem', lineHeight: 1.7 },
    button: {
      textTransform: 'uppercase',
      fontWeight: 700,
    },
  },
})
