import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'primary',
      },
    },
  },
  palette: {
    background: {
      paper: '#fff',
      default: '#F8F8F8',
    },
    divider: '#E9E8EE',
    primary: {
      main: '#6202EE',
      light: '#F2E7FE',
      dark: '#190078',
    },
    secondary: {
      main: '#01A39D',
      light: '#86FFEA',
      dark: '#002F33',
    },
  },
});
