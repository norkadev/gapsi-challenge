import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#078bb5',
      dark: '#087da3',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f23b20',
      contrastText: '#fff',
    },
    background: {
      default: '#f7f8fa',
      paper: '#fff',
    },
    text: {
      primary: '#41474c',
      secondary: '#68747b',
    },
    divider: '#e1e5e8',
  },
  typography: {
    fontFamily: 'var(--app-font-family)',
    h1: {
      fontSize: '1.45rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 5,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--app-font-family': 'Arial, Helvetica, sans-serif',
          '--app-bg': '#f7f8fa',
          '--app-surface': '#fff',
          '--app-text': '#41474c',
          '--app-secondary-text': '#68747b',
          '--app-border': '#e1e5e8',
          '--app-subtle-surface': '#f1f2f3',
          '--app-row-alt': '#fbfcfd',
          '--app-row-hover': '#f0f8fc',
          '--app-version-text': '#737a7f',
          '--app-card-shadow': '0 2px 6px rgb(22 42 55 / 12%)',
          '--app-brand': '#078bb5',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'var(--app-border)',
        },
        head: {
          color: 'var(--app-secondary-text)',
          fontWeight: 600,
        },
      },
    },
  },
})
